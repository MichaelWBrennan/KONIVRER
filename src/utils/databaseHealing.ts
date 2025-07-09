/**
 * Database Self-Healing System
 * 
 * This module provides automatic detection and repair of database issues,
 * including schema validation, data integrity checks, and automatic recovery
 * from corrupted states.
 */

// Database schema validation
interface SchemaField {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required: boolean;
  defaultValue?: any;
}

interface SchemaDefinition {
  [collection: string]: SchemaField[];
}

// Define expected schema for collections
const expectedSchema: SchemaDefinition = {
  decks: [
    { name: 'id', type: 'number', required: true },
    { name: 'name', type: 'string', required: true },
    { name: 'cards', type: 'array', required: true, defaultValue: [] },
    { name: 'description', type: 'string', required: false, defaultValue: '' }
  ],
  users: [
    { name: 'id', type: 'string', required: true },
    { name: 'username', type: 'string', required: true },
    { name: 'email', type: 'string', required: true },
    { name: 'level', type: 'number', required: false, defaultValue: 1 }
  ],
  cards: [
    { name: 'id', type: 'string', required: true },
    { name: 'name', type: 'string', required: true },
    { name: 'type', type: 'string', required: true },
    { name: 'rarity', type: 'string', required: false, defaultValue: 'common' },
    { name: 'cost', type: 'number', required: false, defaultValue: 0 }
  ]
};

/**
 * Validates and heals a database record according to the expected schema
 */
function validateAndHealRecord(collection: string, record: any): any {
  if (!expectedSchema[collection]) {
    console.info(`[DB-Healing] No schema defined for collection: ${collection}`);
    return record;
  }
  
  const schema = expectedSchema[collection];
  const healedRecord = { ...record };
  let wasHealed = false;
  
  // Check each field in the schema
  schema.forEach(field => {
    // Check if required field is missing
    if (field.required && (healedRecord[field.name] === undefined || healedRecord[field.name] === null)) {
      console.info(`[DB-Healing] Adding missing required field: ${field.name} to record in ${collection}`);
      healedRecord[field.name] = field.defaultValue !== undefined ? field.defaultValue : getDefaultForType(field.type);
      wasHealed = true;
    }
    
    // Check if field has wrong type
    if (healedRecord[field.name] !== undefined && !isCorrectType(healedRecord[field.name], field.type)) {
      console.info(`[DB-Healing] Fixing type of field: ${field.name} in ${collection}`);
      healedRecord[field.name] = convertToType(healedRecord[field.name], field.type);
      wasHealed = true;
    }
  });
  
  if (wasHealed) {
    console.info(`[DB-Healing] Record in ${collection} was healed:`, healedRecord);
  }
  
  return healedRecord;
}

/**
 * Get default value for a type
 */
function getDefaultForType(type: string): any {
  switch (type) {
    case 'string': return '';
    case 'number': return 0;
    case 'boolean': return false;
    case 'object': return {};
    case 'array': return [];
    default: return null;
  }
}

/**
 * Check if a value is of the correct type
 */
function isCorrectType(value: any, type: string): boolean {
  switch (type) {
    case 'string': return typeof value === 'string';
    case 'number': return typeof value === 'number';
    case 'boolean': return typeof value === 'boolean';
    case 'object': return typeof value === 'object' && !Array.isArray(value);
    case 'array': return Array.isArray(value);
    default: return false;
  }
}

/**
 * Convert a value to the specified type
 */
function convertToType(value: any, type: string): any {
  try {
    switch (type) {
      case 'string': return String(value);
      case 'number': return Number(value);
      case 'boolean': return Boolean(value);
      case 'object': return typeof value === 'string' ? JSON.parse(value) : {};
      case 'array': return Array.isArray(value) ? value : typeof value === 'string' ? JSON.parse(value) : [];
      default: return value;
    }
  } catch (error) {
    console.info(`[DB-Healing] Error converting value to ${type}:`, error);
    return getDefaultForType(type);
  }
}

/**
 * Automatically heal local storage database
 */
