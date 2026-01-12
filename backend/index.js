#!/usr/bin/env node

/**
 * GitHub Projects V2 Populator
 * Automates creation and population of GitHub Projects for WordPress development workflow
 */

import { graphql } from '@octokit/graphql';
import chalk from 'chalk';
import ora from 'ora';
import dotenv from 'dotenv';
import projectConfig from './config/wordpress-project.config.js';

dotenv.config();

// Configuration
const config = {
  token: process.env.GITHUB_TOKEN,
  owner: process.env.GITHUB_OWNER,
  repo: process.env.GITHUB_REPO,
  projectNumber: process.env.PROJECT_NUMBER ? parseInt(process.env.PROJECT_NUMBER) : null,
  dryRun: process.argv.includes('--dry-run'),
  clientName: process.env.CLIENT_NAME || 'Client Project'
};

// Validate configuration
function validateConfig() {
  const missing = [];
  if (!config.token) missing.push('GITHUB_TOKEN');
  if (!config.owner) missing.push('GITHUB_OWNER');
  if (!config.repo) missing.push('GITHUB_REPO');
  
  if (missing.length > 0) {
    console.error(chalk.red('Missing required environment variables:'), missing.join(', '));
    console.log(chalk.yellow('\nCreate a .env file with:'));
    console.log('GITHUB_TOKEN=your_github_personal_access_token');
    console.log('GITHUB_OWNER=your_username_or_org');
    console.log('GITHUB_REPO=your_repository_name');
    console.log('PROJECT_NUMBER=optional_existing_project_number');
    console.log('CLIENT_NAME=optional_client_name');
    process.exit(1);
  }
}

// Initialize GraphQL client
const graphqlWithAuth = graphql.defaults({
  headers: {
    authorization: `token ${config.token}`,
  },
});

// GraphQL Queries and Mutations
const queries = {
  // Get repository ID
  getRepoId: `
    query($owner: String!, $repo: String!) {
      repository(owner: $owner, name: $repo) {
        id
      }
    }
  `,

  // Get user/org ID for project creation
  getOwnerId: `
    query($owner: String!) {
      user(login: $owner) {
        id
      }
    }
  `,

  // Get organization ID
  getOrgId: `
    query($owner: String!) {
      organization(login: $owner) {
        id
      }
    }
  `,

  // Get existing project (user)
  getProject: `
    query($owner: String!, $projectNumber: Int!) {
      user(login: $owner) {
        projectV2(number: $projectNumber) {
          id
          title
          fields(first: 20) {
            nodes {
              ... on ProjectV2Field {
                id
                name
              }
              ... on ProjectV2SingleSelectField {
                id
                name
                options {
                  id
                  name
                }
              }
            }
          }
        }
      }
    }
  `,

  // Get existing project (organization)
  getOrgProject: `
    query($owner: String!, $projectNumber: Int!) {
      organization(login: $owner) {
        projectV2(number: $projectNumber) {
          id
          title
          fields(first: 20) {
            nodes {
              ... on ProjectV2Field {
                id
                name
              }
              ... on ProjectV2SingleSelectField {
                id
                name
                options {
                  id
                  name
                }
              }
            }
          }
        }
      }
    }
  `,

  // Create new project
  createProject: `
    mutation($ownerId: ID!, $title: String!) {
      createProjectV2(input: {
        ownerId: $ownerId
        title: $title
      }) {
        projectV2 {
          id
          number
          url
        }
      }
    }
  `,

  // Create single select field
  createSingleSelectField: `
    mutation($projectId: ID!, $name: String!) {
      createProjectV2Field(input: {
        projectId: $projectId
        dataType: SINGLE_SELECT
        name: $name
      }) {
        projectV2Field {
          ... on ProjectV2SingleSelectField {
            id
            name
          }
        }
      }
    }
  `,

  // Create number field
  createNumberField: `
    mutation($projectId: ID!, $name: String!) {
      createProjectV2Field(input: {
        projectId: $projectId
        dataType: NUMBER
        name: $name
      }) {
        projectV2Field {
          ... on ProjectV2Field {
            id
            name
          }
        }
      }
    }
  `,

  // Update single select field options
  updateSingleSelectField: `
    mutation($projectId: ID!, $fieldId: ID!, $name: String!, $options: [ProjectV2SingleSelectFieldOptionInput!]!) {
      updateProjectV2Field(input: {
        projectId: $projectId
        fieldId: $fieldId
        name: $name
        singleSelectOptions: $options
      }) {
        projectV2Field {
          ... on ProjectV2SingleSelectField {
            id
            options {
              id
              name
            }
          }
        }
      }
    }
  `,

  // Create issue
  createIssue: `
    mutation($repositoryId: ID!, $title: String!, $body: String!, $labelIds: [ID!]) {
      createIssue(input: {
        repositoryId: $repositoryId
        title: $title
        body: $body
        labelIds: $labelIds
      }) {
        issue {
          id
          number
          url
        }
      }
    }
  `,

  // Add item to project
  addToProject: `
    mutation($projectId: ID!, $contentId: ID!) {
      addProjectV2ItemById(input: {
        projectId: $projectId
        contentId: $contentId
      }) {
        item {
          id
        }
      }
    }
  `,

  // Update project item field value
  updateItemField: `
    mutation($projectId: ID!, $itemId: ID!, $fieldId: ID!, $value: ProjectV2FieldValue!) {
      updateProjectV2ItemFieldValue(input: {
        projectId: $projectId
        itemId: $itemId
        fieldId: $fieldId
        value: $value
      }) {
        projectV2Item {
          id
        }
      }
    }
  `,

  // Create label
  createLabel: `
    mutation($repositoryId: ID!, $name: String!, $color: String!, $description: String) {
      createLabel(input: {
        repositoryId: $repositoryId
        name: $name
        color: $color
        description: $description
      }) {
        label {
          id
          name
        }
      }
    }
  `,

  // Get existing labels
  getLabels: `
    query($owner: String!, $repo: String!) {
      repository(owner: $owner, name: $repo) {
        labels(first: 100) {
          nodes {
            id
            name
          }
        }
      }
    }
  `
};

