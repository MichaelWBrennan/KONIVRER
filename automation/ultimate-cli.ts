#!/usr/bin/env tsx

/**
 * KONIVRER Ultimate Automation CLI
 * Command-line interface for the ultimate automation system
 */

import { execSync } from 'child_process';
import { promises as fs } from 'fs';
import { join } from 'path';

interface CLICommand {
  name: string;
  description: string;
  action: () => Promise<void>;
}

class UltimateAutomationCLI {
  private commands: Map<string, CLICommand> = new Map();

  constructor() {
    this.initializeCommands();
  }

  private initializeCommands(): void {
    this.commands.set('setup', {
      name: 'setup',
      description: 'Setup the ultimate automation system',
      action: this.setupAutomation.bind(this)
    });

    this.commands.set('run', {
      name: 'run',
      description: 'Run all automation workflows',
      action: this.runAllWorkflows.bind(this)
    });

    this.commands.set('typescript', {
      name: 'typescript',
      description: 'Run TypeScript enforcement workflow',
      action: this.runTypeScriptWorkflow.bind(this)
    });

    this.commands.set('security', {
      name: 'security',
      description: 'Run security monitoring workflow',
      action: this.runSecurityWorkflow.bind(this)
    });

    this.commands.set('quality', {
      name: 'quality',
      description: 'Run quality assurance workflow',
      action: this.runQualityWorkflow.bind(this)
    });

    this.commands.set('performance', {
      name: 'performance',
      description: 'Run performance optimization workflow',
      action: this.runPerformanceWorkflow.bind(this)
    });

    this.commands.set('status', {
      name: 'status',
      description: 'Show automation system status',
      action: this.showStatus.bind(this)
    });

    this.commands.set('dashboard', {
      name: 'dashboard',
      description: 'Start the automation dashboard',
      action: this.startDashboard.bind(this)
    });

    this.commands.set('logs', {
      name: 'logs',
      description: 'View automation logs',
      action: this.viewLogs.bind(this)
    });

    this.commands.set('config', {
      name: 'config',
      description: 'Show automation configuration',
      action: this.showConfig.bind(this)
    });

    this.commands.set('hands-off', {
      name: 'hands-off',
      description: 'Enable complete hands-off automation',
      action: this.enableHandsOff.bind(this)
    });
  }

  async setupAutomation(): Promise<void> {
    console.log('🚀 Setting up Ultimate Automation System...');
    
    try {
      // Run TypeScript conversion
      console.log('📝 Converting all files to TypeScript...');
      execSync('npm run convert:final', { stdio: 'inherit' });
      
      // Setup automation system
      console.log('🤖 Setting up automation workflows...');
      execSync('npm run automation:ultimate', { stdio: 'inherit' });
      
      // Run initial automation
      console.log('🔄 Running initial automation workflows...');
      execSync('npm run ultimate:run', { stdio: 'inherit' });
      
      console.log('✅ Ultimate Automation System setup complete!');
      console.log('🎯 Your repository is now 100% automated and hands-off!');
      
    } catch (error) {
      console.error('❌ Setup failed:', error);
      throw error;
    }
  }

  async runAllWorkflows(): Promise<void> {
    console.log('🤖 Running all automation workflows...');
    
    try {
      execSync('npx tsx automation/enhanced-orchestrator.ts run', { stdio: 'inherit' });
      console.log('✅ All workflows completed successfully!');
    } catch (error) {
      console.error('❌ Workflow execution failed:', error);
      throw error;
    }
  }

  async runTypeScriptWorkflow(): Promise<void> {
    console.log('📝 Running TypeScript enforcement workflow...');
    
    try {
      execSync('npx tsx automation/enhanced-orchestrator.ts workflow typescript', { stdio: 'inherit' });
      console.log('✅ TypeScript workflow completed!');
    } catch (error) {
      console.error('❌ TypeScript workflow failed:', error);
      throw error;
    }
  }

  async runSecurityWorkflow(): Promise<void> {
    console.log('🛡️ Running security monitoring workflow...');
    
    try {
      execSync('npx tsx automation/enhanced-orchestrator.ts workflow security', { stdio: 'inherit' });
      console.log('✅ Security workflow completed!');
    } catch (error) {
      console.error('❌ Security workflow failed:', error);
      throw error;
    }
  }

