#!/usr/bin/env node

/**
 * Batch Project Creator
 * Creates multiple WordPress development projects for parallel management
 * Designed for 6 developers × 6 projects workflow
 */

import { graphql } from '@octokit/graphql';
import chalk from 'chalk';
import ora from 'ora';
import dotenv from 'dotenv';
import readline from 'readline';

dotenv.config();

const config = {
  token: process.env.GITHUB_TOKEN,
  owner: process.env.GITHUB_OWNER,
  repo: process.env.GITHUB_REPO
};

// Validate configuration
if (!config.token || !config.owner || !config.repo) {
  console.error(chalk.red('Missing required environment variables. Check your .env file.'));
  process.exit(1);
}

const graphqlWithAuth = graphql.defaults({
  headers: { authorization: `token ${config.token}` }
});

// Sample clients for batch creation
const defaultClients = [
  { name: "Client Alpha", type: "E-Commerce", developer: "Dev 4 (BE/Ecom)" },
  { name: "Client Beta", type: "Corporate", developer: "Dev 1 (Lead)" },
  { name: "Client Gamma", type: "Portfolio", developer: "Dev 2 (FE)" },
  { name: "Client Delta", type: "Blog", developer: "Dev 3 (FE)" },
  { name: "Client Epsilon", type: "Static", developer: "Dev 2 (FE)" },
  { name: "Client Zeta", type: "Dynamic", developer: "Dev 5 (BE/Int)" }
];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise(resolve => rl.question(prompt, resolve));
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function isRateLimitError(error) {
  const message = (error?.message || '').toLowerCase();
  // This will catch both primary and secondary rate limit errors.
  return message.includes('rate limit') || message.includes('abuse detection');
}

function isSecondaryRateLimitError(error) {
  const message = (error?.message || '').toLowerCase();
  // Secondary rate limit messages often contain specific phrases.
  return message.includes('secondary rate limit') || message.includes('abuse detection');
}

async function getRateLimit() {
  const result = await graphqlWithAuth(`
    query {
      rateLimit {
        remaining
        resetAt
      }
    }
  `);
  return result.rateLimit;
}

async function waitForRateLimit(resetAt) {
  const resetMs = new Date(resetAt).getTime();
  const waitMs = Math.max(0, resetMs - Date.now()) + 5000;
  const waitSeconds = Math.ceil(waitMs / 1000);
  console.log(chalk.yellow(`Rate limit exceeded. Waiting ${waitSeconds}s until ${resetAt}...`));
  await sleep(waitMs);
}

async function getOwnerId() {
  try {
    const result = await graphqlWithAuth(`
      query($owner: String!) {
        user(login: $owner) { id }
      }
    `, { owner: config.owner });
    return result.user.id;
  } catch {
    const result = await graphqlWithAuth(`
      query($owner: String!) {
        organization(login: $owner) { id }
      }
    `, { owner: config.owner });
    return result.organization.id;
  }
}

async function createProject(ownerId, clientName) {
  const result = await graphqlWithAuth(`
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
  `, {
    ownerId,
    title: `${clientName} - WordPress Development`
  });
  
  return result.createProjectV2.projectV2;
}

