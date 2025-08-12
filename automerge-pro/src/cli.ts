#!/usr/bin/env node

import { program } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import { LicenseService } from '../src/services/license';
import { ConfigService } from '../src/services/config';
import { GitHubService } from '../src/services/github';

program
  .name('automerge-pro-cli')
  .description('Automerge-Pro CLI for development and testing')
  .version('1.0.0');

// License management commands
const licenseCommand = program
  .command('license')
  .description('License management commands');

licenseCommand
  .command('generate')
  .description('Generate a development license')
  .requiredOption('-i, --installation-id <id>', 'GitHub installation ID')
  .option('-t, --tier <tier>', 'License tier (free, pro, enterprise)', 'enterprise')
  .option('-o, --output <file>', 'Output file for license token')
  .action(async (options) => {
    try {
      const licenseService = new LicenseService();
      const token = await licenseService.generateDevLicense(
        parseInt(options.installationId),
        options.tier
      );
      
      if (options.output) {
        fs.writeFileSync(options.output, token);
        console.log(`✅ License token written to ${options.output}`);
      } else {
        console.log('🔑 Development License Token:');
        console.log(token);
      }
      
      console.log(`\n📋 License Details:`);
      console.log(`   Installation ID: ${options.installationId}`);
      console.log(`   Tier: ${options.tier}`);
      console.log(`   Valid for: 30 days`);
    } catch (error: any) {
      console.error('❌ Error generating license:', error.message);
      process.exit(1);
    }
  });

licenseCommand
  .command('validate')
  .description('Validate a license')
  .requiredOption('-i, --installation-id <id>', 'GitHub installation ID')
  .action(async (options) => {
    try {
      const licenseService = new LicenseService();
      const license = await licenseService.validateLicense(parseInt(options.installationId));
      
      if (!license) {
        console.log('❌ License not found');
        process.exit(1);
      }
      
      console.log('📄 License Information:');
      console.log(`   Status: ${license.isActive ? '✅ Active' : '❌ Inactive'}`);
      console.log(`   Tier: ${license.tier}`);
      console.log(`   Features: ${license.features.join(', ')}`);
      
      if (license.expiresAt) {
        console.log(`   Expires: ${license.expiresAt}`);
      }
      
      if (license.trialEndsAt) {
        console.log(`   Trial ends: ${license.trialEndsAt}`);
      }
    } catch (error: any) {
      console.error('❌ Error validating license:', error.message);
      process.exit(1);
    }
  });

// Configuration commands
const configCommand = program
  .command('config')
  .description('Configuration management commands');

configCommand
  .command('generate')
  .description('Generate sample configuration')
  .option('-t, --tier <tier>', 'Configuration tier (free, pro, enterprise)', 'free')
  .option('-o, --output <file>', 'Output file', '.automerge-pro.yml')
  .action(async (options) => {
    try {
      // Mock services for config generation
      const githubService = new GitHubService('', '', '');
      const licenseService = new LicenseService();
      const configService = new ConfigService(githubService, licenseService);
      
      const sampleConfig = configService.generateSampleConfig(options.tier);
      fs.writeFileSync(options.output, sampleConfig);
      
      console.log(`✅ Sample ${options.tier} configuration written to ${options.output}`);
      console.log('\n📝 Configuration includes:');
      
      if (options.tier === 'free') {
        console.log('   • Basic auto-merge rules');
        console.log('   • Status check requirements');
        console.log('   • Review requirements');
      } else if (options.tier === 'pro') {
        console.log('   • Advanced merge rules with labels');
        console.log('   • Multiple merge strategies');
        console.log('   • Slack notifications');
        console.log('   • Custom rule priorities');
      } else if (options.tier === 'enterprise') {
        console.log('   • Security-focused rules');
        console.log('   • Multiple notification channels');
        console.log('   • Custom actions (comments, labels, assignments)');
        console.log('   • Complex conditional logic');
      }
    } catch (error: any) {
      console.error('❌ Error generating config:', error.message);
      process.exit(1);
    }
  });

