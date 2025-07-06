#!/usr/bin/env tsx

/**
 * Ultimate Automation Orchestrator
 * Coordinates all automation workflows for 100% hands-off operation
 */

import { promises as fs } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

interface AutomationConfig {
  enabled: boolean;
  interval: number;
  tasks: AutomationTask[];
}

interface AutomationTask {
  name: string;
  type: 'security' | 'performance' | 'quality' | 'dependencies';
  schedule: string;
  enabled: boolean;
}

interface AutomationResult {
  success: boolean;
  message: string;
  timestamp: Date;
  details?: any;
}

interface WorkflowStep {
  name: string;
  command: string;
  required: boolean;
  timeout: number;
  retries: number;
}

interface Workflow {
  name: string;
  description: string;
  steps: WorkflowStep[];
  schedule?: string;
  triggers: string[];
}

class AutomationOrchestrator {
  private config: AutomationConfig;
  private workflows: Map<string, Workflow> = new Map();
  private results: AutomationResult[] = [];

  constructor() {
    this.loadConfiguration();
    this.initializeWorkflows();
  }

  private async loadConfiguration(): Promise<void> {
    try {
      const configPath = join(__dirname, 'config.json');
      const configData = await fs.readFile(configPath, 'utf-8');
      this.config = JSON.parse(configData).automation;
    } catch (error) {
      console.error('❌ Failed to load automation configuration:', error);
      // Use default configuration
      this.config = this.getDefaultConfig();
    }
  }

  private getDefaultConfig(): AutomationConfig {
    return {
      enabled: true,
      interval: 3600000, // 1 hour
      tasks: [
        { name: 'typescript', type: 'quality', schedule: '0 */2 * * *', enabled: true },
        { name: 'security', type: 'security', schedule: '0 2 * * *', enabled: true },
        { name: 'performance', type: 'performance', schedule: '0 4 * * *', enabled: true },
        { name: 'dependencies', type: 'dependencies', schedule: '0 3 * * 1', enabled: true }
      ]
    };
  }

  private initializeWorkflows(): void {
    // Ultimate TypeScript Workflow
    this.workflows.set('typescript', {
      name: 'TypeScript Enforcement',
      description: 'Ensures 100% TypeScript compliance',
      triggers: ['push', 'schedule'],
      steps: [
        {
          name: 'Find JavaScript Files',
          command: 'find . -name "*.js" -not -path "./node_modules/*" -not -path "./.git/*" | wc -l',
          required: false,
          timeout: 30000,
          retries: 1
        },
        {
          name: 'Convert to TypeScript',
          command: 'npm run convert:final',
          required: true,
          timeout: 300000,
          retries: 2
        },
        {
          name: 'Type Check',
          command: 'npm run type-check:strict',
          required: true,
          timeout: 120000,
          retries: 2
        },
        {
          name: 'TypeScript Enforcement',
          command: 'npm run automation:typescript',
          required: true,
          timeout: 180000,
          retries: 1
        }
      ]
    });

    // Ultimate Security Workflow
    this.workflows.set('security', {
      name: 'Security Monitoring',
      description: 'Comprehensive security scanning and remediation',
      triggers: ['push', 'schedule'],
      steps: [
        {
          name: 'Dependency Audit',
          command: 'npm audit --audit-level moderate',
          required: true,
          timeout: 120000,
          retries: 2
        },
        {
          name: 'Security Scan',
          command: 'npm run automation:security',
          required: true,
          timeout: 180000,
          retries: 1
        },
        {
          name: 'Auto-fix Vulnerabilities',
          command: 'npm audit fix --force',
          required: false,
          timeout: 180000,
          retries: 1
        }
      ]
    });

    // Ultimate Quality Workflow
    this.workflows.set('quality', {
      name: 'Quality Assurance',
      description: 'Comprehensive code quality checks and fixes',
      triggers: ['push', 'schedule'],
      steps: [
        {
          name: 'Lint and Fix',
          command: 'npm run lint:fix',
          required: true,
          timeout: 120000,
          retries: 2
        },
        {
          name: 'Format Code',
          command: 'npm run format',
          required: true,
          timeout: 60000,
          retries: 2
        },
        {
          name: 'Quality Checks',
          command: 'npm run automation:quality',
          required: true,
          timeout: 300000,
          retries: 1
        },
        {
          name: 'Self Healing',
          command: 'npm run heal:full',
          required: false,
          timeout: 180000,
          retries: 1
        }
      ]
    });

    // Ultimate Performance Workflow
    this.workflows.set('performance', {
      name: 'Performance Optimization',
      description: 'Performance monitoring and optimization',
      triggers: ['schedule', 'performance_degradation'],
      steps: [
        {
          name: 'Build Analysis',
          command: 'npm run build:optimized',
          required: true,
          timeout: 300000,
          retries: 2
        },
        {
          name: 'Performance Check',
          command: 'npm run automation:performance',
          required: true,
          timeout: 180000,
          retries: 1
        }
      ]
    });

    // Ultimate Testing Workflow
    this.workflows.set('testing', {
      name: 'Comprehensive Testing',
      description: 'Full test suite execution with coverage',
      triggers: ['push', 'pull_request'],
      steps: [
        {
          name: 'Unit Tests',
          command: 'npm run test',
          required: true,
          timeout: 300000,
          retries: 2
        },
        {
          name: 'Coverage Report',
          command: 'npm run test:coverage',
          required: false,
          timeout: 300000,
          retries: 1
        },
        {
          name: 'Type Coverage',
          command: 'npm run type-check',
          required: true,
          timeout: 120000,
          retries: 2
        }
      ]
    });
  }

