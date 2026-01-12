#!/usr/bin/env node

/**
 * Generate Comprehensive Markdown Report for All GitHub Projects
 * Usage: npm run report-all
 */

import { graphql } from '@octokit/graphql';
import chalk from 'chalk';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const config = {
  token: process.env.GITHUB_TOKEN,
  owner: process.env.GITHUB_OWNER
};

if (!config.token || !config.owner) {
  console.error(chalk.red('Missing GITHUB_TOKEN or GITHUB_OWNER in .env file'));
  process.exit(1);
}

const graphqlWithAuth = graphql.defaults({
  headers: { authorization: `token ${config.token}` }
});

const projectsFragment = `
  projectsV2(first: 50) {
    nodes {
      id
      number
      title
      url
      closed
      createdAt
      updatedAt
      items(first: 100) {
        totalCount
        nodes {
          id
          type
          fieldValues(first: 50) {
            nodes {
              ... on ProjectV2ItemFieldTextValue {
                text
                field {
                  ... on ProjectV2FieldCommon {
                    name
                  }
                }
              }
              ... on ProjectV2ItemFieldNumberValue {
                number
                field {
                  ... on ProjectV2FieldCommon {
                    name
                  }
                }
              }
              ... on ProjectV2ItemFieldSingleSelectValue {
                name
                field {
                  ... on ProjectV2FieldCommon {
                    name
                  }
                }
              }
            }
          }
          content {
            ... on Issue {
              number
              title
              url
              state
              createdAt
              updatedAt
              assignees(first: 10) {
                nodes {
                  login
                  name
                }
              }
            }
          }
        }
      }
    }
  }
`;

const orgQuery = `
  query($owner: String!) {
    organization(login: $owner) {
      ${projectsFragment}
    }
  }
`;

const userQuery = `
  query($owner: String!) {
    user(login: $owner) {
      ${projectsFragment}
    }
  }
`;

function getFieldValue(item, fieldName) {
  const field = item.fieldValues.nodes.find(
    f => f.field && f.field.name === fieldName
  );
  if (!field) return null;
  return field.name || field.text || field.number || null;
}

function analyzeProject(project) {
  const items = project.items.nodes.filter(item => item.content);
  const totalTasks = items.length;

  let completed = 0;
  let inProgress = 0;
  let blocked = 0;
  let todo = 0;
  let backlog = 0;

  const phases = {};
  const priorities = {};
  const developers = {};
  const inProgressItems = [];
  const blockedItems = [];

  items.forEach(item => {
    const status = getFieldValue(item, 'Status') || 'Unknown';
    const phase = getFieldValue(item, 'Phase') || 'Unassigned';
    const priority = getFieldValue(item, 'Priority') || 'Unknown';

    // Check custom Developer field first, then fall back to GitHub Assignees
    let developer = getFieldValue(item, 'Developer');
    if (!developer && item.content && item.content.assignees && item.content.assignees.nodes.length > 0) {
      // Use first assignee's name or login
      const assignee = item.content.assignees.nodes[0];
      developer = assignee.name || assignee.login;
    }
    developer = developer || 'Unassigned';

    if (status === 'Done') completed++;
    else if (status === 'In Progress') {
      inProgress++;
      inProgressItems.push(item);
    }
    else if (status === 'Blocked') {
      blocked++;
      blockedItems.push(item);
    }
    else if (status === 'To Do') todo++;
    else if (status === 'Backlog') backlog++;

    phases[phase] = (phases[phase] || 0) + 1;
    priorities[priority] = (priorities[priority] || 0) + 1;
    developers[developer] = (developers[developer] || 0) + 1;
  });

  const progressPercent = totalTasks > 0 ? Math.round((completed / totalTasks) * 100) : 0;
  const currentPhase = Object.keys(phases).find(p => phases[p] === Math.max(...Object.values(phases))) || 'N/A';
  const primaryDeveloper = Object.keys(developers).find(d => developers[d] === Math.max(...Object.values(developers))) || 'Unassigned';

  return {
    totalTasks,
    completed,
    inProgress,
    blocked,
    todo,
    backlog,
    progressPercent,
    currentPhase,
    primaryDeveloper,
    phases,
    priorities,
    developers,
    inProgressItems,
    blockedItems
  };
}