configCommand
  .command('validate')
  .description('Validate configuration file')
  .requiredOption('-f, --file <file>', 'Configuration file path')
  .option('-i, --installation-id <id>', 'GitHub installation ID for license check')
  .action(async (options) => {
    try {
      if (!fs.existsSync(options.file)) {
        console.error(`❌ Configuration file not found: ${options.file}`);
        process.exit(1);
      }
      
      // Read and validate config file
      const configContent = fs.readFileSync(options.file, 'utf-8');
      const yaml = require('yaml');
      const config = yaml.parse(configContent);
      
      // Basic schema validation
      const { validateConfig } = require('../src/schemas/config');
      const { error, value } = validateConfig(config);
      
      if (error) {
        console.log('❌ Configuration validation failed:');
        error.details.forEach((detail: any) => {
          console.log(`   • ${detail.message}`);
        });
        process.exit(1);
      }
      
      console.log('✅ Configuration is valid!');
      console.log('\n📋 Configuration Summary:');
      console.log(`   Version: ${value.version}`);
      console.log(`   Rules: ${value.rules.length}`);
      console.log(`   Notification channels: ${value.notifications.channels.length}`);
      
      // License-based validation if installation ID provided
      if (options.installationId) {
        const licenseService = new LicenseService();
        const license = await licenseService.validateLicense(parseInt(options.installationId));
        
        if (license) {
          console.log(`\n🔐 License Check (${license.tier} tier):`);
          
          // Check advanced features
          const hasAdvancedRules = value.rules.some((rule: any) => rule.conditions.length > 2);
          const hasNotifications = value.notifications.channels.length > 0;
          const hasCustomActions = value.rules.some((rule: any) => 
            rule.actions.some((action: any) => ['comment', 'label', 'assign'].includes(action.type))
          );
          
          if (hasAdvancedRules && !license.features.includes('advanced_rules')) {
            console.log('   ⚠️  Advanced rules require Pro or Enterprise tier');
          }
          
          if (hasNotifications && !license.features.includes('notifications')) {
            console.log('   ⚠️  Custom notifications require Pro or Enterprise tier');
          }
          
          if (hasCustomActions && !license.features.includes('custom_actions')) {
            console.log('   ⚠️  Custom actions require Enterprise tier');
          }
        }
      }
    } catch (error: any) {
      console.error('❌ Error validating config:', error.message);
      process.exit(1);
    }
  });

// Setup commands
const setupCommand = program
  .command('setup')
  .description('Setup and onboarding commands');

setupCommand
  .command('init')
  .description('Initialize Automerge-Pro in current repository')
  .option('-t, --tier <tier>', 'Configuration tier to start with', 'free')
  .option('--interactive', 'Interactive setup mode')
  .action(async (options) => {
    try {
      console.log('🚀 Initializing Automerge-Pro...\n');
      
      // Check if already initialized
      if (fs.existsSync('.automerge-pro.yml')) {
        console.log('⚠️  Automerge-Pro is already initialized in this repository');
        console.log('   Configuration file: .automerge-pro.yml');
        return;
      }
      
      // Generate configuration
      const githubService = new GitHubService('', '', '');
      const licenseService = new LicenseService();
      const configService = new ConfigService(githubService, licenseService);
      
      const sampleConfig = configService.generateSampleConfig(options.tier);
      fs.writeFileSync('.automerge-pro.yml', sampleConfig);
      
      console.log('✅ Created .automerge-pro.yml configuration file');
      console.log(`📋 Initialized with ${options.tier} tier configuration\n`);
      
      // Setup instructions
      console.log('📖 Next steps:');
      console.log('1. Review and customize your .automerge-pro.yml configuration');
      console.log('2. Install the Automerge-Pro GitHub App on your repository');
      console.log('3. Configure your GitHub repository webhook (if not using the app)');
      console.log('4. Test your configuration with: npx automerge-pro config validate -f .automerge-pro.yml\n');
      
      console.log('🔗 Useful links:');
      console.log('   • Documentation: https://github.com/your-repo/automerge-pro/docs');
      console.log('   • GitHub App: https://github.com/apps/automerge-pro');
      console.log('   • Support: https://github.com/your-repo/automerge-pro/issues');
      
    } catch (error: any) {
      console.error('❌ Error during initialization:', error.message);
      process.exit(1);
    }
  });

// Development server command
program
  .command('dev')
  .description('Start development server')
  .option('-p, --port <port>', 'Server port', '3000')
  .option('--env-file <file>', 'Environment file', '.env')
  .action(async (options) => {
    try {
      // Load environment variables
      if (fs.existsSync(options.envFile)) {
        require('dotenv').config({ path: options.envFile });
        console.log(`📄 Loaded environment from ${options.envFile}`);
      }
      
      process.env.NODE_ENV = 'development';
      process.env.PORT = options.port;
      
      console.log('🚀 Starting Automerge-Pro development server...');
      console.log(`📡 Server will be available at http://localhost:${options.port}`);
      console.log('📝 Webhook endpoint: /webhook');
      console.log('🔍 Health check: /health\n');
      
      // Import and start the server
      const { app } = require('../src/index');
      
      app.listen(options.port, () => {
        console.log(`✅ Development server running on port ${options.port}`);
        console.log('\n📖 Available endpoints:');
        console.log(`   • GET  /health - Health check`);
        console.log(`   • POST /webhook - GitHub webhook handler`);
        console.log(`   • GET  /validate-license/:id - License validation`);
        console.log(`   • GET  /config/sample/:tier - Sample configurations`);
        console.log(`   • POST /config/validate - Validate repository configuration`);
        console.log(`   • POST /dev/generate-license - Generate dev license`);
      });
    } catch (error: any) {
      console.error('❌ Error starting development server:', error.message);
      process.exit(1);
    }
  });

// Parse arguments
program.parse();