// Main class
class GitHubProjectPopulator {
  constructor() {
    this.repoId = null;
    this.ownerId = null;
    this.projectId = null;
    this.projectNumber = null;
    this.fields = {};
    this.labels = {};
  }

  async run() {
    console.log(chalk.cyan.bold('\n🚀 GitHub Projects V2 Populator\n'));
    
    if (config.dryRun) {
      console.log(chalk.yellow('⚠️  DRY RUN MODE - No changes will be made\n'));
    }

    try {
      await this.initialize();
      await this.setupLabels();
      await this.setupProject();
      await this.createTasks();
      
      console.log(chalk.green.bold('\n✅ Project population complete!'));
      console.log(chalk.cyan(`\nView your project at: https://github.com/users/${config.owner}/projects/${this.projectNumber}\n`));
    } catch (error) {
      console.error(chalk.red('\n❌ Error:'), error.message);
      if (error.errors) {
        error.errors.forEach(e => console.error(chalk.red('  -'), e.message));
      }
      process.exit(1);
    }
  }

  async initialize() {
    const spinner = ora('Initializing...').start();

    // Get repository ID
    const repoResult = await graphqlWithAuth(queries.getRepoId, {
      owner: config.owner,
      repo: config.repo
    });
    this.repoId = repoResult.repository.id;

    // Try to get user ID first, then org ID
    try {
      const userResult = await graphqlWithAuth(queries.getOwnerId, { owner: config.owner });
      this.ownerId = userResult.user.id;
    } catch {
      const orgResult = await graphqlWithAuth(queries.getOrgId, { owner: config.owner });
      this.ownerId = orgResult.organization.id;
    }

    spinner.succeed('Initialized successfully');
  }

  async setupLabels() {
    const spinner = ora('Setting up labels...').start();

    if (config.dryRun) {
      spinner.succeed('Labels setup (dry run)');
      projectConfig.labels.forEach(l => { this.labels[l.name] = `dry-run-${l.name}`; });
      return;
    }

    // Get existing labels
    const existingLabels = await graphqlWithAuth(queries.getLabels, {
      owner: config.owner,
      repo: config.repo
    });
    
    existingLabels.repository.labels.nodes.forEach(label => {
      this.labels[label.name] = label.id;
    });

    // Create missing labels
    for (const label of projectConfig.labels) {
      if (!this.labels[label.name]) {
        try {
          const result = await graphqlWithAuth(queries.createLabel, {
            repositoryId: this.repoId,
            name: label.name,
            color: label.color,
            description: label.description
          });
          this.labels[label.name] = result.createLabel.label.id;
        } catch (error) {
          // Label might already exist with different casing
          console.log(chalk.yellow(`\n  ⚠️ Couldn't create label: ${label.name}`));
        }
      }
    }

    spinner.succeed(`Labels configured (${Object.keys(this.labels).length} total)`);
  }