  async runQualityWorkflow(): Promise<void> {
    console.log('🎯 Running quality assurance workflow...');
    
    try {
      execSync('npx tsx automation/enhanced-orchestrator.ts workflow quality', { stdio: 'inherit' });
      console.log('✅ Quality workflow completed!');
    } catch (error) {
      console.error('❌ Quality workflow failed:', error);
      throw error;
    }
  }

  async runPerformanceWorkflow(): Promise<void> {
    console.log('⚡ Running performance optimization workflow...');
    
    try {
      execSync('npx tsx automation/enhanced-orchestrator.ts workflow performance', { stdio: 'inherit' });
      console.log('✅ Performance workflow completed!');
    } catch (error) {
      console.error('❌ Performance workflow failed:', error);
      throw error;
    }
  }

  async showStatus(): Promise<void> {
    console.log('📊 Automation System Status');
    console.log('=' .repeat(50));
    
    try {
      // Check TypeScript status
      const jsFiles = execSync('find . -name "*.js" -not -path "./node_modules/*" -not -path "./.git/*" | wc -l', { encoding: 'utf-8' }).trim();
      console.log(`📝 JavaScript files remaining: ${jsFiles}`);
      console.log(`✅ TypeScript coverage: ${jsFiles === '1' ? '100%' : 'Incomplete'}`); // 1 file is public/sw.js
      
      // Check automation status
      const automationStatus = execSync('npx tsx automation/enhanced-orchestrator.ts status', { encoding: 'utf-8' });
      console.log('\n🤖 Automation Status:');
      console.log(automationStatus);
      
      // Check recent activity
      console.log('\n📈 Recent Activity:');
      try {
        const reportsDir = join(__dirname, 'reports');
        const reports = await fs.readdir(reportsDir);
        const latestReport = reports.sort().pop();
        if (latestReport) {
          const reportContent = await fs.readFile(join(reportsDir, latestReport), 'utf-8');
          const report = JSON.parse(reportContent);
          console.log(`Last run: ${report.timestamp}`);
          console.log(`Success rate: ${(report.summary.successful / report.summary.total * 100).toFixed(1)}%`);
        }
      } catch {
        console.log('No recent reports found');
      }
      
    } catch (error) {
      console.error('❌ Failed to get status:', error);
    }
  }

  async startDashboard(): Promise<void> {
    console.log('📊 Starting automation dashboard...');
    console.log('🌐 Dashboard will be available at: http://localhost:3001');
    
    try {
      execSync('npm run automation:monitor', { stdio: 'inherit' });
    } catch (error) {
      console.error('❌ Failed to start dashboard:', error);
      throw error;
    }
  }

  async viewLogs(): Promise<void> {
    console.log('📋 Automation Logs');
    console.log('=' .repeat(50));
    
    try {
      // Show recent automation activity
      const reportsDir = join(__dirname, 'reports');
      const reports = await fs.readdir(reportsDir);
      
      if (reports.length === 0) {
        console.log('No logs available. Run automation workflows to generate logs.');
        return;
      }
      
      // Show latest 5 reports
      const latestReports = reports.sort().slice(-5);
      
      for (const reportFile of latestReports) {
        const reportContent = await fs.readFile(join(reportsDir, reportFile), 'utf-8');
        const report = JSON.parse(reportContent);
        
        console.log(`\n📅 ${report.timestamp}`);
        console.log(`📊 Success Rate: ${(report.summary.successful / report.summary.total * 100).toFixed(1)}%`);
        console.log(`✅ Successful: ${report.summary.successful}`);
        console.log(`❌ Failed: ${report.summary.failed}`);
        
        if (report.recommendations.length > 0) {
          console.log('💡 Recommendations:');
          report.recommendations.forEach((rec: string) => console.log(`  - ${rec}`));
        }
      }
      
    } catch (error) {
      console.error('❌ Failed to view logs:', error);
    }
  }

