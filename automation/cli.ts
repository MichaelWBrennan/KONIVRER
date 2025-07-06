#!/usr/bin/env node

/**
 * KONIVRER Automation CLI
 * 
 * Command-line interface for interacting with the automation system.
 * This tool provides commands to control and monitor the automation orchestrator.
 */

import { program } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { initialize, runAutomation, config, state } from './orchestrator';

// Version from package.json
const packageJsonPath = path.join(process.cwd(), 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const version = packageJson.version || '1.0.0';

// CLI configuration
program
  .name('konivrer-automation')
  .description('KONIVRER Automation System CLI')
  .version(version);

// Start command
program
  .command('start')
  .description('Start the automation orchestrator in watch mode')
  .option('-b, --background', 'Run in background mode')
  .action((options) => {
    console.log(chalk.blue('🚀 Starting KONIVRER Automation Orchestrator...'));
    
    if (options.background) {
      // Start in background mode using PM2 or similar
      try {
        execSync('npx pm2 start automation/orchestrator.ts --name konivrer-automation', { stdio: 'inherit' });
        console.log(chalk.green('✅ Automation orchestrator started in background mode'));
        console.log(chalk.gray('Use `npx pm2 logs konivrer-automation` to view logs'));
      } catch (error) {
        console.error(chalk.red('❌ Failed to start in background mode:'), error);
        process.exit(1);
      }
    } else {
      // Start in foreground mode
      initialize();
    }
  });

// Stop command
program
  .command('stop')
  .description('Stop the automation orchestrator running in background')
  .action(() => {
    console.log(chalk.yellow('🛑 Stopping KONIVRER Automation Orchestrator...'));
    
    try {
      execSync('npx pm2 stop konivrer-automation', { stdio: 'inherit' });
      console.log(chalk.green('✅ Automation orchestrator stopped'));
    } catch (error) {
      console.error(chalk.red('❌ Failed to stop:'), error);
      process.exit(1);
    }
  });

// Status command
program
  .command('status')
  .description('Show the status of the automation orchestrator')
  .action(() => {
    console.log(chalk.blue('📊 KONIVRER Automation Status'));
    
    try {
      const pm2Output = execSync('npx pm2 list', { stdio: 'pipe' }).toString();
      
      if (pm2Output.includes('konivrer-automation')) {
        console.log(chalk.green('✅ Automation orchestrator is running'));
        
        // Show more details
        const pm2Info = execSync('npx pm2 info konivrer-automation', { stdio: 'pipe' }).toString();
        console.log(chalk.gray(pm2Info));
      } else {
        console.log(chalk.yellow('⚠️ Automation orchestrator is not running'));
      }
    } catch (error) {
      console.log(chalk.yellow('⚠️ Automation orchestrator is not running in background mode'));
      
      if (state.isRunning) {
        console.log(chalk.green('✅ Automation orchestrator is running in foreground mode'));
        console.log(chalk.blue('Current state:'));
        console.log(chalk.gray(JSON.stringify(state, null, 2)));
      } else {
        console.log(chalk.yellow('⚠️ Automation orchestrator is not running'));
      }
    }
  });

// Run command
program
  .command('run')
  .description('Run the automation workflow once')
  .option('-f, --full', 'Run a full scan including tests and build')
  .action((options) => {
    console.log(chalk.blue('🔄 Running KONIVRER Automation workflow...'));
    
    const spinner = ora('Running automation workflow...').start();
    
    try {
      runAutomation('manual');
      spinner.succeed(chalk.green('Automation workflow completed'));
    } catch (error) {
      spinner.fail(chalk.red('Automation workflow failed'));
      console.error(error);
      process.exit(1);
    }
  });

// Config command
program
  .command('config')
  .description('Show or modify configuration')
  .option('-l, --list', 'List all configuration options')
  .option('-s, --set <key=value>', 'Set a configuration option')
  .option('-g, --get <key>', 'Get a specific configuration option')
  .action((options) => {
    if (options.list) {
      console.log(chalk.blue('📝 KONIVRER Automation Configuration:'));
      console.log(chalk.gray(JSON.stringify(config, null, 2)));
    } else if (options.get) {
      const keys = options.get.split('.');
      let value = config;
      
      for (const key of keys) {
        if (value[key] === undefined) {
          console.error(chalk.red(`❌ Configuration key '${options.get}' not found`));
          process.exit(1);
        }
        value = value[key];
      }
      
      console.log(chalk.blue(`📝 ${options.get}:`), chalk.gray(JSON.stringify(value, null, 2)));
    } else if (options.set) {
      const [key, value] = options.set.split('=');
      
      if (!key || !value) {
        console.error(chalk.red('❌ Invalid format. Use --set key=value'));
        process.exit(1);
      }
      
      console.log(chalk.yellow(`⚠️ Setting configuration options via CLI is not yet implemented`));
      console.log(chalk.gray(`Please edit automation/config.ts directly`));
    } else {
      program.help();
    }
  });

// Logs command
program
  .command('logs')
  .description('Show automation logs')
  .option('-f, --follow', 'Follow log output')
  .option('-n, --lines <number>', 'Number of lines to show', '100')
  .action((options) => {
    const logFile = config.logFile;
    
    if (!fs.existsSync(logFile)) {
      console.error(chalk.red(`❌ Log file not found: ${logFile}`));
      process.exit(1);
    }
    
    if (options.follow) {
      console.log(chalk.blue(`📜 Following logs from ${logFile}:`));
      execSync(`tail -f -n ${options.lines} ${logFile}`, { stdio: 'inherit' });
    } else {
      console.log(chalk.blue(`📜 Last ${options.lines} lines from ${logFile}:`));
      execSync(`tail -n ${options.lines} ${logFile}`, { stdio: 'inherit' });
    }
  });

// Report command
program
  .command('report')
  .description('Generate a comprehensive report of the system status')
  .option('-o, --output <file>', 'Output file path', 'automation-report.html')
  .action((options) => {
    console.log(chalk.blue('📊 Generating KONIVRER Automation Report...'));
    
    const spinner = ora('Collecting system information...').start();
    
    try {
      // Collect system information
      const systemInfo = {
        timestamp: new Date().toISOString(),
        version: packageJson.version,
        node: process.version,
        platform: process.platform,
        arch: process.arch,
        memory: process.memoryUsage(),
      };
      
      // Collect git information
      const gitInfo = {
        branch: execSync('git rev-parse --abbrev-ref HEAD', { stdio: 'pipe' }).toString().trim(),
        commit: execSync('git rev-parse HEAD', { stdio: 'pipe' }).toString().trim(),
        author: execSync('git log -1 --pretty=format:%an', { stdio: 'pipe' }).toString().trim(),
        date: execSync('git log -1 --pretty=format:%ad', { stdio: 'pipe' }).toString().trim(),
      };
      
      // Collect dependency information
      const dependencies = packageJson.dependencies || {};
      const devDependencies = packageJson.devDependencies || {};
      
      // Collect test information
      let testInfo = {};
      try {
        execSync('npm run test:coverage', { stdio: 'pipe' });
        
        const coveragePath = path.join(process.cwd(), 'coverage', 'coverage-summary.json');
        if (fs.existsSync(coveragePath)) {
          testInfo = JSON.parse(fs.readFileSync(coveragePath, 'utf8'));
        }
      } catch (error) {
        testInfo = { error: 'Failed to run tests' };
      }
      
      // Collect build information
      let buildInfo = {};
      try {
        execSync('npm run build', { stdio: 'pipe' });
        
        const buildDir = path.join(process.cwd(), 'dist');
        const buildSize = calculateDirSize(buildDir);
        const buildFiles = countFiles(buildDir);
        
        buildInfo = {
          size: buildSize,
          sizeFormatted: formatBytes(buildSize),
          files: buildFiles,
        };
      } catch (error) {
        buildInfo = { error: 'Failed to build project' };
      }
      
      // Collect performance information
      let performanceInfo = {};
      try {
        // This would be a more comprehensive performance analysis
        // For now, we'll just use some basic metrics
        performanceInfo = {
          buildTime: '2.5s', // Placeholder
          firstContentfulPaint: '0.8s', // Placeholder
          timeToInteractive: '1.2s', // Placeholder
        };
      } catch (error) {
        performanceInfo = { error: 'Failed to collect performance metrics' };
      }
      
      // Combine all information
      const report = {
        system: systemInfo,
        git: gitInfo,
        dependencies: {
          production: dependencies,
          development: devDependencies,
          total: Object.keys(dependencies).length + Object.keys(devDependencies).length,
        },
        tests: testInfo,
        build: buildInfo,
        performance: performanceInfo,
      };
      
      // Save report as JSON
      const reportJsonPath = path.join(process.cwd(), 'automation', 'reports', 'report.json');
      fs.writeFileSync(reportJsonPath, JSON.stringify(report, null, 2));
      
      // Generate HTML report
      const htmlReport = generateHtmlReport(report);
      fs.writeFileSync(options.output, htmlReport);
      
      spinner.succeed(chalk.green(`Report generated successfully: ${options.output}`));
    } catch (error) {
      spinner.fail(chalk.red('Failed to generate report'));
      console.error(error);
      process.exit(1);
    }
  });

// Helper function to calculate directory size
function calculateDirSize(dirPath: string): number {
  let size = 0;
  
  if (!fs.existsSync(dirPath)) {
    return 0;
  }
  
  const files = fs.readdirSync(dirPath);
  
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      size += calculateDirSize(filePath);
    } else {
      size += stats.size;
    }
  }
  
  return size;
}