function generateMarkdown(projects) {
  const timestamp = new Date().toLocaleString();
  const activeProjects = projects.filter(p => !p.closed);
  const closedProjects = projects.filter(p => p.closed);

  let md = `# All Projects Portfolio Report\n\n`;
  md += `**Generated:** ${timestamp}\n\n`;
  md += `**Total Projects:** ${projects.length}\n\n`;
  md += `**Active Projects:** ${activeProjects.length} | **Closed Projects:** ${closedProjects.length}\n\n`;
  md += `---\n\n`;

  // Executive Summary
  md += `## 📊 Executive Summary\n\n`;

  const portfolioStats = {
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    blockedTasks: 0
  };

  const analyses = projects.map(p => ({
    project: p,
    analysis: analyzeProject(p)
  }));

  analyses.forEach(({ analysis }) => {
    portfolioStats.totalTasks += analysis.totalTasks;
    portfolioStats.completedTasks += analysis.completed;
    portfolioStats.inProgressTasks += analysis.inProgress;
    portfolioStats.blockedTasks += analysis.blocked;
  });

  const overallProgress = portfolioStats.totalTasks > 0
    ? Math.round((portfolioStats.completedTasks / portfolioStats.totalTasks) * 100)
    : 0;

  md += `| Metric | Count |\n`;
  md += `|--------|-------|\n`;
  md += `| **Total Tasks Across All Projects** | ${portfolioStats.totalTasks} |\n`;
  md += `| **Completed Tasks** | ${portfolioStats.completedTasks} (${overallProgress}%) |\n`;
  md += `| **In Progress** | ${portfolioStats.inProgressTasks} |\n`;
  md += `| **Blocked** | ${portfolioStats.blockedTasks} |\n`;
  md += `| **Remaining** | ${portfolioStats.totalTasks - portfolioStats.completedTasks} |\n\n`;

  md += `---\n\n`;

  // Active Projects Overview
  if (activeProjects.length > 0) {
    md += `## 🟢 Active Projects Overview\n\n`;
    md += `| # | Project Name | Progress | Developer | To Do | Done |\n`;
    md += `|---|--------------|----------|-----------|-------|------|\n`;

    analyses
      .filter(({ project }) => !project.closed)
      .sort((a, b) => b.analysis.progressPercent - a.analysis.progressPercent)
      .forEach(({ project, analysis }) => {
        const progressBar = '█'.repeat(Math.round(analysis.progressPercent / 10)) + '░'.repeat(10 - Math.round(analysis.progressPercent / 10));
        const todoCount = analysis.totalTasks - analysis.completed - analysis.inProgress;
        const doneCount = `${analysis.completed}/${analysis.totalTasks}`;

        md += `| **[#${project.number}](${project.url})** | ${project.title} | ${progressBar} ${analysis.progressPercent}% | ${analysis.primaryDeveloper} | ${todoCount} | ${doneCount} |\n`;
      });

    md += `\n`;
  }

  md += `---\n\n`;

  // Detailed Project Breakdowns
  md += `## 📋 Detailed Project Reports\n\n`;

  analyses
    .filter(({ project }) => !project.closed)
    .sort((a, b) => a.project.number - b.project.number)
    .forEach(({ project, analysis }) => {
      md += `### Project #${project.number}: ${project.title}\n\n`;
      md += `🔗 **[VIEW PROJECT BOARD](${project.url})**\n\n`;
      md += `**Created:** ${new Date(project.createdAt).toLocaleDateString()} | **Updated:** ${new Date(project.updatedAt).toLocaleDateString()}\n\n`;

      // Progress Summary
      md += `#### Progress\n\n`;
      const progressBar = '█'.repeat(Math.round(analysis.progressPercent / 2)) + '░'.repeat(50 - Math.round(analysis.progressPercent / 2));
      md += `${progressBar} **${analysis.progressPercent}%**\n\n`;

      md += `| Status | Count |\n`;
      md += `|--------|-------|\n`;
      md += `| Completed | ${analysis.completed} |\n`;
      md += `| In Progress | ${analysis.inProgress} |\n`;
      md += `| To Do | ${analysis.todo} |\n`;
      md += `| Backlog | ${analysis.backlog} |\n`;
      if (analysis.blocked > 0) {
        md += `| **Blocked** | **${analysis.blocked}** ⚠️ |\n`;
      }
      md += `| **Total** | **${analysis.totalTasks}** |\n\n`;

      // In Progress Items
      if (analysis.inProgressItems.length > 0) {
        md += `#### 🔄 Currently In Progress\n\n`;
        analysis.inProgressItems.forEach(item => {
          const phase = getFieldValue(item, 'Phase') || 'No Phase';

          // Check custom Developer field first, then fall back to GitHub Assignees
          let developer = getFieldValue(item, 'Developer');
          if (!developer && item.content && item.content.assignees && item.content.assignees.nodes.length > 0) {
            const assignee = item.content.assignees.nodes[0];
            developer = assignee.name || assignee.login;
          }
          developer = developer || 'Unassigned';

          const priority = getFieldValue(item, 'Priority') || '';
          const priorityIcon = priority === 'Critical' ? '🔴' : priority === 'High' ? '🟠' : priority === 'Medium' ? '🟡' : '🟢';
          md += `- ${priorityIcon} [#${item.content.number}](${item.content.url}) ${item.content.title} *(${phase} - ${developer})*\n`;
        });
        md += `\n`;
      }

      // Blocked Items
      if (analysis.blockedItems.length > 0) {
        md += `#### 🚫 Blocked Items ⚠️\n\n`;
        analysis.blockedItems.forEach(item => {
          const phase = getFieldValue(item, 'Phase') || 'No Phase';
          md += `- [#${item.content.number}](${item.content.url}) ${item.content.title} *(${phase})*\n`;
        });
        md += `\n`;
      }

      // Phase Distribution
      md += `#### Phase Distribution\n\n`;
      const sortedPhases = Object.entries(analysis.phases).sort((a, b) => b[1] - a[1]);
      sortedPhases.forEach(([phase, count]) => {
        md += `- **${phase}:** ${count} tasks\n`;
      });
      md += `\n`;

      // Priority Breakdown
      md += `#### Priority Breakdown\n\n`;
      const priorityOrder = ['Critical', 'High', 'Medium', 'Low'];
      priorityOrder.forEach(priority => {
        if (analysis.priorities[priority]) {
          md += `- **${priority}:** ${analysis.priorities[priority]} tasks\n`;
        }
      });
      md += `\n`;

      // Developer Assignments
      if (Object.keys(analysis.developers).length > 1 || !analysis.developers['Unassigned']) {
        md += `#### Developer Assignments\n\n`;
        Object.entries(analysis.developers)
          .filter(([dev]) => dev !== 'Unassigned')
          .sort((a, b) => b[1] - a[1])
          .forEach(([developer, count]) => {
            md += `- **${developer}:** ${count} tasks\n`;
          });
        md += `\n`;
      }

      md += `---\n\n`;
    });

  // Closed Projects
  if (closedProjects.length > 0) {
    md += `## 🔴 Closed Projects\n\n`;
    md += `| # | Project Name | Tasks | Completed | Closed Date |\n`;
    md += `|---|--------------|-------|-----------|-------------|\n`;

    closedProjects.forEach(project => {
      const analysis = analyzeProject(project);
      md += `| #${project.number} | ${project.title} | ${analysis.totalTasks} | ${analysis.completed} | ${new Date(project.updatedAt).toLocaleDateString()} |\n`;
    });

    md += `\n`;
  }

  md += `---\n\n`;

  // Portfolio Health Indicators
  md += `## 🏥 Portfolio Health Indicators\n\n`;

  const healthMetrics = {
    blockedProjects: analyses.filter(({ analysis }) => analysis.blocked > 0).length,
    onTrack: analyses.filter(({ analysis }) => analysis.inProgress > 0 && analysis.blocked === 0).length,
    notStarted: analyses.filter(({ analysis }) => analysis.backlog === analysis.totalTasks).length,
    completed: analyses.filter(({ analysis }) => analysis.progressPercent === 100).length
  };

  md += `| Metric | Count |\n`;
  md += `|--------|-------|\n`;
  md += `| ✅ Completed Projects | ${healthMetrics.completed} |\n`;
  md += `| 🟢 On Track | ${healthMetrics.onTrack} |\n`;
  md += `| ⏳ Not Started | ${healthMetrics.notStarted} |\n`;
  if (healthMetrics.blockedProjects > 0) {
    md += `| ⚠️ **Projects with Blockers** | **${healthMetrics.blockedProjects}** |\n`;
  }
  md += `\n`;

  // Risk Assessment
  const riskyProjects = analyses.filter(({ analysis }) =>
    analysis.blocked > 0 || (analysis.progressPercent < 30 && analysis.inProgress === 0)
  );

  if (riskyProjects.length > 0) {
    md += `### ⚠️ Projects Requiring Attention\n\n`;
    riskyProjects.forEach(({ project, analysis }) => {
      md += `- **[#${project.number}](${project.url}) ${project.title}**\n`;
      if (analysis.blocked > 0) {
        md += `  - 🚫 ${analysis.blocked} blocked tasks\n`;
      }
      if (analysis.progressPercent < 30 && analysis.inProgress === 0) {
        md += `  - ⚠️ Low progress (${analysis.progressPercent}%) with no active tasks\n`;
      }
    });
    md += `\n`;
  }

  md += `---\n\n`;
  md += `*Report generated by GitHub Project Populator*\n`;

  return md;
}