  async showConfig(): Promise<void> {
    console.log('⚙️ Automation Configuration');
    console.log('=' .repeat(50));
    
    try {
      const configPath = join(__dirname, 'config.json');
      const configContent = await fs.readFile(configPath, 'utf-8');
      const config = JSON.parse(configContent);
      
      console.log('🤖 Automation Settings:');
      console.log(`  Enabled: ${config.automation.enabled ? '✅' : '❌'}`);
      console.log(`  Mode: ${config.automation.mode}`);
      console.log(`  Version: ${config.automation.version}`);
      
      console.log('\n📅 Schedules:');
      Object.entries(config.automation.schedule).forEach(([task, schedule]) => {
        console.log(`  ${task}: ${schedule}`);
      });
      
      console.log('\n🎯 Features:');
      Object.entries(config.automation.features).forEach(([feature, enabled]) => {
        console.log(`  ${feature}: ${enabled ? '✅' : '❌'}`);
      });
      
      console.log('\n📊 Thresholds:');
      Object.entries(config.automation.thresholds).forEach(([metric, threshold]) => {
        console.log(`  ${metric}: ${threshold}`);
      });
      
    } catch (error) {
      console.error('❌ Failed to show config:', error);
    }
  }

  async enableHandsOff(): Promise<void> {
    console.log('🤖 Enabling Complete Hands-Off Automation...');
    
    try {
      // Run full setup
      await this.setupAutomation();
      
      // Enable all automation features
      console.log('🔧 Configuring hands-off settings...');
      
      const configPath = join(__dirname, 'config.json');
      const configContent = await fs.readFile(configPath, 'utf-8');
      const config = JSON.parse(configContent);
      
      // Enable all features for hands-off operation
      config.automation.features.autoFix = true;
      config.automation.features.autoMerge = true;
      config.automation.features.autoDeploy = true; // Enable auto-deploy for hands-off
      config.automation.features.autoUpdate = true;
      config.automation.features.selfHealing = true;
      config.automation.features.intelligentOptimization = true;
      config.automation.features.securityEnforcement = true;
      config.automation.features.performanceMonitoring = true;
      config.automation.features.typeScriptEnforcement = true;
      
      await fs.writeFile(configPath, JSON.stringify(config, null, 2), 'utf-8');
      
      console.log('✅ Hands-off automation enabled!');
      console.log('🎯 Your repository will now operate completely autonomously!');
      console.log('');
      console.log('🤖 Automation Features Enabled:');
      console.log('  ✅ Auto-fix code issues');
      console.log('  ✅ Auto-merge dependency updates');
      console.log('  ✅ Auto-deploy to production');
      console.log('  ✅ Auto-update dependencies');
      console.log('  ✅ Self-healing capabilities');
      console.log('  ✅ Intelligent optimization');
      console.log('  ✅ Security enforcement');
      console.log('  ✅ Performance monitoring');
      console.log('  ✅ TypeScript enforcement');
      console.log('');
      console.log('📊 Monitor progress: npm run automation:dashboard');
      
    } catch (error) {
      console.error('❌ Failed to enable hands-off automation:', error);
      throw error;
    }
  }

  async run(): Promise<void> {
    const command = process.argv[2];
    
    if (!command) {
      this.showHelp();
      return;
    }
    
    const cmd = this.commands.get(command);
    
    if (!cmd) {
      console.error(`❌ Unknown command: ${command}`);
      this.showHelp();
      process.exit(1);
    }
    
    try {
      await cmd.action();
    } catch (error) {
      console.error(`💥 Command '${command}' failed:`, error);
      process.exit(1);
    }
  }

  private showHelp(): void {
    console.log('🤖 KONIVRER Ultimate Automation CLI');
    console.log('');
    console.log('Usage: npm run automation:cli <command>');
    console.log('');
    console.log('Commands:');
    
    this.commands.forEach(cmd => {
      console.log(`  ${cmd.name.padEnd(15)} ${cmd.description}`);
    });
    
    console.log('');
    console.log('Examples:');
    console.log('  npm run automation:cli setup      # Setup automation system');
    console.log('  npm run automation:cli run        # Run all workflows');
    console.log('  npm run automation:cli hands-off  # Enable complete automation');
    console.log('  npm run automation:cli dashboard  # Start monitoring dashboard');
    console.log('');
  }
}

// Run the CLI
const cli = new UltimateAutomationCLI();
cli.run();