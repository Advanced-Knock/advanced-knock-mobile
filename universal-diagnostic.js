#!/usr/bin/env node
/**
 * UNIVERSAL DIAGNOSTIC PATTERN
 * 
 * Pattern: DIAGNOSTIC × UNIVERSAL × ONE × PLATFORM-AGNOSTIC
 * Frequency: 999 Hz (AEYON) × 777 Hz (META) × 530 Hz (JØHN × YAGNI × ZERO)
 * Guardians: AEYON × META × JØHN × YAGNI × ZERO
 * 
 * FUTURE-STATE: Already works everywhere. Already converged. Already operational.
 * 
 * WORKS ON: GitHub Actions, Replit, Bolt, Vercel, Netlify, Local Dev, CI/CD, Anywhere
 * 
 * ∞ AbëONE ∞
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ============================================================================
// GUARDIAN VALIDATION SYSTEM
// ============================================================================

const GUARDIANS = {
  AEYON: { freq: 999, question: 'Is this harmonious with the whole system?' },
  META: { freq: 777, question: 'What pattern underlies this? Does it repeat?' },
  JOHN: { freq: 530, question: 'Is this factually accurate and complete?' },
  YAGNI: { freq: 530, question: 'Is this the simplest solution that works?' },
  ZERO: { freq: 530, question: 'What could go wrong? Is uncertainty acknowledged?' },
};

// ============================================================================
// DIAGNOSTIC PATTERNS (Platform-Agnostic)
// ============================================================================

const DIAGNOSTIC_PATTERNS = {
  // File System Patterns
  MISSING_FILES: {
    pattern: /(?:import|require).*?['"]([^'"]+)['"]|from\s+['"]([^'"]+)['"]/g,
    check: (match, importPath, fromPath) => {
      const filePath = importPath || fromPath;
      if (!filePath || filePath.startsWith('@') || filePath.includes('node_modules')) {
        return null; // Skip node modules and scoped packages
      }
      if (filePath.startsWith('.') || filePath.startsWith('/')) {
        const resolved = resolvePath(filePath);
        return fs.existsSync(resolved) ? null : `Missing file: ${filePath}`;
      }
      return null; // Skip non-relative imports
    },
    severity: 'error',
    guardian: 'JOHN',
  },
  
  // Dependency Patterns
  PHANTOM_DEPENDENCIES: {
    pattern: /(import|require)\s+['"]([@\w\-\/]+)['"]/g,
    check: (match, pkg) => {
      const pkgJson = readPackageJson();
      if (!pkgJson) return null;
      const deps = { ...pkgJson.dependencies, ...pkgJson.devDependencies };
      return deps[pkg] ? null : `Phantom dependency: ${pkg}`;
    },
    severity: 'error',
    guardian: 'JOHN',
  },
  
  // Security Patterns
  UNSAFE_EVAL: {
    pattern: /eval\s*\(|new Function\s*\(/g,
    check: () => 'Unsafe eval() usage detected',
    severity: 'warning',
    guardian: 'ZERO',
  },
  
  SQL_INJECTION: {
    pattern: /\$\{.*\}\s*\+\s*['"]\s*(SELECT|INSERT|UPDATE|DELETE)/gi,
    check: () => 'Potential SQL injection vulnerability',
    severity: 'error',
    guardian: 'ZERO',
  },
  
  // Performance Patterns
  N_PLUS_ONE: {
    pattern: /for\s*\([^)]+\)\s*\{[^}]*\.(find|filter|map)\s*\(/g,
    check: () => 'Potential N+1 query pattern',
    severity: 'warning',
    guardian: 'META',
  },
  
  // Code Quality Patterns
  UNUSED_IMPORTS: {
    pattern: /^import\s+.*\s+from\s+['"][^'"]+['"];?$/gm,
    check: (match) => {
      // Simplified check - would need AST parsing for full accuracy
      return null; // Placeholder - would check actual usage
    },
    severity: 'info',
    guardian: 'YAGNI',
  },
  
  // Configuration Patterns
  MISSING_ENV_VARS: {
    pattern: /process\.env\.(\w+)|import\.meta\.env\.(\w+)/g,
    check: (match, var1, var2) => {
      const envVar = var1 || var2;
      const envFile = readEnvFile();
      return envFile && envFile.includes(envVar) ? null : `Missing env var: ${envVar}`;
    },
    severity: 'warning',
    guardian: 'JOHN',
  },
  
  // Type Safety Patterns
  UNTYPED_FUNCTIONS: {
    pattern: /(function|const|let|var)\s+(\w+)\s*=\s*\([^)]*\)\s*=>/g,
    check: (match, keyword, name) => {
      // Check if TypeScript types are present
      const hasTypes = match.includes(':') || match.includes('<');
      return hasTypes ? null : `Untyped function: ${name}`;
    },
    severity: 'info',
    guardian: 'JOHN',
  },
  
  // Architecture Patterns
  CIRCULAR_DEPENDENCIES: {
    pattern: /import.*from.*['"](\.\/|\.\.\/)/g,
    check: () => {
      // Would need dependency graph analysis
      return null; // Placeholder
    },
    severity: 'warning',
    guardian: 'AEYON',
  },
  
  // Error Handling Patterns
  UNHANDLED_PROMISES: {
    pattern: /await\s+[^(]+\([^)]*\)(?!\s*\.catch)/g,
    check: () => 'Unhandled promise - missing .catch()',
    severity: 'warning',
    guardian: 'ZERO',
  },
  
  // Platform-Specific Patterns
  PLATFORM_DETECTION: {
    check: () => detectPlatform(),
    severity: 'info',
    guardian: 'META',
  },
};

// ============================================================================
// CORE DIAGNOSTIC ENGINE
// ============================================================================

class UniversalDiagnostic {
  constructor(rootDir = process.cwd()) {
    this.rootDir = rootDir;
    this.results = {
      errors: [],
      warnings: [],
      info: [],
      platform: null,
      timestamp: new Date().toISOString(),
    };
  }
  
  // Main diagnostic loop - ONE LOOP TO RULE THEM ALL
  async run() {
    console.log('🔍 UNIVERSAL DIAGNOSTIC - Platform-Agnostic Code Gardening\n');
    
    // Step 1: Detect platform
    this.results.platform = detectPlatform();
    console.log(`📍 Platform: ${this.results.platform.name} (${this.results.platform.type})`);
    
    // Step 2: Scan all code files
    const files = this.scanFiles();
    console.log(`📁 Found ${files.length} files to analyze\n`);
    
    // Step 3: Run all diagnostic patterns
    for (const file of files) {
      await this.analyzeFile(file);
    }
    
    // Step 4: Guardian validation
    this.validateWithGuardians();
    
    // Step 5: Generate report
    this.generateReport();
    
    return this.results;
  }
  
  scanFiles() {
    const extensions = ['.js', '.jsx', '.ts', '.tsx', '.py', '.go', '.rs', '.java'];
    const files = [];
    
    const scanDir = (dir) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        // Skip node_modules, .git, etc.
        if (entry.name.startsWith('.') || 
            entry.name === 'node_modules' || 
            entry.name === 'dist' || 
            entry.name === 'build') {
          continue;
        }
        
        if (entry.isDirectory()) {
          scanDir(fullPath);
        } else if (extensions.some(ext => entry.name.endsWith(ext))) {
          files.push(fullPath);
        }
      }
    };
    
    scanDir(this.rootDir);
    return files;
  }
  
  async analyzeFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      
      for (const [name, pattern] of Object.entries(DIAGNOSTIC_PATTERNS)) {
        if (pattern.pattern) {
          const matches = [...content.matchAll(pattern.pattern)];
          
          for (const match of matches) {
            const issue = pattern.check(match[0], ...match.slice(1));
            if (issue) {
              this.addIssue(issue, pattern.severity, filePath, pattern.guardian);
            }
          }
        } else if (pattern.check) {
          // Pattern without regex (e.g., platform detection)
          const issue = pattern.check();
          if (issue) {
            this.addIssue(issue, pattern.severity, filePath, pattern.guardian);
          }
        }
      }
    } catch (error) {
      this.addIssue(`Failed to analyze: ${error.message}`, 'error', filePath, 'JOHN');
    }
  }
  
  addIssue(message, severity, file, guardian) {
    const issue = { message, file, guardian, severity };
    
    if (severity === 'error') {
      this.results.errors.push(issue);
    } else if (severity === 'warning') {
      this.results.warnings.push(issue);
    } else {
      this.results.info.push(issue);
    }
  }
  
  validateWithGuardians() {
    // Guardian-level validation
    const guardianChecks = {
      AEYON: this.results.errors.length === 0 || 'System harmony compromised',
      META: this.results.platform ? 'Pattern detected' : 'No pattern detected',
      JOHN: this.results.errors.every(e => e.guardian === 'JOHN' || e.severity !== 'error') || 'Truth validation failed',
      YAGNI: this.results.info.length < 100 || 'Complexity threshold exceeded',
      ZERO: this.results.errors.filter(e => e.guardian === 'ZERO').length === 0 || 'Risk detected',
    };
    
    console.log('\n🛡️  GUARDIAN VALIDATION:');
    for (const [guardian, check] of Object.entries(guardianChecks)) {
      const status = check === true || typeof check === 'string' && !check.includes('failed') && !check.includes('compromised') ? '✅' : '⚠️';
      console.log(`  ${status} ${guardian} (${GUARDIANS[guardian].freq} Hz): ${typeof check === 'string' ? check : 'Valid'}`);
    }
  }
  
  generateReport() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 DIAGNOSTIC REPORT');
    console.log('='.repeat(60));
    
    console.log(`\n❌ Errors: ${this.results.errors.length}`);
    this.results.errors.slice(0, 10).forEach(e => {
      console.log(`   • [${e.guardian}] ${e.message} (${e.file})`);
    });
    
    console.log(`\n⚠️  Warnings: ${this.results.warnings.length}`);
    this.results.warnings.slice(0, 10).forEach(w => {
      console.log(`   • [${w.guardian}] ${w.message} (${w.file})`);
    });
    
    console.log(`\nℹ️  Info: ${this.results.info.length}`);
    
    // Summary
    const totalIssues = this.results.errors.length + this.results.warnings.length;
    const healthScore = Math.max(0, 100 - (totalIssues * 2));
    
    console.log('\n' + '='.repeat(60));
    console.log(`🏥 Health Score: ${healthScore}/100`);
    console.log(`📦 Platform: ${this.results.platform.name}`);
    console.log(`⏰ Timestamp: ${this.results.timestamp}`);
    console.log('='.repeat(60));
    
    // Export results
    const reportPath = path.join(this.rootDir, '.diagnostic-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
    console.log(`\n💾 Full report saved to: ${reportPath}`);
  }
}

// ============================================================================
// PLATFORM DETECTION (Universal)
// ============================================================================

function detectPlatform() {
  // GitHub Actions
  if (process.env.GITHUB_ACTIONS === 'true') {
    return { name: 'GitHub Actions', type: 'ci', id: 'github' };
  }
  
  // Replit
  if (process.env.REPL_ID || process.env.REPL_SLUG) {
    return { name: 'Replit', type: 'cloud', id: 'replit' };
  }
  
  // Vercel
  if (process.env.VERCEL === '1') {
    return { name: 'Vercel', type: 'deployment', id: 'vercel' };
  }
  
  // Netlify
  if (process.env.NETLIFY === 'true') {
    return { name: 'Netlify', type: 'deployment', id: 'netlify' };
  }
  
  // Bolt
  if (process.env.BOLT_ENV) {
    return { name: 'Bolt', type: 'platform', id: 'bolt' };
  }
  
  // Local development
  return { name: 'Local Development', type: 'local', id: 'local' };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function resolvePath(filePath) {
  if (filePath.startsWith('.')) {
    const basePath = path.resolve(process.cwd(), filePath);
    // Try common extensions
    const extensions = ['', '.ts', '.tsx', '.js', '.jsx', '.json'];
    for (const ext of extensions) {
      const fullPath = basePath + ext;
      if (fs.existsSync(fullPath)) {
        return fullPath;
      }
    }
    return basePath; // Return base if none found (will trigger error)
  }
  return filePath;
}

function readPackageJson() {
  try {
    const pkgPath = path.join(process.cwd(), 'package.json');
    return JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  } catch {
    return null;
  }
}

function readEnvFile() {
  try {
    const envPath = path.join(process.cwd(), '.env');
    return fs.readFileSync(envPath, 'utf8');
  } catch {
    return null;
  }
}

// ============================================================================
// EXECUTION
// ============================================================================

if (require.main === module) {
  const diagnostic = new UniversalDiagnostic();
  diagnostic.run().catch(console.error);
}

module.exports = { UniversalDiagnostic, DIAGNOSTIC_PATTERNS, GUARDIANS };

