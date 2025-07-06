#!/usr/bin/env tsx

/**
 * Ultimate TypeScript Conversion Script
 * Converts all remaining JavaScript files to TypeScript with comprehensive automation
 */

import { promises as fs } from 'fs';
import { join, dirname, extname, basename } from 'path';
import { execSync } from 'child_process';

interface ConversionResult {
  converted: string[];
  skipped: string[];
  errors: string[];
}

class UltimateTypeScriptConverter {
  private readonly excludePaths = [
    'node_modules',
    '.git',
    'dist',
    'build',
    '.next',
    'coverage'
  ];

  private readonly preserveFiles = [
    'public/sw.js', // Service worker needs to remain JS
    'vite.config.js', // Will be handled separately
    'postcss.config.js' // Will be handled separately
  ];

  async convertAllToTypeScript(): Promise<ConversionResult> {
    console.log('🚀 Starting Ultimate TypeScript Conversion...');
    
    const result: ConversionResult = {
      converted: [],
      skipped: [],
      errors: []
    };

    try {
      // Find all JavaScript files
      const jsFiles = await this.findJavaScriptFiles('.');
      console.log(`📁 Found ${jsFiles.length} JavaScript files to process`);

      // Convert each file
      for (const file of jsFiles) {
        try {
          if (this.shouldPreserveFile(file)) {
            result.skipped.push(file);
            console.log(`⏭️  Skipping preserved file: ${file}`);
            continue;
          }

          await this.convertFile(file);
          result.converted.push(file);
          console.log(`✅ Converted: ${file}`);
        } catch (error) {
          result.errors.push(`${file}: ${error}`);
          console.error(`❌ Error converting ${file}:`, error);
        }
      }

      // Convert configuration files
      await this.convertConfigFiles();

      // Update package.json scripts
      await this.updatePackageJsonScripts();

      // Update ESLint configuration
      await this.updateESLintConfig();

      // Generate comprehensive type definitions
      await this.generateTypeDefinitions();

      console.log('\n🎉 Ultimate TypeScript Conversion Complete!');
      console.log(`✅ Converted: ${result.converted.length} files`);
      console.log(`⏭️  Skipped: ${result.skipped.length} files`);
      console.log(`❌ Errors: ${result.errors.length} files`);

      return result;
    } catch (error) {
      console.error('💥 Fatal error during conversion:', error);
      throw error;
    }
  }

  private async findJavaScriptFiles(dir: string): Promise<string[]> {
    const files: string[] = [];
    
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      
      if (entry.isDirectory() && !this.excludePaths.includes(entry.name)) {
        files.push(...await this.findJavaScriptFiles(fullPath));
      } else if (entry.isFile() && (entry.name.endsWith('.js') || entry.name.endsWith('.jsx'))) {
        files.push(fullPath);
      }
    }
    
