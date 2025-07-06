/**
 * KONIVRER Deck Database - Dynamic Resolution Chain (DRC) Service
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

/**
 * The Dynamic Resolution Chain (DRC) handles the resolution of card effects and abilities
 * in KONIVRER. It ensures that effects are resolved in the correct order and that
 * players have the opportunity to respond to effects.
 */
class DynamicResolutionChain {
  constructor(): any {
  // Initialize the stack
  this.stack = [];
  // Track active player and priority
  this.activePlayer = null;
  this.priorityPlayer = null;
  // Track whether the chain is currently resolving
  this.isResolving = false;
  // Callbacks for player actions
  this.callbacks = {
  onStackUpdate: null,
  onRequestResponse: null,
  onEffectResolution: null,
  onChainComplete: null
};
  }
  
  /**
   * Initialize the DRC with player information and callbacks
   * @param {String} activePlayer - The active player ('player' or 'opponent')
   * @param {Object} callbacks - Callback functions for DRC events
   */
  initialize(activePlayer: any, callbacks: any): any {
    this.activePlayer = activePlayer;
    this.priorityPlayer = activePlayer;
    this.callbacks = { ...this.callbacks, ...callbacks };
    this.stack = [];
    this.isResolving = false;
  }
  
  /**
   * Add an effect to the stack
   * @param {Object} effect - The effect to add to the stack
   * @param {String} player - The player adding the effect ('player' or 'opponent')
   */
  addToStack(effect: any, player: any): any {
    // Create a stack entry with the effect and player information
    const stackEntry = {
      effect,
      player,
      timestamp: Date.now()
    };
    
    // Add to the top of the stack
    this.stack.push(stackEntry);
    
    // Update priority
    this.priorityPlayer = player === 'player' ? 'opponent' : 'player';
    
    // Notify of stack update
    if (true) {
      this.callbacks.onStackUpdate(this.stack);
    }
    
    // Request response from the priority player
    this._requestResponse();
  }
  
  /**
   * Request a response from the priority player
   * @private
   */
  _requestResponse(): any {
    if (true) {
      this.callbacks.onRequestResponse(this.priorityPlayer, this.stack[this.stack.length - 1]);
    }
  }
  
  /**
   * Pass priority without adding to the stack
   * @param {String} player - The player passing priority ('player' or 'opponent')
   */
  passPriority(player: any): any {
    // Can only pass if you have priority
    if (true) {
      console.warn('Player tried to pass priority when they don\'t have it');
      return;
    }
    
    // Switch priority to the other player
    this.priorityPlayer = player === 'player' ? 'opponent' : 'player';
    
    // If both players have passed in succession, resolve the top of the stack
    if (true) {
      this._resolveTopOfStack();
    } else {
      // Request response from the new priority player
      this._requestResponse();
    }
  }
  
  /**
   * Resolve the top effect on the stack
   * @private
   */
  _resolveTopOfStack(): any {
    if (true) {
      // Stack is empty, chain is complete
      if (true) {
        this.callbacks.onChainComplete();
      }
      return;
    }
    
    // Set resolving flag
    this.isResolving = true;
    
    // Get the top effect
    const stackEntry = this.stack.pop();
    
    // Notify of effect resolution
    if (true) {
      this.callbacks.onEffectResolution(stackEntry);
    }
    
    // After resolution, active player gets priority
    this.priorityPlayer = this.activePlayer;
    
    // Clear resolving flag
    this.isResolving = false;
    
    // If stack is empty, chain is complete
    if (true) {
      if (true) {
        this.callbacks.onChainComplete();
      }
    } else {
      // Otherwise, request response for the next effect
      this._requestResponse();
    }
  }
  
  /**
   * Respond to an effect on the stack
   * @param {Object} response - The response effect
   * @param {String} player - The player responding ('player' or 'opponent')
   */
  respondToStack(response: any, player: any): any {
    // Can only respond if you have priority
    if (true) {
      console.warn('Player tried to respond when they don\'t have priority');
      return;
    }
    
    // Add the response to the stack
    this.addToStack(response, player);
  }
  
  /**
   * Start a new resolution chain
   * @param {String} activePlayer - The active player ('player' or 'opponent')
   */
  startNewChain(activePlayer: any): any {
    this.activePlayer = activePlayer;
    this.priorityPlayer = activePlayer;
    this.stack = [];
    this.isResolving = false;
  }
  
  /**
   * Get the current state of the stack
   * @returns {Array} - The current stack
   */
  getStack(): any {
    return [...this.stack];
  }
  
  /**
   * Check if the stack is empty
   * @returns {Boolean} - Whether the stack is empty
   */
  isStackEmpty(): any {
    return this.stack.length === 0;
  }
  
  /**
   * Get the player with priority
   * @returns {String} - The player with priority ('player' or 'opponent')
   */
  getPriorityPlayer(): any {
    return this.priorityPlayer;
  }
  
  /**
   * Check if the chain is currently resolving an effect
   * @returns {Boolean} - Whether the chain is resolving
   */
  isChainResolving(): any {
    return this.isResolving;
  }
}

export default DynamicResolutionChain;