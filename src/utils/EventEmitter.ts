```typescript
class EventEmitter {
  private events: { [key: string]: Function[] } = {};

  on(_event: string, listener: Function): this {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
    return this;
  }

  off(_event: string, listener: Function): this {
    if (!this.events[event]) return this;
    this.events[event] = this.events[event].filter(l => l !== listener);
    return this;
  }

  emit(_event: string, ...args: any[]): boolean {
    if (!this.events[event]) return false;
    this.events[event].forEach(listener => listener(...args));
    return true;
  }

  removeAllListeners(event?: string): this {
    if (_event) {
      delete this.events[event];
    } else {
      this.events = {};
    }
    return this;
  }
}

export default EventEmitter;
```;
