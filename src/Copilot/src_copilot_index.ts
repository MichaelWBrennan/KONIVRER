import { CopilotController } from "./CopilotController";
import { EventStream, State } from "./core";

// Entry point for Copilot agent system
export async function runCopilot(initialState?: State) {
  const eventStream = new EventStream();
  const controller = new CopilotController(eventStream);

  // Use initialState or start with a blank state
  const state = initialState || { done: false, history: [] };
  await controller.run(state);
}