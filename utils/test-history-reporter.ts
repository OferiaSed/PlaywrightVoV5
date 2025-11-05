import { FullConfig, FullResult, Reporter, Suite, TestCase, TestResult } from '@playwright/test/reporter';
import * as fs from 'fs';
import * as path from 'path';

interface TestHistoryEntry {
  timestamp: string;
  runId: string;
  status: 'passed' | 'failed' | 'skipped' | 'timedOut';
  duration: number;
  title: string;
  file: string;
  project?: string;
  error?: string;
}

interface RunSummary {
  runId: string;
  timestamp: string;
  startTime: string;
  endTime?: string;
  duration: number;
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  timedOut: number;
  status: 'passed' | 'failed';
  environment?: string;
  project?: string;
}

export class TestHistoryReporter implements Reporter {
  private runId: string;
  private startTime: Date;
  private testResults: TestHistoryEntry[] = [];
  private historyDir: string;
  private runDir: string;
  private summary: RunSummary;

  constructor(options: { outputDir?: string } = {}) {
    this.runId = `run-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    this.startTime = new Date();
    this.historyDir = path.resolve(process.cwd(), options.outputDir || 'test-history');
    this.runDir = path.join(this.historyDir, this.runId);
    
    this.summary = {
      runId: this.runId,
      timestamp: this.startTime.toISOString(),
      startTime: this.startTime.toISOString(),
      duration: 0,
      total: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
      timedOut: 0,
      status: 'passed',
      environment: process.env.ENVIRONMENT || 'qa1',
      project: process.env.PROJECT || 'QA',
    };

    // Create history directory structure
    this.ensureDirectoryExists(this.historyDir);
    this.ensureDirectoryExists(this.runDir);
  }

  private ensureDirectoryExists(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  onBegin(config: FullConfig, suite: Suite): void {
    console.log(`\n[Test History] Starting test run: ${this.runId}`);
    console.log(`[Test History] Results will be stored in: ${this.runDir}`);
    
    // Save initial summary
    this.saveSummary();
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    const entry: TestHistoryEntry = {
      timestamp: new Date().toISOString(),
      runId: this.runId,
      status: result.status,
      duration: result.duration,
      title: test.title,
      file: test.location.file,
      project: test.parent.project()?.name,
    };

    if (result.error) {
      entry.error = result.error.message;
    }

    this.testResults.push(entry);

    // Update summary
    this.summary.total++;
    switch (result.status) {
      case 'passed':
        this.summary.passed++;
        break;
      case 'failed':
        this.summary.failed++;
        this.summary.status = 'failed';
        break;
      case 'skipped':
        this.summary.skipped++;
        break;
      case 'timedOut':
        this.summary.timedOut++;
        this.summary.status = 'failed';
        break;
    }
  }

  onEnd(result: FullResult): void {
    const endTime = new Date();
    this.summary.endTime = endTime.toISOString();
    this.summary.duration = endTime.getTime() - this.startTime.getTime();

    // Save detailed test results
    this.saveTestResults();
    
    // Save final summary
    this.saveSummary();

    // Save run index for easy access to latest runs
    this.updateRunIndex();

    // Copy HTML report if it exists
    this.copyHtmlReport();

    console.log(`\n[Test History] Test run completed: ${this.runId}`);
    console.log(`[Test History] Summary: ${this.summary.passed} passed, ${this.summary.failed} failed, ${this.summary.skipped} skipped`);
    console.log(`[Test History] Results saved to: ${this.runDir}`);
  }

  private saveTestResults(): void {
    const resultsFile = path.join(this.runDir, 'test-results.json');
    fs.writeFileSync(resultsFile, JSON.stringify(this.testResults, null, 2), 'utf-8');
  }

  private saveSummary(): void {
    const summaryFile = path.join(this.runDir, 'summary.json');
    fs.writeFileSync(summaryFile, JSON.stringify(this.summary, null, 2), 'utf-8');
  }

  private updateRunIndex(): void {
    const indexFile = path.join(this.historyDir, 'runs-index.json');
    let runs: RunSummary[] = [];

    if (fs.existsSync(indexFile)) {
      try {
        const data = fs.readFileSync(indexFile, 'utf-8');
        runs = JSON.parse(data);
      } catch (error) {
        console.warn('[Test History] Could not read existing runs index, creating new one');
      }
    }

    // Add current run at the beginning
    runs.unshift(this.summary);

    // Keep only last 100 runs in index
    if (runs.length > 100) {
      runs = runs.slice(0, 100);
    }

    fs.writeFileSync(indexFile, JSON.stringify(runs, null, 2), 'utf-8');
  }

  private copyHtmlReport(): void {
    const playwrightReportDir = path.resolve(process.cwd(), 'playwright-report');
    if (fs.existsSync(playwrightReportDir)) {
      const reportDest = path.join(this.runDir, 'html-report');
      this.copyDirectory(playwrightReportDir, reportDest);
    }
  }

  private copyDirectory(src: string, dest: string): void {
    if (!fs.existsSync(src)) return;

    this.ensureDirectoryExists(dest);
    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        this.copyDirectory(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
}

// Default export for Playwright reporter loading
export default TestHistoryReporter;

