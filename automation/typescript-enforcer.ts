
#!/usr/bin/env tsx

import { promises as fs } from 'fs';
import { execSync } from 'child_process';

class TypeScriptEnforcer {
  async enforceTypeScript(): Promise<void> {
    console.log('📝 Enforcing TypeScript standards...');

    try {
      // Check for any remaining JavaScript files
      const jsFiles = await this.findJavaScriptFiles();
      
      if (jsFiles.length > 0) {
        console.log(`🔄 Found ${jsFiles.length} JavaScript files to convert`);
        
        // Run ultimate TypeScript conversion
        execSync('npm run convert:final', { stdio: 'inherit' });
      }

      // Strict type checking
      console.log('🔍 Running strict type checking...');
      execSync('npm run type-check:strict', { stdio: 'inherit' });

      // Update TypeScript configuration
      await this.updateTypeScriptConfig();

      console.log('✅ TypeScript enforcement completed');
    } catch (error) {
      console.error('❌ TypeScript enforcement failed:', error);
      
      // Auto-fix TypeScript issues
      try {
        console.log('🔧 Auto-fixing TypeScript issues...');
        execSync('npm run fix:typescript:auto', { stdio: 'inherit' });
        console.log('✅ TypeScript auto-fix completed');
      } catch (fixError) {
        console.error('❌ TypeScript auto-fix failed:', fixError);
      }
    }
  }

  private async findJavaScriptFiles(): Promise<string[]> {
    try {
      const result = execSync('find . -name "*.js" -not -path "./node_modules/*" -not -path "./.git/*"', { encoding: 'utf-8' });
      return result.trim().split('\n').filter(file => file.length > 0);
    } catch {
      return [];
    }
  }

  private async updateTypeScriptConfig(): Promise<void> {
    const tsConfig = {
      compilerOptions: {
        target: "ES2022",
        lib: ["ES2022", "DOM", "DOM.Iterable"],
        allowJs: false,
        skipLibCheck: true,
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        strict: true,
        forceConsistentCasingInFileNames: true,
        noFallthroughCasesInSwitch: true,
        module: "ESNext",
        moduleResolution: "bundler",
        resolveJsonModule: true,
        isolatedModules: true,
        noEmit: true,
        jsx: "react-jsx",
        noImplicitAny: true,
        noImplicitReturns: true,
        noImplicitThis: true,
        strictNullChecks: true,
        strictFunctionTypes: true,
        strictBindCallApply: true,
        strictPropertyInitialization: true,
        noImplicitOverride: true,
        exactOptionalPropertyTypes: true,
        noUncheckedIndexedAccess: true
      },
      include: [
        "src/**/*",
        "automation/**/*",
        "scripts/**/*"
      ],
      exclude: [
        "node_modules",
        "dist",
        "build",
        "**/*.js"
      ]
    };

    await fs.writeFile('./tsconfig.json', JSON.stringify(tsConfig, null, 2), 'utf-8');
    console.log('✅ Updated TypeScript configuration');
  }
}

const enforcer = new TypeScriptEnforcer();
enforcer.enforceTypeScript();