  async runWorkflow(workflowName: string): Promise<AutomationResult> {
    const workflow = this.workflows.get(workflowName);
    if (!workflow) {
      throw new Error(`Workflow '${workflowName}' not found`);
    }

    console.log(`🚀 Starting workflow: ${workflow.name}`);
    console.log(`📝 Description: ${workflow.description}`);

    const startTime = Date.now();
    let success = true;
    const stepResults: string[] = [];

    for (const step of workflow.steps) {
      console.log(`\n🔄 Executing step: ${step.name}`);
      
      const stepResult = await this.executeStep(step);
      stepResults.push(`${step.name}: ${stepResult.success ? '✅' : '❌'}`);
      
      if (!stepResult.success && step.required) {
        success = false;
        console.error(`❌ Required step failed: ${step.name}`);
        break;
      }
    }

    const duration = Date.now() - startTime;
    const result: AutomationResult = {
      success,
      message: `Workflow '${workflow.name}' ${success ? 'completed successfully' : 'failed'}`,
      timestamp: new Date(),
      details: {
        workflow: workflowName,
        duration,
        steps: stepResults
      }
    };

    this.results.push(result);
    
    console.log(`\n${success ? '✅' : '❌'} Workflow ${workflow.name} ${success ? 'completed' : 'failed'} in ${duration}ms`);
    
    return result;
  }

  private async executeStep(step: WorkflowStep): Promise<{ success: boolean; output?: string; error?: string }> {
    let attempt = 0;
    
    while (attempt <= step.retries) {
      try {
        console.log(`  🔧 Attempt ${attempt + 1}/${step.retries + 1}: ${step.command}`);
        
        const output = execSync(step.command, {
          encoding: 'utf-8',
          timeout: step.timeout,
          stdio: 'pipe'
        });
        
        console.log(`  ✅ Step completed successfully`);
        return { success: true, output };
        
      } catch (error: any) {
        attempt++;
        console.error(`  ❌ Attempt ${attempt} failed:`, error.message);
        
        if (attempt > step.retries) {
          return { 
            success: false, 
            error: error.message,
            output: error.stdout || error.stderr 
          };
        }
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
    
    return { success: false, error: 'Max retries exceeded' };
  }

  async runAllWorkflows(): Promise<AutomationResult[]> {
    console.log('🤖 Starting Ultimate Automation System - Full Workflow Execution');
    console.log('=' .repeat(80));
    
    const results: AutomationResult[] = [];
    const workflowOrder = ['typescript', 'security', 'quality', 'testing', 'performance'];
    
    for (const workflowName of workflowOrder) {
      try {
        const result = await this.runWorkflow(workflowName);
        results.push(result);
        
        // If a critical workflow fails, continue but log the issue
        if (!result.success) {
          console.warn(`⚠️  Workflow '${workflowName}' failed but continuing with other workflows.`);
        }
        
      } catch (error) {
        console.error(`💥 Failed to run workflow '${workflowName}':`, error);
        results.push({
          success: false,
          message: `Failed to run workflow '${workflowName}': ${error}`,
          timestamp: new Date()
        });
      }
    }
    
    await this.generateReport(results);
    return results;
  }

  async generateReport(results: AutomationResult[]): Promise<void> {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total: results.length,
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length
      },
      results,
      recommendations: this.generateRecommendations(results)
    };

    const reportPath = join(__dirname, 'reports', `automation-report-${Date.now()}.json`);
    await fs.mkdir(join(__dirname, 'reports'), { recursive: true });
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2), 'utf-8');
    
    console.log(`\n📊 Automation Report Generated: ${reportPath}`);
    console.log(`📈 Success Rate: ${(report.summary.successful / report.summary.total * 100).toFixed(1)}%`);
  }

  private generateRecommendations(results: AutomationResult[]): string[] {
    const recommendations: string[] = [];
    
    const failedResults = results.filter(r => !r.success);
    
    if (failedResults.length === 0) {
      recommendations.push('🎉 All workflows completed successfully! Your repository is in excellent condition.');
    } else {
      recommendations.push(`⚠️  ${failedResults.length} workflow(s) failed. Review the errors and consider manual intervention.`);
      
      failedResults.forEach(result => {
        recommendations.push(`🔧 Fix issues in: ${result.details?.workflow || 'unknown workflow'}`);
      });
    }
    
    return recommendations;
  }

  getStatus(): object {
    return {
      enabled: this.config.enabled,
      workflows: Array.from(this.workflows.keys()),
      lastResults: this.results.slice(-5),
      uptime: process.uptime(),
      nextScheduled: 'Based on cron schedules'
    };
  }
}

// CLI Interface
async function main() {
  const orchestrator = new AutomationOrchestrator();
  const command = process.argv[2];
  
  try {
    switch (command) {
      case 'run':
        await orchestrator.runAllWorkflows();
        break;
        
      case 'workflow':
        const workflowName = process.argv[3];
        if (!workflowName) {
          console.error('❌ Please specify a workflow name');
          process.exit(1);
        }
        await orchestrator.runWorkflow(workflowName);
        break;
        
      case 'status':
        console.log(JSON.stringify(orchestrator.getStatus(), null, 2));
        break;
        
      default:
        console.log('🤖 KONIVRER Ultimate Automation Orchestrator');
        console.log('');
        console.log('Commands:');
        console.log('  run      - Run all workflows');
        console.log('  workflow <name> - Run specific workflow');
        console.log('  status   - Show automation status');
        console.log('');
        console.log('Available workflows: typescript, security, quality, testing, performance');
        break;
    }
  } catch (error) {
    console.error('💥 Automation orchestrator failed:', error);
    process.exit(1);
  }
}

// Run if this is the main module
if (process.argv[1].includes('enhanced-orchestrator.ts')) {
  main();
}

export { AutomationOrchestrator };