function healLocalStorage(): void {
  try {
    // Check for corrupted JSON in localStorage
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('konivrer_')) {
        try {
          const value = localStorage.getItem(key);
          if (value) {
            JSON.parse(value); // Test if it's valid JSON
          }
        } catch (error) {
          console.info(`[DB-Healing] Fixing corrupted localStorage item: ${key}`);
          
          // Try to recover the data
          const corruptedValue = localStorage.getItem(key) || '';
          
          // Simple recovery: remove invalid characters and try to parse again
          const cleanedValue = corruptedValue.replace(/[^\x20-\x7E]/g, '');
          try {
            JSON.parse(cleanedValue);
            localStorage.setItem(key, cleanedValue);
          } catch (error2) {
            // If still can't parse, initialize with empty data
            const collectionName = key.replace('konivrer_', '');
            const emptyData = collectionName === 'decks' ? '[]' : collectionName === 'users' ? '[]' : '{}';
            localStorage.setItem(key, emptyData);
          }
        }
      }
    });
  } catch (error) {
    console.info('[DB-Healing] Error healing localStorage:', error);
  }
}

/**
 * Intercept and heal database operations
 */
export function createHealingDatabaseProxy(db: any): any {
  return new Proxy(db, {
    get(target, prop) {
      const originalMethod = target[prop];
      
      // If it's a function, wrap it with healing logic
      if (typeof originalMethod === 'function') {
        return function(...args: any[]) {
          try {
            // Pre-operation healing
            if (prop === 'getItem' || prop === 'setItem') {
              healLocalStorage();
            }
            
            // For setItem operations, validate and heal the data
            if (prop === 'setItem' && args.length >= 2) {
              const [key, value] = args;
              const collectionName = typeof key === 'string' ? key.replace('konivrer_', '') : '';
              
              if (expectedSchema[collectionName] && typeof value === 'string') {
                try {
                  const data = JSON.parse(value);
                  
                  // If it's an array, heal each item
                  if (Array.isArray(data)) {
                    const healedData = data.map(item => validateAndHealRecord(collectionName, item));
                    args[1] = JSON.stringify(healedData);
                  } 
                  // If it's a single object
                  else if (typeof data === 'object') {
                    const healedData = validateAndHealRecord(collectionName, data);
                    args[1] = JSON.stringify(healedData);
                  }
                } catch (error) {
                  console.info(`[DB-Healing] Error healing data for ${key}:`, error);
                }
              }
            }
            
            // Execute the original method
            return originalMethod.apply(target, args);
          } catch (error) {
            console.info(`[DB-Healing] Error in database operation ${String(prop)}:`, error);
            
            // Provide fallback behavior for common operations
            if (prop === 'getItem') {
              return null;
            }
            if (prop === 'setItem') {
              // Try again with simplified data
              try {
                const [key, _] = args;
                const fallbackValue = '{}';
                return originalMethod.call(target, key, fallbackValue);
              } catch {
                // Silent failure
                return null;
              }
            }
            
            return null;
          }
        };
      }
      
      // Return the original property
      return originalMethod;
    }
  });
}

/**
 * Initialize database healing
 */
export function initDatabaseHealing(): void {
  console.info('[DB-Healing] Database healing system initialized');
  
  // Heal localStorage on initialization
  healLocalStorage();
  
  // Create a healed localStorage proxy
  if (typeof window !== 'undefined') {
    const healedLocalStorage = createHealingDatabaseProxy(localStorage);
    
    // Override localStorage methods with healing versions
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
      return healedLocalStorage.setItem(key, value);
    };
    
    const originalGetItem = localStorage.getItem;
    localStorage.getItem = function(key) {
      return healedLocalStorage.getItem(key);
    };
  }
  
  // Set up periodic database integrity checks
  if (typeof window !== 'undefined') {
    setInterval(() => {
      healLocalStorage();
    }, 300000); // Run every 5 minutes
  }
}

export default {
  initDatabaseHealing,
  validateAndHealRecord,
  createHealingDatabaseProxy
};