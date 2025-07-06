/**
 * ESLint rule to enforce TypeScript-only policy
 * 
 * This rule checks if a file is JavaScript and reports an error if it is.
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce TypeScript-only policy',
      category: 'TypeScript',
      recommended: true,
    },
    fixable: 'code',
    schema: [], // no options
  },
  create(context) {
    const filename = context.getFilename();
    
    // Skip node_modules, dist, build, etc.
    if (filename.includes('node_modules') || 
        filename.includes('dist') || 
        filename.includes('build')) {
      return {};
    }
    
    // Check if the file is JavaScript
    if (filename.endsWith('.js') || filename.endsWith('.jsx')) {
      return {
        Program(node) {
          context.report({
            node,
            message: 'JavaScript files are not allowed. Use TypeScript instead.',
            fix(fixer) {
              // Suggest renaming the file to TypeScript
              const newFilename = filename.replace(/\.jsx?$/, match => {
                return match === '.js' ? '.ts' : '.tsx';
              });
              
              return fixer.insertTextBefore(node, `// TODO: Rename this file to ${newFilename}\n`);
            }
          });
        }
      };
    }
    
    return {};
  }
};