/**
 * Emoji Replacer Utility
 *
 * This utility replaces modern emojis with descriptive text.
 */

// Map of emoji replacements
const emojiReplacements = {
  // Status indicators
  '✅': 'Success',
  '\u{2705}': 'Success',
  '❌': 'Failed',
  '\u{274C}': 'Failed',
  '⚠️': 'Warning',
  '\u{26A0}\uFE0F': 'Warning',
  '🚨': 'Alert',
  '\u{1F6A8}': 'Alert',
  '⚙️': 'Settings',
  '\u{2699}\uFE0F': 'Settings',
  '🔍': 'Search',
  '\u{1F50D}': 'Search',
  '🔄': 'Refresh',
  '\u{1F504}': 'Refresh',
  '🔒': 'Locked',
  '\u{1F512}': 'Locked',
  '🛡️': 'Shield',
  '\u{1F6E1}\uFE0F': 'Shield',
  '👁️': 'View',
  '\u{1F441}\uFE0F': 'View',
  '👁️‍🗨️': 'View',
  '\u{1F441}\uFE0F\u200D\u{1F5E8}\uFE0F': 'View',
  '📦': 'Package',
  '\u{1F4E6}': 'Package',
  '🚀': 'Launch',
  '\u{1F680}': 'Launch',
  '🔧': 'Tool',
  '\u{1F527}': 'Tool',
  '💓': 'Heart',
  '\u{1F493}': 'Heart',
  '⚡': 'Lightning',
  '\u{26A1}': 'Lightning',
  '🎨': 'Art',
  '\u{1F3A8}': 'Art',
  '🧬': 'DNA',
  '\u{1F9EC}': 'DNA',
  '📈': 'Increasing',
  '\u{1F4C8}': 'Increasing',
  '🏗️': 'Building',
  '\u{1F3D7}\uFE0F': 'Building',
  '🔮': 'Crystal',
  '\u{1F52E}': 'Crystal',
  '🤖': 'Robot',
  '\u{1F916}': 'Robot',
  '🌐': 'Globe',
  '\u{1F310}': 'Globe',
  '📋': 'Clipboard',
  '\u{1F4CB}': 'Clipboard',
  '♿': 'Accessibility',
  '&#x267F;': 'Accessibility',
  '\u{267F}': 'Accessibility',
  '✡': 'Star of David',
  '\u{2721}': 'Star of David',
  '👑': 'Crown',
  '\u{1F451}': 'Crown',

  // Common emojis
  '👍': 'Approved',
  '\u{1F44D}': 'Approved',
  '🙏': 'Thanks',
  '\u{1F64F}': 'Thanks',
  '😊': 'Smile',
  '\u{1F60A}': 'Smile',
  '❤️': 'Love',
  '\u{2764}\uFE0F': 'Love',
  '🔥': 'Hot',
  '\u{1F525}': 'Hot',
  '💯': 'Perfect',
  '\u{1F4AF}': 'Perfect',
  '🎉': 'Celebration',
  '\u{1F389}': 'Celebration',
  '👏': 'Applause',
  '\u{1F44F}': 'Applause',
  '🤔': 'Thinking',
  '\u{1F914}': 'Thinking',
  '😂': 'Laughing',
  '\u{1F602}': 'Laughing',
  '🙌': 'Praise',
  '\u{1F64C}': 'Praise',
  '👀': 'Looking',
  '\u{1F440}': 'Looking',
  '💪': 'Strong',
  '\u{1F4AA}': 'Strong',
  '🙄': 'Eyeroll',
  '\u{1F644}': 'Eyeroll',
  '😍': 'Adoring',
  '\u{1F60D}': 'Adoring',
  '🤷': 'Shrug',
  '\u{1F937}': 'Shrug',
  '👉': 'Point right',
  '\u{1F449}': 'Point right',
  '👈': 'Point left',
  '\u{1F448}': 'Point left',
  '⭐': 'Star',
  '\u{2B50}': 'Star',
  '🔴': 'Red',
  '\u{1F534}': 'Red',
  '🟢': 'Green',
  '\u{1F7E2}': 'Green',
  '🔵': 'Blue',
  '\u{1F535}': 'Blue',
  '⚫': 'Black',
  '\u{26AB}': 'Black',
  '⚪': 'White',
  '\u{26AA}': 'White',
  '✕': 'Close',
  '\u{2715}': 'Close'
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