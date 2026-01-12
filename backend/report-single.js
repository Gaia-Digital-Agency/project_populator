#!/usr/bin/env node

/**
 * Generate Markdown Report for a Single GitHub Project
 * Usage: PROJECT_NUMBER=1 npm run report-single
 *    or: PROJECT_NAME="My Project" npm run report-single
 */

import { graphql } from '@octokit/graphql';
import chalk from 'chalk';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const config = {
  token: process.env.GITHUB_TOKEN,
  owner: process.env.GITHUB_OWNER,
  projectNumber: process.env.PROJECT_NUMBER ? parseInt(process.env.PROJECT_NUMBER) : null,
  projectName: process.env.PROJECT_NAME || null
};

if (!config.token || !config.owner || (!config.projectNumber && !config.projectName)) {
  console.error(chalk.red('Missing required environment variables'));
  console.log(chalk.yellow('\nUsage: PROJECT_NUMBER=1 npm run report-single'));
  console.log(chalk.yellow('   or: PROJECT_NAME="My Project" npm run report-single'));
  console.log('Required in .env: GITHUB_TOKEN, GITHUB_OWNER');
  process.exit(1);
}

const graphqlWithAuth = graphql.defaults({
  headers: { authorization: `token ${config.token}` }
});

const listProjectsQuery = `
  query($owner: String!) {
    organization(login: $owner) {
      projectsV2(first: 100) {
        nodes {
          id
          number
          title
        }
      }
    }
  }
`;

const listProjectsUserQuery = `
  query($owner: String!) {
    user(login: $owner) {
      projectsV2(first: 100) {
        nodes {
          id
          number
          title
        }
      }
    }
  }
`;

const projectFieldsFragment = `
  id
  number
  title
  url
  closed
  createdAt
  updatedAt
  shortDescription
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
          labels(first: 10) {
            nodes {
              name
            }
          }
          assignees(first: 5) {
            nodes {
              login
            }
          }
        }
      }
    }
  }
`;

const queryByNumber = `
  query($owner: String!, $projectNumber: Int!) {
    organization(login: $owner) {
      projectV2(number: $projectNumber) {
        ${projectFieldsFragment}
      }
    }
  }
`;

