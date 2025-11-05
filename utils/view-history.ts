#!/usr/bin/env node
import { TestHistoryViewer } from './test-history-viewer';

const viewer = new TestHistoryViewer();
const args = process.argv.slice(2);

if (args.length === 0) {
  // Default: show summary
  viewer.printSummary(10);
} else {
  const command = args[0];
  
  switch (command) {
    case 'summary':
      const limit = args[1] ? parseInt(args[1], 10) : 10;
      viewer.printSummary(limit);
      break;
      
    case 'latest':
      const latest = viewer.getLatestRun();
      if (latest) {
        console.log('\n=== Latest Test Run ===');
        console.log(JSON.stringify(latest, null, 2));
        console.log('\n=== Test Results ===');
        const results = viewer.getRunResults(latest.runId);
        console.log(`Total tests: ${results.length}`);
        results.forEach((result, index) => {
          const statusIcon = result.status === 'passed' ? '✓' : result.status === 'failed' ? '✗' : '○';
          console.log(`${index + 1}. ${statusIcon} ${result.title} (${result.status}) - ${(result.duration / 1000).toFixed(2)}s`);
          if (result.error) {
            console.log(`   Error: ${result.error}`);
          }
        });
      } else {
        console.log('No test runs found.');
      }
      break;
      
    case 'stats':
      const stats = viewer.getStatistics();
      console.log('\n=== Test History Statistics ===');
      console.log(JSON.stringify(stats, null, 2));
      break;
      
    case 'run':
      if (args[1]) {
        const run = viewer.getRun(args[1]);
        if (run) {
          console.log('\n=== Test Run Details ===');
          console.log(JSON.stringify(run, null, 2));
          const results = viewer.getRunResults(args[1]);
          console.log(`\n=== Test Results (${results.length} tests) ===`);
          results.forEach((result, index) => {
            const statusIcon = result.status === 'passed' ? '✓' : result.status === 'failed' ? '✗' : '○';
            console.log(`${index + 1}. ${statusIcon} ${result.title}`);
            console.log(`   File: ${result.file}`);
            console.log(`   Status: ${result.status} | Duration: ${(result.duration / 1000).toFixed(2)}s`);
            if (result.error) {
              console.log(`   Error: ${result.error}`);
            }
            console.log('');
          });
        } else {
          console.log(`Run ${args[1]} not found.`);
        }
      } else {
        console.log('Usage: view-history run <runId>');
      }
      break;
      
    case 'failed':
      const failedRuns = viewer.getRunsByStatus('failed');
      console.log(`\n=== Failed Runs (${failedRuns.length}) ===`);
      failedRuns.slice(0, 20).forEach(run => {
        const date = new Date(run.startTime).toLocaleString();
        console.log(`${run.runId} | ${date} | Failed: ${run.failed}/${run.total}`);
      });
      break;
      
    default:
      console.log('Usage:');
      console.log('  view-history              - Show summary of recent runs');
      console.log('  view-history summary [N]  - Show summary of last N runs (default: 10)');
      console.log('  view-history latest       - Show details of latest run');
      console.log('  view-history stats        - Show statistics across all runs');
      console.log('  view-history run <runId>  - Show details of specific run');
      console.log('  view-history failed       - Show all failed runs');
      break;
  }
}