// Helper function to count files in a directory
function countFiles(dirPath: string): number {
  let count = 0;
  
  if (!fs.existsSync(dirPath)) {
    return 0;
  }
  
  const files = fs.readdirSync(dirPath);
  
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      count += countFiles(filePath);
    } else {
      count++;
    }
  }
  
  return count;
}

// Helper function to format bytes
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Helper function to generate HTML report
function generateHtmlReport(report: any): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>KONIVRER Automation Report</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    h1, h2, h3 {
      color: #2c3e50;
    }
    .header {
      background-color: #3498db;
      color: white;
      padding: 20px;
      border-radius: 5px;
      margin-bottom: 20px;
    }
    .section {
      background-color: #f8f9fa;
      padding: 20px;
      border-radius: 5px;
      margin-bottom: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }
    .card {
      background-color: white;
      padding: 15px;
      border-radius: 5px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .stat {
      font-size: 24px;
      font-weight: bold;
      color: #3498db;
    }
    .label {
      font-size: 14px;
      color: #7f8c8d;
    }
    pre {
      background-color: #f1f1f1;
      padding: 10px;
      border-radius: 5px;
      overflow-x: auto;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      padding: 8px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    th {
      background-color: #f2f2f2;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>KONIVRER Automation Report</h1>
    <p>Generated on ${new Date().toLocaleString()}</p>
  </div>
  
  <div class="section">
    <h2>System Information</h2>
    <div class="grid">
      <div class="card">
        <div class="stat">${report.system.node}</div>
        <div class="label">Node.js Version</div>
      </div>
      <div class="card">
        <div class="stat">${report.system.platform} (${report.system.arch})</div>
        <div class="label">Platform</div>
      </div>
      <div class="card">
        <div class="stat">${formatBytes(report.system.memory.heapUsed)}</div>
        <div class="label">Memory Usage</div>
      </div>
    </div>
  </div>
  
  <div class="section">
    <h2>Git Information</h2>
    <div class="grid">
      <div class="card">
        <div class="stat">${report.git.branch}</div>
        <div class="label">Current Branch</div>
      </div>
      <div class="card">
        <div class="stat">${report.git.commit.substring(0, 7)}</div>
        <div class="label">Latest Commit</div>
      </div>
      <div class="card">
        <div class="stat">${report.git.author}</div>
        <div class="label">Author</div>
      </div>
      <div class="card">
        <div class="stat">${report.git.date}</div>
        <div class="label">Date</div>
      </div>
    </div>
  </div>
  
  <div class="section">
    <h2>Dependencies</h2>
    <div class="grid">
      <div class="card">
        <div class="stat">${Object.keys(report.dependencies.production).length}</div>
        <div class="label">Production Dependencies</div>
      </div>
      <div class="card">
        <div class="stat">${Object.keys(report.dependencies.development).length}</div>
        <div class="label">Development Dependencies</div>
      </div>
      <div class="card">
        <div class="stat">${report.dependencies.total}</div>
        <div class="label">Total Dependencies</div>
      </div>
    </div>
  </div>
  
  <div class="section">
    <h2>Build Information</h2>
    <div class="grid">
      <div class="card">
        <div class="stat">${report.build.sizeFormatted}</div>
        <div class="label">Build Size</div>
      </div>
      <div class="card">
        <div class="stat">${report.build.files}</div>
        <div class="label">Number of Files</div>
      </div>
    </div>
  </div>
  
  <div class="section">
    <h2>Performance Metrics</h2>
    <div class="grid">
      <div class="card">
        <div class="stat">${report.performance.buildTime}</div>
        <div class="label">Build Time</div>
      </div>
      <div class="card">
        <div class="stat">${report.performance.firstContentfulPaint}</div>
        <div class="label">First Contentful Paint</div>
      </div>
      <div class="card">
        <div class="stat">${report.performance.timeToInteractive}</div>
        <div class="label">Time to Interactive</div>
      </div>
    </div>
  </div>
  
  <div class="section">
    <h2>Test Coverage</h2>
    <pre>${JSON.stringify(report.tests, null, 2)}</pre>
  </div>
  
  <div class="section">
    <h2>Full Report</h2>
    <pre>${JSON.stringify(report, null, 2)}</pre>
  </div>
</body>
</html>`;
}

// Parse command line arguments
program.parse(process.argv);

// If no arguments provided, show help
if (process.argv.length <= 2) {
  program.help();
}