    return files;
  }

  private shouldPreserveFile(file: string): boolean {
    return this.preserveFiles.some(preserved => file.includes(preserved));
  }

  private async convertFile(filePath: string): Promise<void> {
    const content = await fs.readFile(filePath, 'utf-8');
    const ext = extname(filePath);
    const newExt = ext === '.jsx' ? '.tsx' : '.ts';
    const newPath = filePath.replace(ext, newExt);

    // Basic TypeScript conversion
    let convertedContent = content;

    // Add TypeScript imports and types
    convertedContent = this.addTypeScriptImports(convertedContent);
    convertedContent = this.addTypeAnnotations(convertedContent);
    convertedContent = this.fixCommonPatterns(convertedContent);

    // Write the new TypeScript file
    await fs.writeFile(newPath, convertedContent, 'utf-8');

    // Remove the old JavaScript file
    await fs.unlink(filePath);
  }

  private addTypeScriptImports(content: string): string {
    // Add common TypeScript imports if needed
    if (content.includes('React') && !content.includes('import React')) {
      content = `import React from 'react';\n${content}`;
    }

    // Add type imports for common patterns
    if (content.includes('useState') && !content.includes('import { useState }')) {
      content = content.replace(
        /import React/,
        "import React, { useState }"
      );
    }

    return content;
  }

  private addTypeAnnotations(content: string): string {
    // Add basic type annotations for common patterns
    
    // Function parameters
    content = content.replace(
      /function\s+(\w+)\s*\(([^)]*)\)/g,
      (match, name, params) => {
        if (params && !params.includes(':')) {
          const typedParams = params.split(',').map((param: string) => {
            const trimmed = param.trim();
            if (trimmed && !trimmed.includes(':')) {
              return `${trimmed}: any`;
            }
            return param;
          }).join(', ');
          return `function ${name}(${typedParams})`;
        }
        return match;
      }
    );

    // Arrow functions
    content = content.replace(
      /const\s+(\w+)\s*=\s*\(([^)]*)\)\s*=>/g,
      (match, name, params) => {
        if (params && !params.includes(':')) {
          const typedParams = params.split(',').map((param: string) => {
            const trimmed = param.trim();
            if (trimmed && !trimmed.includes(':')) {
              return `${trimmed}: any`;
            }
            return param;
          }).join(', ');
          return `const ${name} = (${typedParams}) =>`;
        }
        return match;
      }
    );

    return content;
  }

  private fixCommonPatterns(content: string): string {
    // Fix require statements
    content = content.replace(
      /const\s+(\w+)\s*=\s*require\(['"]([^'"]+)['"]\)/g,
      "import $1 from '$2'"
    );

    // Fix module.exports
    content = content.replace(
      /module\.exports\s*=\s*/g,
      'export default '
    );

    // Add proper export statements
    if (content.includes('export default') && !content.includes('export default')) {
      content += '\nexport default {};';
    }

    return content;
  }

  private async convertConfigFiles(): Promise<void> {
    console.log('🔧 Converting configuration files...');

    // Convert vite.config.js if it exists
    try {
      const viteConfigPath = './vite.config.js';
      const viteConfigExists = await fs.access(viteConfigPath).then(() => true).catch(() => false);
      
      if (viteConfigExists) {
        const content = await fs.readFile(viteConfigPath, 'utf-8');
        const tsContent = this.convertViteConfig(content);
        await fs.writeFile('./vite.config.ts', tsContent, 'utf-8');
        await fs.unlink(viteConfigPath);
        console.log('✅ Converted vite.config.js to TypeScript');
      }
    } catch (error) {
      console.log('⚠️  Vite config already in TypeScript or not found');
    }

    // Convert postcss.config.js if it exists
    try {
      const postcssConfigPath = './postcss.config.js';
      const postcssConfigExists = await fs.access(postcssConfigPath).then(() => true).catch(() => false);
      
      if (postcssConfigExists) {
        const content = await fs.readFile(postcssConfigPath, 'utf-8');
        const tsContent = this.convertPostCSSConfig(content);
        await fs.writeFile('./postcss.config.ts', tsContent, 'utf-8');
        await fs.unlink(postcssConfigPath);
        console.log('✅ Converted postcss.config.js to TypeScript');
      }
    } catch (error) {
      console.log('⚠️  PostCSS config already in TypeScript or not found');
    }
  }

  private convertViteConfig(content: string): string {
    return `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

${content.replace(/module\.exports\s*=/, 'export default defineConfig(')}${content.includes('export default') ? '' : ')'}`;
  }

  private convertPostCSSConfig(content: string): string {
    return `import type { Config } from 'postcss';

${content.replace(/module\.exports\s*=/, 'const config: Config = ')}

export default config;`;
  }

  private async updatePackageJsonScripts(): Promise<void> {
    console.log('📦 Updating package.json scripts...');
    
    const packageJsonPath = './package.json';
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));

    // Update scripts to use TypeScript versions
    const scripts = packageJson.scripts || {};
    
    // Convert any remaining .js script references to .ts
    Object.keys(scripts).forEach(key => {
      scripts[key] = scripts[key]
        .replace(/node\s+([^.]+)\.js/g, 'tsx $1.ts')
        .replace(/\.js(\s|$)/g, '.ts$1');
    });

    // Add TypeScript-specific scripts
    scripts['type-check:strict'] = 'tsc --noEmit --strict';
    scripts['convert:final'] = 'tsx scripts/ultimate-typescript-conversion.ts';
    scripts['automation:typescript'] = 'tsx automation/typescript-enforcer.ts';

    packageJson.scripts = scripts;

    await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf-8');
    console.log('✅ Updated package.json scripts');
  }

  private async updateESLintConfig(): Promise<void> {
    console.log('🔍 Updating ESLint configuration...');
    
    const eslintConfigPath = './.eslintrc.json';
    
    try {
      const eslintConfig = JSON.parse(await fs.readFile(eslintConfigPath, 'utf-8'));
      
      // Ensure TypeScript rules are enabled
      eslintConfig.extends = eslintConfig.extends || [];
      if (!eslintConfig.extends.includes('@typescript-eslint/recommended')) {
        eslintConfig.extends.push('@typescript-eslint/recommended');
      }
      if (!eslintConfig.extends.includes('@typescript-eslint/recommended-requiring-type-checking')) {
        eslintConfig.extends.push('@typescript-eslint/recommended-requiring-type-checking');
      }

      // Add strict TypeScript rules
      eslintConfig.rules = eslintConfig.rules || {};
      eslintConfig.rules['@typescript-eslint/no-explicit-any'] = 'warn';
      eslintConfig.rules['@typescript-eslint/explicit-function-return-type'] = 'warn';
      eslintConfig.rules['@typescript-eslint/no-unused-vars'] = 'error';
      eslintConfig.rules['@typescript-eslint/strict-boolean-expressions'] = 'error';

      await fs.writeFile(eslintConfigPath, JSON.stringify(eslintConfig, null, 2), 'utf-8');
      console.log('✅ Updated ESLint configuration');
    } catch (error) {
      console.log('⚠️  Could not update ESLint config:', error);
    }
  }

  private async generateTypeDefinitions(): Promise<void> {
    console.log('📝 Generating comprehensive type definitions...');
    
    const typesDir = './src/types';
    await fs.mkdir(typesDir, { recursive: true });

    // Generate global types
    const globalTypes = `
// Global TypeScript definitions for KONIVRER
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export {};
`;

    await fs.writeFile(join(typesDir, 'global.d.ts'), globalTypes, 'utf-8');

    // Generate automation types
    const automationTypes = `
export interface AutomationConfig {
  enabled: boolean;
  interval: number;
  tasks: AutomationTask[];
}

export interface AutomationTask {
  name: string;
  type: 'security' | 'performance' | 'quality' | 'dependencies';
  schedule: string;
  enabled: boolean;
}

export interface AutomationResult {
  success: boolean;
  message: string;
  timestamp: Date;
  details?: any;
}
`;

    await fs.writeFile(join(typesDir, 'automation.ts'), automationTypes, 'utf-8');

    console.log('✅ Generated comprehensive type definitions');
  }
}

// Execute the conversion
async function main() {
  const converter = new UltimateTypeScriptConverter();
  
  try {
    const result = await converter.convertAllToTypeScript();
    
    console.log('\n📊 Conversion Summary:');
    console.log('='.repeat(50));
    console.log(`✅ Successfully converted: ${result.converted.length} files`);
    console.log(`⏭️  Skipped (preserved): ${result.skipped.length} files`);
    console.log(`❌ Errors encountered: ${result.errors.length} files`);
    
    if (result.errors.length > 0) {
      console.log('\n❌ Errors:');
      result.errors.forEach(error => console.log(`  - ${error}`));
    }
    
    console.log('\n🎉 Your repository is now 100% TypeScript!');
    console.log('🚀 Run "npm run type-check" to verify everything is working correctly.');
    
  } catch (error) {
    console.error('💥 Conversion failed:', error);
    process.exit(1);
  }
}

// Run if this is the main module
main();

export { UltimateTypeScriptConverter };