const queryByNumberUser = `
  query($owner: String!, $projectNumber: Int!) {
    user(login: $owner) {
      projectV2(number: $projectNumber) {
        ${projectFieldsFragment}
      }
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

function generateMarkdown(project) {
  const timestamp = new Date().toLocaleString();
  const totalItems = project.items.totalCount;

  // Organize items by status and phase
  const items = project.items.nodes.filter(item => item.content);

  const byStatus = {};
  const byPhase = {};
  const byPriority = {};
  const byDeveloper = {};

  let completedCount = 0;
  let inProgressCount = 0;
  let blockedCount = 0;

  items.forEach(item => {
    const status = getFieldValue(item, 'Status') || 'Unknown';
    const phase = getFieldValue(item, 'Phase') || 'Unassigned';
    const priority = getFieldValue(item, 'Priority') || 'Unknown';
    const developer = getFieldValue(item, 'Developer') || 'Unassigned';

    if (!byStatus[status]) byStatus[status] = [];
    if (!byPhase[phase]) byPhase[phase] = [];
    if (!byPriority[priority]) byPriority[priority] = [];
    if (!byDeveloper[developer]) byDeveloper[developer] = [];

    byStatus[status].push(item);
    byPhase[phase].push(item);
    byPriority[priority].push(item);
    byDeveloper[developer].push(item);

    if (status === 'Done') completedCount++;
    if (status === 'In Progress') inProgressCount++;
    if (status === 'Blocked') blockedCount++;
  });

  const progressPercent = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

  let md = `# Project Report: ${project.title}\n\n`;
  md += `🔗 **[VIEW PROJECT BOARD](${project.url})**\n\n`;
  md += `**Generated:** ${timestamp}\n\n`;
  md += `**Project Number:** #${project.number}\n\n`;
  md += `**Status:** ${project.closed ? '🔴 Closed' : '🟢 Open'}\n\n`;
  md += `**Created:** ${new Date(project.createdAt).toLocaleDateString()}\n\n`;
  md += `**Last Updated:** ${new Date(project.updatedAt).toLocaleDateString()}\n\n`;

  md += `---\n\n`;

  // Progress Summary
  md += `## 📊 Progress Summary\n\n`;
  md += `| Metric | Count | Percentage |\n`;
  md += `|--------|-------|------------|\n`;
  md += `| **Total Tasks** | ${totalItems} | 100% |\n`;
  md += `| **Completed** | ${completedCount} | ${progressPercent}% |\n`;
  md += `| **In Progress** | ${inProgressCount} | ${totalItems > 0 ? Math.round((inProgressCount / totalItems) * 100) : 0}% |\n`;
  md += `| **Blocked** | ${blockedCount} | ${totalItems > 0 ? Math.round((blockedCount / totalItems) * 100) : 0}% |\n`;
  md += `| **Remaining** | ${totalItems - completedCount} | ${100 - progressPercent}% |\n\n`;

  // Progress Bar
  const barLength = 30;
  const filledLength = Math.round((completedCount / totalItems) * barLength);
  const progressBar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength);
  md += `**Progress:** ${progressBar} ${progressPercent}%\n\n`;

  md += `---\n\n`;

  // In Progress Items
  if (byStatus['In Progress'] && byStatus['In Progress'].length > 0) {
    md += `## 🔄 Currently In Progress\n\n`;
    byStatus['In Progress'].forEach(item => {
      const issue = item.content;
      const phase = getFieldValue(item, 'Phase') || 'No Phase';
      const developer = getFieldValue(item, 'Developer') || 'Unassigned';
      const priority = getFieldValue(item, 'Priority') || 'N/A';
      const priorityIcon = priority === 'Critical' ? '🔴' : priority === 'High' ? '🟠' : priority === 'Medium' ? '🟡' : '🟢';
      md += `- ${priorityIcon} **[#${issue.number}](${issue.url})** ${issue.title}\n`;
      md += `  - Phase: ${phase} | Developer: ${developer} | Priority: ${priority}\n`;
    });
    md += `\n---\n\n`;
  }

  // Blocked Items
  if (byStatus['Blocked'] && byStatus['Blocked'].length > 0) {
    md += `## 🚫 Blocked Items ⚠️\n\n`;
    byStatus['Blocked'].forEach(item => {
      const issue = item.content;
      const phase = getFieldValue(item, 'Phase') || 'No Phase';
      const priority = getFieldValue(item, 'Priority') || 'N/A';
      md += `- **[#${issue.number}](${issue.url})** ${issue.title}\n`;
      md += `  - Phase: ${phase} | Priority: ${priority}\n`;
    });
    md += `\n---\n\n`;
  }

  // Status Breakdown
  md += `## 📋 Status Breakdown\n\n`;
  const statusOrder = ['Backlog', 'To Do', 'In Progress', 'In Review', 'Done', 'Blocked'];
  statusOrder.forEach(status => {
    if (byStatus[status]) {
      md += `### ${status} (${byStatus[status].length})\n\n`;
      byStatus[status].forEach(item => {
        const issue = item.content;
        const phase = getFieldValue(item, 'Phase') || 'N/A';
        const priority = getFieldValue(item, 'Priority') || 'N/A';
        md += `- **[#${issue.number}](${issue.url})** ${issue.title}\n`;
        md += `  - Phase: ${phase} | Priority: ${priority}\n`;
      });
      md += `\n`;
    }
  });

  md += `---\n\n`;

  // Phase Breakdown
  md += `## 🎯 Phase Breakdown\n\n`;
  const phases = Object.keys(byPhase).sort();
  phases.forEach(phase => {
    const phaseTasks = byPhase[phase];
    const phaseCompleted = phaseTasks.filter(item => getFieldValue(item, 'Status') === 'Done').length;
    const phasePercent = phaseTasks.length > 0 ? Math.round((phaseCompleted / phaseTasks.length) * 100) : 0;

    md += `### ${phase}\n\n`;
    md += `**Progress:** ${phaseCompleted}/${phaseTasks.length} tasks (${phasePercent}%)\n\n`;

    phaseTasks.forEach(item => {
      const issue = item.content;
      const status = getFieldValue(item, 'Status') || 'Unknown';
      const priority = getFieldValue(item, 'Priority') || 'N/A';
      const statusIcon = status === 'Done' ? '✅' : status === 'In Progress' ? '🔄' : status === 'Blocked' ? '🚫' : '⏳';

      md += `- ${statusIcon} **[#${issue.number}](${issue.url})** ${issue.title}\n`;
      md += `  - Status: ${status} | Priority: ${priority}\n`;
    });
    md += `\n`;
  });

  md += `---\n\n`;

  // Priority Breakdown
  md += `## ⚡ Priority Breakdown\n\n`;
  const priorityOrder = ['Critical', 'High', 'Medium', 'Low'];
  priorityOrder.forEach(priority => {
    if (byPriority[priority] && byPriority[priority].length > 0) {
      md += `### ${priority} Priority (${byPriority[priority].length})\n\n`;
      byPriority[priority].forEach(item => {
        const issue = item.content;
        const status = getFieldValue(item, 'Status') || 'Unknown';
        md += `- **[#${issue.number}](${issue.url})** ${issue.title} - *${status}*\n`;
      });
      md += `\n`;
    }
  });

  md += `---\n\n`;

  // Developer Assignments
  md += `## 👥 Developer Assignments\n\n`;
  const developers = Object.keys(byDeveloper).sort();
  developers.forEach(developer => {
    const devTasks = byDeveloper[developer];
    const devCompleted = devTasks.filter(item => getFieldValue(item, 'Status') === 'Done').length;
    const devPercent = devTasks.length > 0 ? Math.round((devCompleted / devTasks.length) * 100) : 0;

    md += `### ${developer}\n\n`;
    md += `**Assigned:** ${devTasks.length} tasks | **Completed:** ${devCompleted} (${devPercent}%)\n\n`;

    devTasks.forEach(item => {
      const issue = item.content;
      const status = getFieldValue(item, 'Status') || 'Unknown';
      const phase = getFieldValue(item, 'Phase') || 'N/A';
      const statusIcon = status === 'Done' ? '✅' : status === 'In Progress' ? '🔄' : '⏳';

      md += `- ${statusIcon} **[#${issue.number}](${issue.url})** ${issue.title}\n`;
      md += `  - Phase: ${phase} | Status: ${status}\n`;
    });
    md += `\n`;
  });

  md += `---\n\n`;
  md += `*Report generated by GitHub Project Populator*\n`;

  return md;
}