async function main() {
  console.log(chalk.cyan.bold('\n🚀 Batch Project Creator\n'));
  console.log(chalk.gray('This tool creates multiple GitHub Projects for parallel WordPress development.\n'));

  // Show default clients
  console.log(chalk.yellow('Default client configuration:'));
  console.log(chalk.gray('─'.repeat(60)));
  defaultClients.forEach((client, i) => {
    console.log(`  ${i + 1}. ${client.name} (${client.type}) → ${client.developer}`);
  });
  console.log(chalk.gray('─'.repeat(60)));

  const useDefaults = await question('\nUse default client configuration? (y/n): ');
  
  let clients = defaultClients;
  
  if (useDefaults.toLowerCase() !== 'y') {
    clients = [];
    const numClients = parseInt(await question('How many projects to create? '), 10);
    
    for (let i = 0; i < numClients; i++) {
      console.log(chalk.cyan(`\nClient ${i + 1}:`));
      const name = await question('  Client name: ');
      const type = await question('  Site type (Static/Dynamic/E-Commerce/Portfolio/Corporate/Blog): ');
      clients.push({ name, type, developer: 'Unassigned' });
    }
  }

  console.log(chalk.yellow(`\nCreating ${clients.length} projects...`));
  const confirm = await question('Proceed? (y/n): ');
  
  if (confirm.toLowerCase() !== 'y') {
    console.log(chalk.red('Cancelled.'));
    rl.close();
    return;
  }

  try {
    try {
      const rateLimit = await getRateLimit();
      if (rateLimit.remaining < 1) {
        await waitForRateLimit(rateLimit.resetAt);
      }
    } catch {
      // Proceed even if rate limit query fails.
    }

    const ownerId = await getOwnerId();
    const createdProjects = [];

    for (const client of clients) {
      let spinner = ora(`Creating: ${client.name}`).start();
      
      try {
        const project = await createProject(ownerId, client.name);
        createdProjects.push({
          ...client,
          number: project.number,
          url: project.url
        });
        spinner.succeed(`Created: ${client.name} → Project #${project.number}`);
      } catch (error) {
        if (isRateLimitError(error)) {
          if (isSecondaryRateLimitError(error)) {
            spinner.warn(`Secondary rate limit hit. Pausing...`);
            // For secondary limits, a fixed, shorter wait is often better
            // than waiting for the primary limit reset.
            await sleep(30000); // Wait 30 seconds
          } else {
            spinner.warn(`Primary rate limit hit while creating: ${client.name}`);
            try {
              const rateLimit = await getRateLimit();
              await waitForRateLimit(rateLimit.resetAt);
            } catch (rateLimitError) {
              spinner.warn(`Could not fetch rate limit. Waiting 60s.`);
              await sleep(60000);
            }
          }
          try {
            spinner = ora(`Retrying: ${client.name}`).start();
            const project = await createProject(ownerId, client.name);
            createdProjects.push({
              ...client,
              number: project.number,
              url: project.url
            });
            spinner.succeed(`Created: ${client.name} → Project #${project.number}`);
          } catch (retryError) {
            spinner.fail(`Failed: ${client.name} - ${retryError.message}`);
          }
        } else {
          spinner.fail(`Failed: ${client.name} - ${error.message}`);
        }
      }

      // Rate limiting delay
      await sleep(500);
    }

    console.log(chalk.green.bold('\n✅ Batch creation complete!\n'));
    
    console.log(chalk.cyan('Created Projects:'));
    console.log(chalk.gray('─'.repeat(80)));
    console.log(chalk.gray('| # | Client Name      | Type       | Developer       | Project # |'));
    console.log(chalk.gray('─'.repeat(80)));
    
    createdProjects.forEach((p, i) => {
      console.log(`| ${(i + 1).toString().padEnd(1)} | ${p.name.padEnd(16)} | ${p.type.padEnd(10)} | ${p.developer.padEnd(15)} | #${p.number.toString().padEnd(8)} |`);
    });
    
    console.log(chalk.gray('─'.repeat(80)));

    console.log(chalk.yellow('\nNext Steps:'));
    console.log('  1. Set PROJECT_NUMBER=<number> in .env for each project');
    console.log('  2. Run: npm run populate');
    console.log('  3. Repeat for each project\n');

    console.log(chalk.cyan('Or use this bash loop to populate all:'));
    console.log(chalk.gray('─'.repeat(60)));
    console.log(createdProjects.map(p => 
      `PROJECT_NUMBER=${p.number} CLIENT_NAME="${p.name}" npm run populate`
    ).join('\n'));
    console.log(chalk.gray('─'.repeat(60)));

  } catch (error) {
    console.error(chalk.red('\nError:'), error.message);
  }

  rl.close();
}

main();
