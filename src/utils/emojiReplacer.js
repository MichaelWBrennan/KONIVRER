/**
 * Emoji Replacer Utility
 * 
 * This utility replaces modern emojis with ancient symbols and text.
 */

// Map of emoji replacements
const emojiReplacements = {
  // Status indicators
  '✅': '†',
  '❌': '✗',
  '⚠️': '⚜',
  '🚨': '⚔',
  '⚙️': '⚓',
  '🔍': '⚜',
  '🔄': '↻',
  '🔒': '⍟',
  '🛡️': '⛨',
  '👁️': '◉',
  '📦': '▣',
  '🚀': '⇪',
  '🔧': '⚒',
  '💓': '♥',
  '⚡': '↯',
  '🎨': '♞',
  '🧬': '∞',
  '📈': '⇗',
  '🏗️': '⌂',
  '🔮': '◎',
  '🤖': '⌬',
  '🌐': '◯',
  '📋': '≡',
  
  // Common emojis
  '👍': 'Verily',
  '🙏': 'Gratitude',
  '😊': 'Joy',
  '❤️': '♥',
  '🔥': 'Flame',
  '💯': 'Perfect',
  '🎉': 'Celebration',
  '👏': 'Applause',
  '🤔': 'Contemplation',
  '😂': 'Mirth',
  '🙌': 'Praise',
  '👀': 'Observe',
  '💪': 'Strength',
  '🙄': 'Doubt',
  '😍': 'Adoration',
  '🤷': 'Uncertainty',
  '👉': '→',
  '👈': '←',
  '⭐': '★',
  '🔴': '◉',
  '🟢': '◎',
  '🔵': '◈',
  '⚫': '●',
  '⚪': '○'
};

/**
 * Replace emojis in a string with ancient symbols
 * @param {string} text - The text containing emojis
 * @return {string} - Text with emojis replaced by ancient symbols
 */
export const replaceEmojis = (text) => {
  if (!text) return text;
  
  let result = text;
  
  // Replace known emojis
  Object.entries(emojiReplacements).forEach(([emoji, replacement]) => {
    result = result.replace(new RegExp(emoji, 'g'), replacement);
  });
  
  // Use regex to find and replace any remaining emojis with a generic symbol
  result = result.replace(
    /[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, 
    '※'
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