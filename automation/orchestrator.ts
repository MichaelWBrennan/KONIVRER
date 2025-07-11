/**
 * KONIVRER Automation Orchestrator
 * 
 * This file serves as an entry point for the automation workflow.
 * It re-exports the AutomationOrchestrator from all-in-one.ts to maintain
 * compatibility with existing workflows.
 */

import { AutomationOrchestrator, CONFIG } from './all-in-one.ts';

// Run the orchestrator when this file is executed directly
if (require.main === module) {
  console.log('🤖 Starting KONIVRER Automation Orchestrator...');
  AutomationOrchestrator.runAll();
}

export { AutomationOrchestrator, CONFIG };