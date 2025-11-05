import * as fs from 'fs';
import * as path from 'path';

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

export class TestHistoryViewer {
  private historyDir: string;

  constructor(historyDir: string = 'test-history') {
    this.historyDir = path.resolve(process.cwd(), historyDir);
  }

  /**
   * Get all test runs from history
   */
  getAllRuns(): RunSummary[] {
    const indexFile = path.join(this.historyDir, 'runs-index.json');
    if (!fs.existsSync(indexFile)) {
      return [];
    }

    try {
      const data = fs.readFileSync(indexFile, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading runs index:', error);
      return [];
    }
  }

  /**
   * Get a specific test run by runId
   */
  getRun(runId: string): RunSummary | null {
    const runs = this.getAllRuns();
    return runs.find(run => run.runId === runId) || null;
  }

  /**
   * Get test results for a specific run
   */
  getRunResults(runId: string): TestHistoryEntry[] {
    const runDir = path.join(this.historyDir, runId);
    const resultsFile = path.join(runDir, 'test-results.json');
    
    if (!fs.existsSync(resultsFile)) {
      return [];
    }

    try {
      const data = fs.readFileSync(resultsFile, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error reading results for run ${runId}:`, error);
      return [];
    }
  }

  /**
   * Get the latest test run
   */
  getLatestRun(): RunSummary | null {
    const runs = this.getAllRuns();
    return runs.length > 0 ? runs[0] : null;
  }

  /**
   * Get test runs filtered by status
   */
  getRunsByStatus(status: 'passed' | 'failed'): RunSummary[] {
    const runs = this.getAllRuns();
    return runs.filter(run => run.status === status);
  }

  /**
   * Get test runs for a specific date
   */
  getRunsByDate(date: Date): RunSummary[] {
    const runs = this.getAllRuns();
    const targetDate = date.toISOString().split('T')[0];
    
    return runs.filter(run => {
      const runDate = new Date(run.startTime).toISOString().split('T')[0];
      return runDate === targetDate;
    });
  }

  /**
   * Get statistics across all runs
   */
  getStatistics(): {
    totalRuns: number;
    totalTests: number;
    totalPassed: number;
    totalFailed: number;
    totalSkipped: number;
    averageDuration: number;
    successRate: number;
  } {
    const runs = this.getAllRuns();
    
    if (runs.length === 0) {
      return {
        totalRuns: 0,
        totalTests: 0,
        totalPassed: 0,
        totalFailed: 0,
        totalSkipped: 0,
        averageDuration: 0,
        successRate: 0,
      };
    }

    const totalTests = runs.reduce((sum, run) => sum + run.total, 0);
    const totalPassed = runs.reduce((sum, run) => sum + run.passed, 0);
    const totalFailed = runs.reduce((sum, run) => sum + run.failed, 0);
    const totalSkipped = runs.reduce((sum, run) => sum + run.skipped, 0);
    const totalDuration = runs.reduce((sum, run) => sum + run.duration, 0);
    const successfulRuns = runs.filter(run => run.status === 'passed').length;

    return {
      totalRuns: runs.length,
      totalTests,
      totalPassed,
      totalFailed,
      totalSkipped,
      averageDuration: totalDuration / runs.length,
      successRate: (successfulRuns / runs.length) * 100,
    };
  }

  /**
   * Print a formatted summary of test history
   */
  printSummary(limit: number = 10): void {
    const runs = this.getAllRuns().slice(0, limit);
    const stats = this.getStatistics();

    console.log('\n=== Test History Summary ===');
    console.log(`Total Runs: ${stats.totalRuns}`);
    console.log(`Success Rate: ${stats.successRate.toFixed(2)}%`);
    console.log(`Average Duration: ${(stats.averageDuration / 1000).toFixed(2)}s`);
    console.log(`\nRecent Runs (last ${limit}):`);
    console.log('─'.repeat(100));
    
    runs.forEach(run => {
      const date = new Date(run.startTime).toLocaleString();
      const duration = (run.duration / 1000).toFixed(2);
      const statusIcon = run.status === 'passed' ? '✓' : '✗';
      console.log(
        `${statusIcon} ${run.runId.substring(0, 20)}... | ${date} | ` +
        `Passed: ${run.passed}, Failed: ${run.failed}, Skipped: ${run.skipped} | ` +
        `Duration: ${duration}s`
      );
    });
    console.log('─'.repeat(100));
  }
}

