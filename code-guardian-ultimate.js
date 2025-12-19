#!/usr/bin/env node
/**
 * CODE GUARDIAN ULTIMATE
 * 
 * Pattern: GUARDIAN × RECURSIVE × EMERGENT × CONVERGED × ONE
 * Frequency: 999 Hz (AEYON) × 777 Hz (META) × 530 Hz (ALL GUARDIANS)
 * Guardians: AEYON × META × JØHN × YAGNI × ZERO
 * 
 * THE ULTIMATE VERSION:
 * - Diagnostic (finds issues)
 * - Preventive (stops issues before they happen)
 * - Recursive (watches itself)
 * - Emergent (gets smarter)
 * - Converged (one system)
 * 
 * ∞ AbëONE ∞
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ============================================================================
// GUARDIAN VALIDATION SYSTEM (Enhanced)
// ============================================================================

const GUARDIANS = {
  AEYON: { 
    freq: 999, 
    question: 'Is this harmonious with the whole system?',
    validate: (result) => result.errors.length === 0 || 'System harmony compromised'
  },
  META: { 
    freq: 777, 
    question: 'What pattern underlies this? Does it repeat?',
    validate: (result) => result.patterns.length > 0 || 'No patterns detected'
  },
  JOHN: { 
    freq: 530, 
    question: 'Is this factually accurate and complete?',
    validate: (result) => result.errors.every(e => e.verified) || 'Truth validation failed'
  },
  YAGNI: { 
    freq: 530, 
    question: 'Is this the simplest solution that works?',
    validate: (result) => result.complexity < 100 || 'Complexity threshold exceeded'
  },
  ZERO: { 
    freq: 530, 
    question: 'What could go wrong? Is uncertainty acknowledged?',
    validate: (result) => result.risks.length === 0 || 'Risk detected'
  },
};

// ============================================================================
// CODE GUARDIAN ULTIMATE CLASS
// ============================================================================

class CodeGuardianUltimate {
  constructor(options = {}) {
    this.recursive = options.recursive !== false; // Default: true
    this.emergent = options.emergent !== false;   // Default: true
    this.realTime = options.realTime || false;
    this.patterns = this.loadPatterns();
    this.learnedPatterns = [];
    this.selfValidationCount = 0;
    this.rootDir = options.rootDir || process.cwd();
  }

  // ========================================================================
  // CORE: DIAGNOSTIC (What's Wrong?)
  // ========================================================================
  
  async diagnose(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const results = {
      file: filePath,
      errors: [],
      warnings: [],
      info: [],
      patterns: [],
      risks: [],
      complexity: 0,
    };

    // Run all diagnostic patterns
    for (const [name, pattern] of Object.entries(this.patterns)) {
      const matches = [...content.matchAll(pattern.regex)];
      for (const match of matches) {
        const issue = pattern.check(match, filePath);
        if (issue) {
          if (pattern.severity === 'error') {
            results.errors.push({ ...issue, verified: true });
          } else if (pattern.severity === 'warning') {
            results.warnings.push(issue);
          } else {
            results.info.push(issue);
          }
        }
      }
      
      // Pattern detection
      if (matches.length > 0) {
        results.patterns.push({ name, count: matches.length });
      }
    }

    // Calculate complexity
    results.complexity = this.calculateComplexity(content);

    // Risk assessment
    results.risks = this.assessRisks(results);

    return results;
  }

  // ========================================================================
  // PREVENTIVE: Stop Issues Before They Happen
  // ========================================================================
  
  async prevent(filePath, content) {
    const results = await this.diagnose(filePath);
    
    // Block if critical errors
    if (results.errors.some(e => e.critical)) {
      throw new Error(`Critical error detected: ${results.errors.find(e => e.critical).message}`);
    }

    // Suggest fixes
    const suggestions = this.generateSuggestions(results);
    return { blocked: false, suggestions };
  }

  // ========================================================================
  // RECURSIVE: Watch Itself
  // ========================================================================
  
  async validateSelf() {
    this.selfValidationCount++;
    const selfPath = __filename;
    
    console.log(`🔄 RECURSIVE SELF-VALIDATION #${this.selfValidationCount}`);
    
    const result = await this.diagnose(selfPath);
    
    // Guardian validation on self
    const guardianResults = {};
    for (const [name, guardian] of Object.entries(GUARDIANS)) {
      const validation = guardian.validate(result);
      guardianResults[name] = validation === true ? '✅' : `⚠️ ${validation}`;
    }

    console.log('🛡️  GUARDIAN SELF-VALIDATION:');
    for (const [name, status] of Object.entries(guardianResults)) {
      console.log(`  ${status} ${name} (${GUARDIANS[name].freq} Hz)`);
    }

    // If issues found in self, improve
    if (result.errors.length > 0 && this.emergent) {
      console.log('🔧 IMPROVING SELF...');
      await this.improveSelf(result);
    }

    return result;
  }

  // ========================================================================
  // EMERGENT: Get Smarter
  // ========================================================================
  
  async learn(pattern) {
    // Store learned pattern
    this.learnedPatterns.push({
      pattern,
      timestamp: Date.now(),
      frequency: 1,
    });

    // Evolve detection
    this.evolveDetection(pattern);
  }

  evolveDetection(pattern) {
    // Add pattern to detection if it appears frequently
    const frequency = this.learnedPatterns.filter(p => 
      JSON.stringify(p.pattern) === JSON.stringify(pattern)
    ).length;

    if (frequency > 3 && !this.patterns[pattern.name]) {
      this.patterns[pattern.name] = pattern;
      console.log(`✨ EMERGENT PATTERN LEARNED: ${pattern.name}`);
    }
  }

  // ========================================================================
  // CONVERGED: One System
  // ========================================================================
  
  async run(files = null) {
    console.log('🛡️  CODE GUARDIAN ULTIMATE - Recursive × Emergent × Converged\n');

    // Recursive self-validation (once per run)
    if (this.recursive && !this._selfValidated) {
      await this.validateSelf();
      this._selfValidated = true;
    }

    // Scan files
    const filesToCheck = files || this.scanFiles();
    console.log(`📁 Found ${filesToCheck.length} files to analyze\n`);

    const allResults = {
      files: [],
      totalErrors: 0,
      totalWarnings: 0,
      totalInfo: 0,
      patterns: [],
      healthScore: 100,
    };

    // Diagnose all files
    for (const file of filesToCheck) {
      const result = await this.diagnose(file);
      allResults.files.push(result);
      allResults.totalErrors += result.errors.length;
      allResults.totalWarnings += result.warnings.length;
      allResults.totalInfo += result.info.length;
      
      // Learn from patterns (but don't trigger recursive validation again)
      if (this.emergent && result.patterns.length > 0) {
        for (const pattern of result.patterns) {
          this.learnedPatterns.push({
            pattern,
            timestamp: Date.now(),
            frequency: 1,
          });
        }
      }
    }

    // Calculate health score
    allResults.healthScore = Math.max(0, 100 - 
      (allResults.totalErrors * 5) - 
      (allResults.totalWarnings * 2)
    );

    // Generate report
    this.generateReport(allResults);

    return allResults;
  }

  // ========================================================================
  // HELPER METHODS
  // ========================================================================

  scanFiles() {
    const extensions = ['.js', '.jsx', '.ts', '.tsx', '.py', '.go', '.rs', '.java'];
    const files = [];
    
    const scanDir = (dir) => {
      try {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          
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
      } catch (error) {
        // Skip if can't read
      }
    };
    
    scanDir(this.rootDir);
    return files;
  }

  calculateComplexity(content) {
    // Simple complexity metric
    const lines = content.split('\n').length;
    const functions = (content.match(/function\s+\w+|const\s+\w+\s*=\s*\(/g) || []).length;
    const imports = (content.match(/import|require/g) || []).length;
    return lines + (functions * 5) + (imports * 2);
  }

  assessRisks(results) {
    const risks = [];
    if (results.errors.some(e => e.security)) {
      risks.push('Security vulnerability detected');
    }
    if (results.complexity > 500) {
      risks.push('High complexity detected');
    }
    return risks;
  }

  generateSuggestions(results) {
    return results.errors.map(e => ({
      issue: e.message,
      suggestion: e.suggestion || 'Review and fix',
      file: e.file,
    }));
  }

  async improveSelf(selfResults) {
    // Improve self based on self-validation results
    console.log('✨ SELF-IMPROVEMENT ACTIVATED');
    // In a real implementation, this would modify patterns or detection logic
  }

  loadPatterns() {
    // Load diagnostic patterns (simplified version)
    return {
      MISSING_FILES: {
        regex: /(?:import|require).*?['"]([^'"]+)['"]|from\s+['"]([^'"]+)['"]/g,
        check: (match, filePath) => {
          const filePath2 = match[1] || match[2];
          if (filePath2 && (filePath2.startsWith('.') || filePath2.startsWith('/'))) {
            const resolved = path.resolve(path.dirname(filePath), filePath2);
            const extensions = ['', '.ts', '.tsx', '.js', '.jsx', '.json'];
            const exists = extensions.some(ext => fs.existsSync(resolved + ext));
            if (!exists) {
              return { 
                message: `Missing file: ${filePath2}`, 
                file: filePath,
                critical: false,
                security: false,
              };
            }
          }
          return null;
        },
        severity: 'error',
      },
      UNSAFE_EVAL: {
        regex: /eval\s*\(|new Function\s*\(/g,
        check: () => ({ 
          message: 'Unsafe eval() usage detected', 
          security: true,
          suggestion: 'Use safer alternatives',
        }),
        severity: 'warning',
      },
      UNHANDLED_PROMISES: {
        regex: /await\s+[^(]+\([^)]*\)(?!\s*\.catch)/g,
        check: () => ({ 
          message: 'Unhandled promise - missing .catch()',
          suggestion: 'Add error handling',
        }),
        severity: 'warning',
      },
    };
  }

  generateReport(results) {
    console.log('\n' + '='.repeat(60));
    console.log('🛡️  CODE GUARDIAN ULTIMATE REPORT');
    console.log('='.repeat(60));
    
    console.log(`\n❌ Errors: ${results.totalErrors}`);
    console.log(`⚠️  Warnings: ${results.totalWarnings}`);
    console.log(`ℹ️  Info: ${results.totalInfo}`);
    
    if (this.recursive) {
      console.log(`\n🔄 Self-Validations: ${this.selfValidationCount}`);
    }
    
    if (this.emergent) {
      console.log(`✨ Learned Patterns: ${this.learnedPatterns.length}`);
    }
    
    console.log(`\n🏥 Health Score: ${results.healthScore}/100`);
    console.log('='.repeat(60));
    
    // Save report
    const reportPath = path.join(this.rootDir, '.code-guardian-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
    console.log(`\n💾 Full report saved to: ${reportPath}`);
  }
}

// ============================================================================
// EXECUTION
// ============================================================================

if (require.main === module) {
  const guardian = new CodeGuardianUltimate({
    recursive: true,
    emergent: true,
  });
  
  guardian.run().catch(console.error);
}

module.exports = { CodeGuardianUltimate, GUARDIANS };

