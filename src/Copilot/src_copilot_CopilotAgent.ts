import { EventStream, State, Action, Observation } from "./core";
import { CopilotController } from "./CopilotController";

/**
 * CopilotAgent is responsible for evaluating the current state and producing actions
 * to achieve the goal, inspired by OpenHands AI autonomy.
 */
export class CopilotAgent {
  private controller: CopilotController;

  constructor(controller: CopilotController) {
    this.controller = controller;
  }

  /**
   * Advances the agent by one step, receiving the latest state and returning the next action.
   */
  public async nextStep(state: State): Promise<Action> {
    // TODO: Implement agent logic to evaluate state and propose next action.
    // This is where autonomy logic will reside.
    return this.controller.decideNextAction(state);
  }
}