async function findProjectByName(projectName) {
  try {
    let result;
    try {
      result = await graphqlWithAuth(listProjectsQuery, { owner: config.owner });
      return result.organization.projectsV2.nodes.find(p => p.title === projectName);
    } catch {
      result = await graphqlWithAuth(listProjectsUserQuery, { owner: config.owner });
      return result.user.projectsV2.nodes.find(p => p.title === projectName);
    }
  } catch (error) {
    return null;
  }
}

async function generateReport() {
  let projectNumber = config.projectNumber;

  // If project name is provided, find the project number
  if (config.projectName) {
    console.log(chalk.cyan.bold(`\n🔍 Finding project: "${config.projectName}"\n`));
    const project = await findProjectByName(config.projectName);

    if (!project) {
      console.error(chalk.red(`Project "${config.projectName}" not found`));
      console.log(chalk.yellow('\nRun "npm run list-projects" to see available projects'));
      process.exit(1);
    }

    projectNumber = project.number;
    console.log(chalk.green(`✓ Found project #${projectNumber}: ${project.title}\n`));
  }

  console.log(chalk.cyan.bold(`📄 Generating Report for Project #${projectNumber}\n`));

  try {
    let result;
    try {
      result = await graphqlWithAuth(queryByNumber, {
        owner: config.owner,
        projectNumber: projectNumber
      });
      var project = result.organization.projectV2;
    } catch {
      result = await graphqlWithAuth(queryByNumberUser, {
        owner: config.owner,
        projectNumber: projectNumber
      });
      var project = result.user.projectV2;
    }

    if (!project) {
      console.error(chalk.red(`Project #${projectNumber} not found`));
      process.exit(1);
    }

    const markdown = generateMarkdown(project);

    // Create reports directory if it doesn't exist
    const reportsDir = path.join(process.cwd(), 'reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    // Generate filename
    const timestamp = new Date().toISOString().split('T')[0];
    const sanitizedTitle = project.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const filename = `project_${config.projectNumber}_${sanitizedTitle}_${timestamp}.md`;
    const filepath = path.join(reportsDir, filename);

    // Write file
    fs.writeFileSync(filepath, markdown, 'utf8');

    // Calculate To Do count (tasks not completed)
    const items = project.items.nodes.filter(item => item.content);
    const todoCount = items.filter(item => {
      const status = getFieldValue(item, 'Status');
      return status !== 'Done';
    }).length;

    console.log(chalk.green.bold('✅ Report generated successfully!\n'));
    console.log(chalk.cyan(`Project: ${project.title}`));
    console.log(chalk.cyan(`Items: ${project.items.totalCount}`));
    console.log(chalk.cyan(`Created: ${new Date(project.createdAt).toLocaleDateString()}`));
    console.log(chalk.cyan(`Current To Dos: ${todoCount}`));
    console.log(chalk.cyan(`URL: ${project.url}`));
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
