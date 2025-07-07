/**
 * Emoji Replacer Utility
 *
 * This utility replaces modern emojis with descriptive text.
 */

// Map of emoji replacements
const emojiReplacements = {
  // Status indicators
  '✅': 'Success',
  '❌': 'Failed',
  '⚠️': 'Warning',
  '🚨': 'Alert',
  '⚙️': 'Settings',
  '🔍': 'Search',
  '🔄': 'Refresh',
  '🔒': 'Locked',
  '🛡️': 'Shield',
  '👁️': 'View',
  '📦': 'Package',
  '🚀': 'Launch',
  '🔧': 'Tool',
  '💓': 'Heart',
  '⚡': 'Lightning',
  '🎨': 'Art',
  '🧬': 'DNA',
  '📈': 'Increasing',
  '🏗️': 'Building',
  '🔮': 'Crystal',
  '🤖': 'Robot',
  '🌐': 'Globe',
  '📋': 'Clipboard',

  // Common emojis
  '👍': 'Approved',
  '🙏': 'Thanks',
  '😊': 'Smile',
  '❤️': 'Love',
  '🔥': 'Hot',
  '💯': 'Perfect',
  '🎉': 'Celebration',
  '👏': 'Applause',
  '🤔': 'Thinking',
  '😂': 'Laughing',
  '🙌': 'Praise',
  '👀': 'Looking',
  '💪': 'Strong',
  '🙄': 'Eyeroll',
  '😍': 'Adoring',
  '🤷': 'Shrug',
  '👉': 'Point right',
  '👈': 'Point left',
  '⭐': 'Star',
  '🔴': 'Red',
  '🟢': 'Green',
  '🔵': 'Blue',
  '⚫': 'Black',
  '⚪': 'White'
};

/**
 * Replace emojis in a string with descriptive text
 * @param {string} text - The text containing emojis
 * @return {string} - Text with emojis replaced by descriptive text
 */
export const replaceEmojis = (text) => {
  if (!text) return text;

  let result = text;

  // Replace known emojis
  Object.entries(emojiReplacements).forEach(([emoji, replacement]) => {
    result = result.replace(new RegExp(emoji, 'g'), replacement);
  });

  // Use regex to find and replace any remaining emojis with a generic description
  result = result.replace(
    /[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu,
    '[emoji]'
  );

  return result;
};

/**
 * Replace emojis in an object's string properties recursively
 * @param {object} obj - The object containing strings with emojis
 * @return {object} - Object with emojis replaced in all string properties
 */
export const replaceEmojisInObject = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;

  const result = Array.isArray(obj) ? [...obj] : {...obj};

  Object.entries(result).forEach(([key, value]) => {
    if (typeof value === 'string') {
      result[key] = replaceEmojis(value);
    } else if (typeof value === 'object' && value !== null) {
      result[key] = replaceEmojisInObject(value);
    }
  });

  return result;
};

export default {
  replaceEmojis,
  replaceEmojisInObject
};