async function generateReport() {
  console.log(chalk.cyan.bold('\n📊 Generating All Projects Report\n'));

  try {
    let result;
    let projects;

    // Try organization first, then fall back to user
    try {
      result = await graphqlWithAuth(orgQuery, { owner: config.owner });
      projects = result.organization.projectsV2.nodes;
    } catch (orgError) {
      try {
        result = await graphqlWithAuth(userQuery, { owner: config.owner });
        projects = result.user.projectsV2.nodes;
      } catch (userError) {
        throw new Error(`Could not find user or organization: ${config.owner}`);
      }
    }

    if (projects.length === 0) {
      console.log(chalk.yellow('No projects found.'));
      process.exit(0);
    }

    console.log(chalk.cyan(`Found ${projects.length} projects. Analyzing...\n`));

    const markdown = generateMarkdown(projects);

    // Create reports directory if it doesn't exist
    const reportsDir = path.join(process.cwd(), 'reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    // Generate filename
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `all_projects_portfolio_${timestamp}.md`;
    const filepath = path.join(reportsDir, filename);

    // Write file
    fs.writeFileSync(filepath, markdown, 'utf8');

    console.log(chalk.green.bold('✅ Report generated successfully!\n'));
    console.log(chalk.cyan(`Projects analyzed: ${projects.length}`));
    console.log(chalk.cyan(`Total tasks: ${projects.reduce((sum, p) => sum + p.items.totalCount, 0)}`));
    console.log(chalk.cyan(`File: ${filepath}\n`));

  } catch (error) {
    console.error(chalk.red('Error:'), error.message);
    if (error.errors) {
      error.errors.forEach(e => console.error(chalk.red('  -'), e.message));
    }
    process.exit(1);
  }
}

generateReport();