  async setupProject() {
    const spinner = ora('Setting up project...').start();

    if (config.dryRun) {
      spinner.succeed('Project setup (dry run)');
      this.projectId = 'dry-run-project-id';
      this.projectNumber = 999;
      Object.keys(projectConfig.customFields).forEach(key => {
        this.fields[key] = { id: `dry-run-field-${key}`, options: {} };
      });
      return;
    }

    // Create new project or use existing
    if (config.projectNumber) {
      spinner.text = 'Loading existing project...';
      let result;
      let projectData;

      // Try organization first, then fall back to user
      try {
        result = await graphqlWithAuth(queries.getOrgProject, {
          owner: config.owner,
          projectNumber: config.projectNumber
        });
        projectData = result.organization.projectV2;
      } catch (orgError) {
        try {
          result = await graphqlWithAuth(queries.getProject, {
            owner: config.owner,
            projectNumber: config.projectNumber
          });
          projectData = result.user.projectV2;
        } catch (userError) {
          throw new Error(`Could not find project #${config.projectNumber} for ${config.owner}`);
        }
      }

      this.projectId = projectData.id;
      this.projectNumber = config.projectNumber;

      // Map existing fields
      projectData.fields.nodes.forEach(field => {
        this.fields[field.name.toLowerCase().replace(/\s+/g, '')] = {
          id: field.id,
          options: field.options ? Object.fromEntries(field.options.map(o => [o.name, o.id])) : {}
        };
      });
    } else {
      spinner.text = 'Creating new project...';
      const projectTitle = `${config.clientName} - WordPress Development`;
      const result = await graphqlWithAuth(queries.createProject, {
        ownerId: this.ownerId,
        title: projectTitle
      });
      this.projectId = result.createProjectV2.projectV2.id;
      this.projectNumber = result.createProjectV2.projectV2.number;
    }

    // Create custom fields
    spinner.text = 'Creating custom fields...';
    for (const [key, fieldDef] of Object.entries(projectConfig.customFields)) {
      const normalizedKey = key.toLowerCase().replace(/\s+/g, '');
      if (!this.fields[normalizedKey]) {
        try {
          if (fieldDef.type === 'SINGLE_SELECT') {
            const result = await graphqlWithAuth(queries.createSingleSelectField, {
              projectId: this.projectId,
              name: fieldDef.name
            });
            const fieldId = result.createProjectV2Field.projectV2Field.id;

            // Add options
            const options = fieldDef.options.map((opt, i) => ({
              name: opt,
              color: ['GRAY', 'BLUE', 'GREEN', 'YELLOW', 'ORANGE', 'RED', 'PINK', 'PURPLE'][i % 8]
            }));

            const updateResult = await graphqlWithAuth(queries.updateSingleSelectField, {
              projectId: this.projectId,
              fieldId: fieldId,
              name: fieldDef.name,
              options: options
            });

            this.fields[normalizedKey] = {
              id: fieldId,
              options: Object.fromEntries(
                updateResult.updateProjectV2Field.projectV2Field.options.map(o => [o.name, o.id])
              )
            };
            console.log(chalk.green(`  ✓ Created field: ${fieldDef.name} with ${options.length} options`));
          } else if (fieldDef.type === 'NUMBER') {
            const result = await graphqlWithAuth(queries.createNumberField, {
              projectId: this.projectId,
              name: fieldDef.name
            });
            this.fields[normalizedKey] = {
              id: result.createProjectV2Field.projectV2Field.id,
              options: {}
            };
            console.log(chalk.green(`  ✓ Created field: ${fieldDef.name} (number)`));
          }
        } catch (error) {
          console.log(chalk.yellow(`\n  ⚠️ Field may already exist: ${fieldDef.name}`));
        }
      } else {
        console.log(chalk.cyan(`  ↪ Field already exists: ${fieldDef.name}`));
      }
    }

    spinner.succeed(`Project ready: #${this.projectNumber}`);
  }

