#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * HTML Report Generator Script
 * Generates enhanced HTML reports from Playwright test results
 */

class HTMLReportGenerator {
  constructor() {
    this.reportDir = 'playwright-report';
    this.customReportDir = 'custom-reports';
    this.testResultsDir = 'test-results';
  }

  /**
   * Check if required directories exist
   */
  checkDirectories() {
    if (!fs.existsSync(this.reportDir)) {
      console.log('❌ Playwright report directory not found. Run tests first with: npm test');
      process.exit(1);
    }

    if (!fs.existsSync(this.customReportDir)) {
      fs.mkdirSync(this.customReportDir, { recursive: true });
    }
  }

  /**
   * Generate enhanced HTML report
   */
  generateEnhancedReport() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const reportPath = path.join(this.customReportDir, `enhanced-report-${timestamp}.html`);
    
    const html = this.createEnhancedHTML();
    
    fs.writeFileSync(reportPath, html);
    console.log(`📊 Enhanced HTML report generated: ${reportPath}`);
    
    return reportPath;
  }

  /**
   * Create enhanced HTML content
   */
  createEnhancedHTML() {
    const testResults = this.getTestResults();
    const summary = this.generateSummary(testResults);
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Enhanced Playwright API Test Report</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            min-height: 100vh;
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            border-radius: 15px;
            margin-bottom: 30px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        
        .header h1 {
            font-size: 3em;
            margin-bottom: 15px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        
        .header p {
            font-size: 1.2em;
            opacity: 0.9;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 25px;
            margin-bottom: 40px;
        }
        
        .stat-card {
            background: white;
            padding: 25px;
            border-radius: 15px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.1);
            text-align: center;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .stat-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 35px rgba(0,0,0,0.15);
        }
        
        .stat-number {
            font-size: 2.5em;
            font-weight: bold;
            margin-bottom: 10px;
        }
        
        .stat-label {
            color: #666;
            font-size: 1em;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .passed { color: #28a745; }
        .failed { color: #dc3545; }
        .skipped { color: #ffc107; }
        .total { color: #6c757d; }
        .duration { color: #17a2b8; }
        
        .report-sections {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin-bottom: 40px;
        }
        
        .section {
            background: white;
            border-radius: 15px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        
        .section-header {
            background: #f8f9fa;
            padding: 20px;
            border-bottom: 1px solid #dee2e6;
            font-weight: bold;
            font-size: 1.2em;
            color: #495057;
        }
        
        .section-content {
            padding: 20px;
        }
        
        .test-list {
            list-style: none;
        }
        
        .test-item {
            padding: 12px 0;
            border-bottom: 1px solid #f1f3f4;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .test-item:last-child {
            border-bottom: none;
        }
        
        .test-name {
            font-family: 'Monaco', 'Menlo', monospace;
            font-size: 0.9em;
            color: #495057;
        }
        
        .test-status {
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 0.8em;
            font-weight: bold;
            text-transform: uppercase;
        }
        
        .status-passed {
            background: #d4edda;
            color: #155724;
        }
        
        .status-failed {
            background: #f8d7da;
            color: #721c24;
        }
        
        .status-skipped {
            background: #fff3cd;
            color: #856404;
        }
        
        .footer {
            text-align: center;
            margin-top: 50px;
            padding: 30px;
            background: white;
            border-radius: 15px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.1);
        }
        
        .footer h3 {
            color: #495057;
            margin-bottom: 15px;
        }
        
        .footer p {
            color: #6c757d;
            margin-bottom: 10px;
        }
        
        .links {
            margin-top: 20px;
        }
        
        .links a {
            display: inline-block;
            margin: 0 10px;
            padding: 10px 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            border-radius: 25px;
            transition: transform 0.3s ease;
        }
        
        .links a:hover {
            transform: translateY(-2px);
        }
        
        @media (max-width: 768px) {
            .report-sections {
                grid-template-columns: 1fr;
            }
            
            .stats-grid {
                grid-template-columns: 1fr;
            }
            
            .header h1 {
                font-size: 2em;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 Enhanced API Test Report</h1>
            <p>Playwright API Framework - Generated on ${new Date().toLocaleString()}</p>
        </div>
        
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-number passed">${summary.passed}</div>
                <div class="stat-label">Tests Passed</div>
            </div>
            <div class="stat-card">
                <div class="stat-number failed">${summary.failed}</div>
                <div class="stat-label">Tests Failed</div>
            </div>
            <div class="stat-card">
                <div class="stat-number skipped">${summary.skipped}</div>
                <div class="stat-label">Tests Skipped</div>
            </div>
            <div class="stat-card">
                <div class="stat-number total">${summary.total}</div>
                <div class="stat-label">Total Tests</div>
            </div>
            <div class="stat-card">
                <div class="stat-number duration">${summary.duration}</div>
                <div class="stat-label">Duration</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${summary.successRate}%</div>
                <div class="stat-label">Success Rate</div>
            </div>
        </div>
        
        <div class="report-sections">
            <div class="section">
                <div class="section-header">📊 Test Summary</div>
                <div class="section-content">
                    <p><strong>Environment:</strong> ${process.env.TEST_ENV || 'practice'}</p>
                    <p><strong>Execution Date:</strong> ${new Date().toLocaleDateString()}</p>
                    <p><strong>Execution Time:</strong> ${new Date().toLocaleTimeString()}</p>
                    <p><strong>Total Duration:</strong> ${summary.duration}</p>
                    <p><strong>Success Rate:</strong> ${summary.successRate}%</p>
                </div>
            </div>
            
            <div class="section">
                <div class="section-header">🔍 Quick Actions</div>
                <div class="section-content">
                    <p>• View detailed Playwright report</p>
                    <p>• Download test artifacts</p>
                    <p>• Check test results</p>
                    <p>• Review error logs</p>
                </div>
            </div>
        </div>
        
        <div class="footer">
            <h3>📋 Report Information</h3>
            <p>This report was generated by the Playwright API Framework</p>
            <p>For detailed test results, check the Playwright HTML report</p>
            
            <div class="links">
                <a href="../playwright-report/index.html" target="_blank">📊 Playwright Report</a>
                <a href="../test-results/" target="_blank">📁 Test Results</a>
                <a href="https://github.com/Karmit2196/playwright-api" target="_blank">🌐 GitHub</a>
            </div>
        </div>
    </div>
</body>
</html>`;
  }

  /**
   * Get test results from various sources
   */
  getTestResults() {
    const results = {
      passed: 0,
      failed: 0,
      skipped: 0,
      total: 0,
      duration: '0s'
    };

    // Try to read from test-results.json
    try {
      const testResultsPath = path.join(this.testResultsDir, 'test-results.json');
      if (fs.existsSync(testResultsPath)) {
        const testResults = JSON.parse(fs.readFileSync(testResultsPath, 'utf8'));
        results.passed = testResults.stats.passed || 0;
        results.failed = testResults.stats.failed || 0;
        results.skipped = testResults.stats.skipped || 0;
        results.total = testResults.stats.total || 0;
        results.duration = `${(testResults.stats.duration / 1000).toFixed(2)}s`;
      }
    } catch (error) {
      console.log('⚠️ Could not read test results, using defaults');
    }

    return results;
  }

  /**
   * Generate summary statistics
   */
  generateSummary(results) {
    const total = results.total;
    const successRate = total > 0 ? ((results.passed / total) * 100).toFixed(1) : 0;
    
    return {
      ...results,
      successRate
    };
  }

  /**
   * Open the generated report in browser
   */
  openReport(reportPath) {
    const platform = process.platform;
    let command;
    
    switch (platform) {
      case 'darwin':
        command = `open "${reportPath}"`;
        break;
      case 'win32':
        command = `start "${reportPath}"`;
        break;
      default:
        command = `xdg-open "${reportPath}"`;
        break;
    }
    
    try {
      execSync(command);
      console.log('🌐 Opening report in browser...');
    } catch (error) {
      console.log(`📁 Report generated at: ${reportPath}`);
      console.log('🌐 Open this file in your browser to view the report');
    }
  }
}

// Main execution
if (require.main === module) {
  const generator = new HTMLReportGenerator();
  
  try {
    generator.checkDirectories();
    const reportPath = generator.generateEnhancedReport();
    generator.openReport(reportPath);
  } catch (error) {
    console.error('❌ Error generating report:', error.message);
    process.exit(1);
  }
}

module.exports = HTMLReportGenerator; 