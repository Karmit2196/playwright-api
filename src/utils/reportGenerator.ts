import fs from 'fs';
import path from 'path';

export interface TestResult {
  name: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  error?: string;
  timestamp: string;
  environment: string;
}

export interface TestSuite {
  name: string;
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  duration: number;
  results: TestResult[];
}

export class ReportGenerator {
  private results: TestSuite[] = [];
  private startTime: Date = new Date();

  /**
   * Add test result to the report
   */
  addTestResult(suiteName: string, testName: string, status: 'passed' | 'failed' | 'skipped', duration: number, error?: string) {
    let suite = this.results.find(s => s.name === suiteName);
    
    if (!suite) {
      suite = {
        name: suiteName,
        total: 0,
        passed: 0,
        failed: 0,
        skipped: 0,
        duration: 0,
        results: []
      };
      this.results.push(suite);
    }

    const result: TestResult = {
      name: testName,
      status,
      duration,
      error,
      timestamp: new Date().toISOString(),
      environment: process.env.TEST_ENV || 'practice'
    };

    suite.results.push(result);
    suite.total++;
    suite.duration += duration;

    switch (status) {
      case 'passed':
        suite.passed++;
        break;
      case 'failed':
        suite.failed++;
        break;
      case 'skipped':
        suite.skipped++;
        break;
    }
  }

  /**
   * Generate HTML report
   */
  generateHTMLReport(): string {
    const totalTests = this.results.reduce((sum, suite) => sum + suite.total, 0);
    const totalPassed = this.results.reduce((sum, suite) => sum + suite.passed, 0);
    const totalFailed = this.results.reduce((sum, suite) => sum + suite.failed, 0);
    const totalSkipped = this.results.reduce((sum, suite) => sum + suite.skipped, 0);
    const totalDuration = this.results.reduce((sum, suite) => sum + suite.duration, 0);

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Playwright API Test Report</title>
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
            background: #f5f5f5;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 10px;
            margin-bottom: 30px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .stat-card {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            text-align: center;
        }
        
        .stat-number {
            font-size: 2em;
            font-weight: bold;
            margin-bottom: 5px;
        }
        
        .stat-label {
            color: #666;
            font-size: 0.9em;
        }
        
        .passed { color: #28a745; }
        .failed { color: #dc3545; }
        .skipped { color: #ffc107; }
        
        .suite {
            background: white;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            margin-bottom: 20px;
            overflow: hidden;
        }
        
        .suite-header {
            background: #f8f9fa;
            padding: 15px 20px;
            border-bottom: 1px solid #dee2e6;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .suite-name {
            font-weight: bold;
            font-size: 1.1em;
        }
        
        .suite-stats {
            display: flex;
            gap: 15px;
        }
        
        .test-result {
            padding: 15px 20px;
            border-bottom: 1px solid #f1f3f4;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .test-result:last-child {
            border-bottom: none;
        }
        
        .test-name {
            font-family: 'Monaco', 'Menlo', monospace;
            font-size: 0.9em;
        }
        
        .test-status {
            padding: 4px 8px;
            border-radius: 4px;
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
        
        .test-duration {
            color: #666;
            font-size: 0.9em;
        }
        
        .error-details {
            background: #f8f9fa;
            padding: 15px;
            margin: 10px 0;
            border-left: 4px solid #dc3545;
            font-family: 'Monaco', 'Menlo', monospace;
            font-size: 0.9em;
            white-space: pre-wrap;
        }
        
        .footer {
            text-align: center;
            margin-top: 40px;
            color: #666;
            font-size: 0.9em;
        }
        
        @media (max-width: 768px) {
            .stats {
                grid-template-columns: 1fr;
            }
            
            .suite-header, .test-result {
                flex-direction: column;
                gap: 10px;
                text-align: center;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 Playwright API Test Report</h1>
            <p>Generated on ${new Date().toLocaleString()}</p>
        </div>
        
        <div class="stats">
            <div class="stat-card">
                <div class="stat-number passed">${totalPassed}</div>
                <div class="stat-label">Passed</div>
            </div>
            <div class="stat-card">
                <div class="stat-number failed">${totalFailed}</div>
                <div class="stat-label">Failed</div>
            </div>
            <div class="stat-card">
                <div class="stat-number skipped">${totalSkipped}</div>
                <div class="stat-label">Skipped</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${totalTests}</div>
                <div class="stat-label">Total Tests</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${(totalDuration / 1000).toFixed(2)}s</div>
                <div class="stat-label">Total Duration</div>
            </div>
        </div>
        
        ${this.results.map(suite => `
            <div class="suite">
                <div class="suite-header">
                    <div class="suite-name">${suite.name}</div>
                    <div class="suite-stats">
                        <span class="passed">✅ ${suite.passed}</span>
                        <span class="failed">❌ ${suite.failed}</span>
                        <span class="skipped">⏭️ ${suite.skipped}</span>
                        <span>⏱️ ${(suite.duration / 1000).toFixed(2)}s</span>
                    </div>
                </div>
                ${suite.results.map(result => `
                    <div class="test-result">
                        <div class="test-name">${result.name}</div>
                        <div class="test-status status-${result.status}">${result.status}</div>
                        <div class="test-duration">${(result.duration / 1000).toFixed(2)}s</div>
                    </div>
                    ${result.error ? `<div class="error-details">${result.error}</div>` : ''}
                `).join('')}
            </div>
        `).join('')}
        
        <div class="footer">
            <p>Report generated by Playwright API Framework</p>
            <p>Environment: ${process.env.TEST_ENV || 'practice'}</p>
        </div>
    </div>
</body>
</html>`;

    return html;
  }

  /**
   * Save HTML report to file
   */
  saveHTMLReport(outputPath: string = 'custom-report.html'): void {
    const html = this.generateHTMLReport();
    const dir = path.dirname(outputPath);
    
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, html);
    console.log(`📊 Custom HTML report saved to: ${outputPath}`);
  }

  /**
   * Generate summary report
   */
  generateSummary(): string {
    const totalTests = this.results.reduce((sum, suite) => sum + suite.total, 0);
    const totalPassed = this.results.reduce((sum, suite) => sum + suite.passed, 0);
    const totalFailed = this.results.reduce((sum, suite) => sum + suite.failed, 0);
    const totalSkipped = this.results.reduce((sum, suite) => sum + suite.skipped, 0);
    const totalDuration = this.results.reduce((sum, suite) => sum + suite.duration, 0);

    return `
🧪 Test Execution Summary
==========================
📅 Date: ${new Date().toLocaleString()}
🌍 Environment: ${process.env.TEST_ENV || 'practice'}
⏱️ Duration: ${(totalDuration / 1000).toFixed(2)}s

📊 Results:
✅ Passed: ${totalPassed}
❌ Failed: ${totalFailed}
⏭️ Skipped: ${totalSkipped}
📝 Total: ${totalTests}

📈 Success Rate: ${totalTests > 0 ? ((totalPassed / totalTests) * 100).toFixed(1) : 0}%
    `;
  }
} 