  async createTasks() {
    const totalTasks = projectConfig.phases.reduce((sum, phase) => sum + phase.tasks.length, 0);
    let taskCount = 0;

    console.log(chalk.cyan(`\n📝 Creating ${totalTasks} tasks across ${projectConfig.phases.length} phases...\n`));

    for (const phase of projectConfig.phases) {
      console.log(chalk.blue.bold(`\n  Phase: ${phase.name} (${phase.percentage}% | ${phase.days} days)`));

      for (const task of phase.tasks) {
        taskCount++;
        const spinner = ora(`  [${taskCount}/${totalTasks}] ${task.title}`).start();

        if (config.dryRun) {
          spinner.succeed();
          continue;
        }

        try {
          // Create issue body with checklist
          const body = this.createIssueBody(task, phase);
          
          // Get label IDs
          const labelIds = (task.labels || [])
            .filter(label => this.labels[label])
            .map(label => this.labels[label]);

          // Create issue
          const issueResult = await graphqlWithAuth(queries.createIssue, {
            repositoryId: this.repoId,
            title: `[${phase.name}] ${task.title}`,
            body: body,
            labelIds: labelIds.length > 0 ? labelIds : null
          });

          const issueId = issueResult.createIssue.issue.id;

          // Add to project
          const addResult = await graphqlWithAuth(queries.addToProject, {
            projectId: this.projectId,
            contentId: issueId
          });

          const itemId = addResult.addProjectV2ItemById.item.id;

          // Set field values
          await this.setFieldValues(itemId, task, phase);

          spinner.succeed();
        } catch (error) {
          spinner.fail(chalk.red(`Failed: ${error.message}`));
        }

        // Rate limiting - small delay between API calls
        await this.delay(100);
      }
    }
  }

  createIssueBody(task, phase) {
    let body = `## Description\n${task.description}\n\n`;
    body += `## Phase Details\n`;
    body += `- **Phase:** ${phase.name}\n`;
    body += `- **Time Allocation:** ${task.percentage}%\n`;
    body += `- **Priority:** ${task.priority}\n\n`;
    
    if (task.checklist && task.checklist.length > 0) {
      body += `## Checklist\n`;
      task.checklist.forEach(item => {
        body += `- [ ] ${item}\n`;
      });
    }

    if (task.conditions) {
      body += `\n## Conditions\n`;
      body += `This task applies when: ${task.conditions.join(', ')}\n`;
    }

    body += `\n---\n*Generated by GitHub Project Populator*`;
    return body;
  }

  async setFieldValues(itemId, task, phase) {
    // Set Phase Number (e.g., "1", "2", "3")
    const phaseNumberField = this.fields['phasenumber'];
    if (phaseNumberField && phaseNumberField.options) {
      const phaseNum = phase.id.split('-')[1]; // Extract number from "phase-1"
      if (phaseNumberField.options[phaseNum]) {
        console.log(`Setting phase number "${phaseNum}" for item ${itemId}`);
        await this.updateField(itemId, phaseNumberField.id, { singleSelectOptionId: phaseNumberField.options[phaseNum] });
      }
    }

    // Set Phase Description (e.g., "Discovery", "Planning")
    const phaseDescField = this.fields['phasedescription'];
    if (phaseDescField && phaseDescField.options) {
      if (phaseDescField.options[phase.name]) {
        console.log(`Setting phase description "${phase.name}" for item ${itemId}`);
        await this.updateField(itemId, phaseDescField.id, { singleSelectOptionId: phaseDescField.options[phase.name] });
      }
    }

    // Set Activity Number
    const activityField = this.fields['activitynumber'];
    if (activityField && task.activityNumber) {
      console.log(`Setting activity number ${task.activityNumber} for item ${itemId}`);
      await this.updateField(itemId, activityField.id, { number: task.activityNumber });
    }

    // Set Priority
    const priorityField = this.fields['priority'];
    if (priorityField && priorityField.options[task.priority]) {
      await this.updateField(itemId, priorityField.id, { singleSelectOptionId: priorityField.options[task.priority] });
    }

    // Set Status to Backlog
    const statusField = this.fields['status'];
    if (statusField && statusField.options['Backlog']) {
      await this.updateField(itemId, statusField.id, { singleSelectOptionId: statusField.options['Backlog'] });
    }

    // Set Time Allocation
    const timeField = this.fields['time%'];
    if (timeField) {
      await this.updateField(itemId, timeField.id, { number: task.percentage });
    }

    // Set Estimated Days (auto-calculated from percentage and total project days)
    const estDaysField = this.fields['est.days'];
    if (estDaysField) {
      const estimatedDays = (task.percentage / 100) * projectConfig.totalDays;
      await this.updateField(itemId, estDaysField.id, { number: parseFloat(estimatedDays.toFixed(2)) });
    }
  }

  async updateField(itemId, fieldId, value) {
    try {
      await graphqlWithAuth(queries.updateItemField, {
        projectId: this.projectId,
        itemId: itemId,
        fieldId: fieldId,
        value: value
      });
    } catch (error) {
      console.error(`Failed to update field ${fieldId} for item ${itemId}:`, error.message);
      // Non-critical error, continue
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Run
validateConfig();
const populator = new GitHubProjectPopulator();
populator.run();
