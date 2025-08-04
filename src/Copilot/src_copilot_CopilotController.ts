import { State, Action, EventStream } from './core';

/**
 * CopilotController manages the agent's state and drives the main loop,
 * inspired by OpenHands' AgentController.
 */
export class CopilotController {
  private eventStream: EventStream;

  constructor(eventStream: EventStream) {
    this.eventStream = eventStream;
  }

  /**
   * The main loop to advance the agent step by step.
   */
  public async run(initialState: State): Promise<void> {
    let state = initialState;
    for (let i = 0; i < 100; i++) {
      // max iterations
      const action = this.decideNextAction(state);
      this.eventStream.publish(action);
      state = await this.eventStream.observe();
      if (state.done) break;
    }
  }

  /**
   * Decides the next action based on the current state.
   */
  public decideNextAction(_state: State): Action {
    // TODO: Actual AI logic goes here.
    return { type: 'noop' }; // placeholder
  }
}
