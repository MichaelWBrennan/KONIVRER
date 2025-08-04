// Core types and event system for the Copilot agent

export type Action = {
  type: string;
  // Add more fields as needed
};

export type Observation = {
  message: string;
  // Add more fields as needed
};

export type State = {
  done: boolean;
  history: Array<Action | Observation>;
  // Add more fields as needed
};

export class EventStream {
  private events: Array<Action | Observation> = [];

  public publish(event: Action | Observation): void {
    this.events.push(event);
  }

  public async observe(): Promise<State> {
    // Simulate observing the environment and returning the new state.
    return {
      done: false,
      history: [...this.events],
    };
  }
}
