# 📖 Test Framework Guide for Non-Programmers

## Table of Contents
1. [What is This Framework?](#what-is-this-framework)
2. [Why Do We Use It?](#why-do-we-use-it)
3. [Understanding Test Organization](#understanding-test-organization)
4. [Getting Started](#getting-started)
5. [Running Tests](#running-tests)
6. [Understanding Test Results](#understanding-test-results)
7. [Reading Test Reports](#reading-test-reports)
8. [Common Scenarios](#common-scenarios)
9. [Understanding Test Names](#understanding-test-names)
10. [Troubleshooting](#troubleshooting)
11. [Key Terms Glossary](#key-terms-glossary)

---

## What is This Framework?

### Simple Explanation
Think of this framework like a **robot assistant** that:
- **Automatically tests** the Smart.ly application at Sedgwick
- **Simulates user actions** (clicking buttons, filling forms, navigating pages)
- **Checks if everything works** as expected
- **Reports problems** when something doesn't work correctly
- **Runs tests faster** than humans could manually

### Real-World Analogy
Imagine you have a **quality inspector** in a factory who:
- Tests every product before it ships
- Follows a checklist to ensure quality
- Documents any issues found
- Works 24/7 without getting tired
- Can test multiple things at the same time

That's what this framework does for the Smart.ly application!

### What It Tests
The framework tests different parts of the Smart.ly system:
- **Leave (LV)** - Leave management features
- **Disability (DS)** - Disability claim features
- **General Liability (GL)** - General liability features
- **Auto Liability (AU)** - Auto liability features
- **Workers' Compensation (WC)** - Workers' compensation features
- And more...

---

## Why Do We Use It?

### Benefits
✅ **Saves Time**: Tests run automatically, no manual clicking needed  
✅ **Finds Bugs Early**: Catches problems before users see them  
✅ **Consistent Testing**: Tests the same way every time  
✅ **Fast Results**: Can test many scenarios in minutes  
✅ **Documentation**: Shows what was tested and what passed/failed  
✅ **Regression Testing**: Ensures new changes don't break existing features  

### When Tests Run
- **Before Releases**: To make sure everything works before going live
- **After Changes**: To verify new features don't break old ones
- **Scheduled Runs**: Automatically at set times
- **On-Demand**: When you need to verify something specific

---

## Understanding Test Organization

### Test Files Structure
Tests are organized like a **filing cabinet** with clear labels:

```
tests/
└── specs/
    ├── LV-contacts.spec.ts          (Leave - Contacts testing)
    ├── LV-claim-header.spec.ts      (Leave - Claim Header testing)
    ├── DS-claim-header.spec.ts      (Disability - Claim Header testing)
    ├── DS-hr-accruals.spec.ts       (Disability - HR Accruals testing)
    └── LV-certifications.spec.ts     (Leave - Certifications testing)
```

### Naming Convention
Test files follow a pattern: `{LOB}-{feature}.spec.ts`

**Example**: `LV-contacts.spec.ts`
- **LV** = Leave (the business area)
- **contacts** = The feature being tested
- **.spec.ts** = This is a test specification file

### What Each Part Means

| Part | Meaning | Example |
|------|---------|---------|
| **LOB** | Line of Business | LV (Leave), DS (Disability), GL (General Liability) |
| **Feature** | What's being tested | contacts, claim-header, certifications |
| **.spec.ts** | Test file identifier | Always ends with this |

---

## Getting Started

### Prerequisites
Before you can run tests, you need:
1. ✅ **Visual Studio Code (VS Code)** installed
2. ✅ **The project** downloaded to your computer
3. ✅ **Dependencies installed** (usually done by a developer)
4. ✅ **Access credentials** configured (if needed)

### Opening the Project
1. Open **Visual Studio Code**
2. Click **File** → **Open Folder**
3. Select the project folder (usually named `PlaywrightVoV5`)
4. Wait for VS Code to load the project

### Finding Tests
1. In VS Code, look at the left sidebar
2. Click the **Testing icon** (looks like a beaker/flask) or go to **View** → **Testing**
3. You'll see a list of all available tests organized by file

---

## Running Tests

### Method 1: Using Test Explorer (Recommended for Beginners)

This is the **easiest way** to run tests - no typing required!

#### Steps:
1. **Open Test Explorer**
   - Click **View** → **Testing** in the menu bar
   - Or click the **Testing icon** in the left sidebar (beaker/flask icon)

2. **See All Tests**
   - You'll see a tree structure showing all test files
   - Click the **▶** arrow next to a file to expand it
   - You'll see individual test cases inside

3. **Run Tests**
   - **Single Test**: Click the play button (▶) next to a specific test
   - **All Tests in a File**: Click the play button next to the file name
   - **All Tests**: Click the play button at the top
   - **Multiple Tests**: Right-click on tests and select **Run Test**

4. **Watch the Results**
   - Tests will show as **running** (spinning icon)
   - When done, you'll see:
     - ✅ **Green checkmark** = Test passed
     - ❌ **Red X** = Test failed
     - ⏸️ **Paused** = Test is waiting

#### Visual Guide:
```
Test Explorer
├── 📁 LV-contacts.spec.ts
│   ├── ▶ Validate Contact Creation - Req 3.1.001
│   ├── ▶ Validate Contact Search - Req 3.1.002
│   └── ▶ Validate Contact Deletion - Req 3.1.003
└── 📁 LV-claim-header.spec.ts
    ├── ▶ Validate Header Fields - Req 3.2.001
    └── ▶ Validate Header Customization - Req 3.2.002
```

### Method 2: Using Terminal (Advanced)

If you're comfortable with typing commands, you can use the terminal:

1. **Open Terminal**
   - Click **Terminal** → **New Terminal** in VS Code
   - Or press `` Ctrl + ` `` (backtick key)

2. **Run Commands**
   - **All tests**: Type `npm test` and press Enter
   - **With browser visible**: Type `npm run test:qa1` and press Enter
   - **Specific file**: Type `npx playwright test LV-contacts.spec.ts --headed`

3. **What You'll See**
   - Tests will run in the terminal
   - You'll see progress and results
   - A browser window may open (if using `--headed` mode)

---

## Understanding Test Results

### Test Status Icons

When tests finish, you'll see different icons:

| Icon | Status | Meaning |
|------|--------|---------|
| ✅ | **Passed** | Test completed successfully - everything worked! |
| ❌ | **Failed** | Test found a problem - something didn't work as expected |
| ⏸️ | **Skipped** | Test was not run (intentionally skipped) |
| ⏳ | **Running** | Test is currently executing |
| ⚠️ | **Warning** | Test passed but with warnings |

### What "Passed" Means
✅ **Test Passed** = The feature works correctly
- All checks were successful
- No errors found
- The application behaved as expected

### What "Failed" Means
❌ **Test Failed** = Something didn't work correctly
- A button didn't click
- A field didn't appear
- Data didn't save
- A page didn't load
- Something unexpected happened

### Understanding Failure Messages

When a test fails, you'll see:
1. **Test Name**: Which test failed
2. **Error Message**: What went wrong
3. **Location**: Where in the code the error occurred
4. **Screenshot**: Visual proof of what happened (if available)

**Example Failure Message:**
```
❌ Validate Contact Creation - Req 3.1.001
   Error: Element 'Save Button' should be visible but was not found
   Location: tests/pages/ContactsPage.ts:45
```

This means:
- The test tried to find a "Save Button"
- The button wasn't visible on the page
- The problem was in the ContactsPage file

---

## Reading Test Reports

### Opening the Report

After tests run, you can view a detailed report:

1. **Open Terminal** in VS Code
2. **Type**: `npm run report` or `npx playwright show-report`
3. **Press Enter**
4. A web browser will open showing the test report

### Understanding the Report

The report shows:

#### 1. **Summary Section**
- **Total Tests**: How many tests ran
- **Passed**: How many passed (green)
- **Failed**: How many failed (red)
- **Skipped**: How many were skipped (gray)
- **Duration**: How long tests took to run

#### 2. **Test List**
- All tests organized by file
- Color-coded results
- Click any test to see details

#### 3. **Test Details** (Click on a test)
- **Timeline**: Step-by-step what happened
- **Screenshots**: Visual proof at each step
- **Console Logs**: Messages from the test
- **Network Activity**: What the browser requested
- **Error Details**: Full error information if failed

### Report Features

#### Screenshots
- Shows what the page looked like at each step
- Helps understand what the test was doing
- Useful for debugging failures

#### Timeline
- Shows the sequence of actions
- Each action is labeled (click, type, wait, etc.)
- Helps understand test flow

#### Console Logs
- Shows messages from the test
- Includes validation messages
- Format: `[Page Name] ✅ Element is visible.` or `[Page Name] ❌ Element should be visible but was not found.`

---

## Common Scenarios

### Scenario 1: Running Tests Before a Release

**Goal**: Verify everything works before going live

**Steps**:
1. Open Test Explorer
2. Select all tests (or specific test suites)
3. Click Run
4. Wait for completion
5. Check results:
   - ✅ All passed? → Safe to release
   - ❌ Any failed? → Fix issues before release

### Scenario 2: Testing After a Change

**Goal**: Make sure your change didn't break anything

**Steps**:
1. Identify which tests relate to your change
2. Run those specific tests
3. Check results:
   - ✅ All passed? → Change is safe
   - ❌ Any failed? → Investigate the failure

### Scenario 3: Investigating a Bug Report

**Goal**: Reproduce and verify a reported issue

**Steps**:
1. Find the test that covers the reported feature
2. Run that test
3. Check results:
   - ✅ Test passes? → Bug might be fixed or not reproducible
   - ❌ Test fails? → Confirms the bug exists

### Scenario 4: Running a Specific Test Suite

**Goal**: Test only one business area (e.g., Leave)

**Steps**:
1. In Test Explorer, find tests starting with "LV-" (for Leave)
2. Right-click on the folder or file
3. Select "Run Tests"
4. Review results for that area only

### Scenario 5: Viewing Test History

**Goal**: See how tests performed over time

**Steps**:
1. Tests run automatically in CI/CD
2. Check Azure DevOps (or your CI/CD system)
3. View test run history
4. Compare results across runs

---

## Understanding Test Names

### Test Name Format

Tests follow a pattern: `'{Description} - Req {Requirement Number}'`

**Example**: `'Validate Contact Creation - Req 3.1.001'`

**Breaking it down**:
- **"Validate Contact Creation"** = What the test does
- **"Req 3.1.001"** = The requirement number it tests

### Why Requirement Numbers Matter

- **Traceability**: Links tests to business requirements
- **Documentation**: Shows what requirements are covered
- **Reporting**: Helps track requirement coverage
- **Communication**: Easy to reference in discussions

### Common Test Descriptions

| Description | What It Tests |
|-------------|---------------|
| **Validate** | Checks if something works correctly |
| **Verify** | Confirms expected behavior |
| **Test** | General testing of a feature |
| **Check** | Validates a specific condition |

---

## Troubleshooting

### Problem: Tests Won't Run

**Possible Causes**:
1. **Dependencies not installed**
   - **Solution**: Ask a developer to run `npm install`

2. **VS Code extensions missing**
   - **Solution**: Install "Playwright Test for VSCode" extension

3. **Project not opened correctly**
   - **Solution**: Make sure you opened the project folder, not a file

### Problem: All Tests Fail

**Possible Causes**:
1. **Application not accessible**
   - **Solution**: Check if the test environment is running

2. **Login credentials expired**
   - **Solution**: Update credentials in configuration

3. **Network issues**
   - **Solution**: Check internet connection

### Problem: Tests Run Slowly

**Possible Causes**:
1. **Too many tests running at once**
   - **Solution**: Run tests in smaller batches

2. **Application is slow**
   - **Solution**: Check application performance

3. **Computer resources**
   - **Solution**: Close other applications

### Problem: Can't See Test Explorer

**Solution**:
1. Click **View** → **Testing** in the menu
2. Or press `Ctrl + Shift + P` and type "Testing: Focus on Test View"

### Problem: Test Report Won't Open

**Solution**:
1. Make sure tests have run at least once
2. Try: `npx playwright show-report`
3. Check if a report folder exists

### Problem: Don't Understand an Error Message

**What to Do**:
1. **Read the error message** - it usually explains what went wrong
2. **Check the screenshot** - visual proof of the issue
3. **Look at the timeline** - see what step failed
4. **Ask for help** - share the error with a developer or tester

### Getting Help

If you're stuck:
1. ✅ Check this guide first
2. ✅ Look at the error message carefully
3. ✅ Check test reports for details
4. ✅ Ask a team member for help
5. ✅ Document the issue for the team

---

## Key Terms Glossary

| Term | Simple Definition |
|------|-------------------|
| **Test** | A check to see if something works correctly |
| **Test Suite** | A group of related tests |
| **Test Case** | A single test that checks one thing |
| **Pass** | Test completed successfully ✅ |
| **Fail** | Test found a problem ❌ |
| **Spec File** | A file containing test cases (ends with `.spec.ts`) |
| **Test Explorer** | The tool in VS Code to see and run tests |
| **Test Report** | A detailed summary of test results |
| **Screenshot** | A picture taken during the test |
| **Headless** | Running tests without showing the browser |
| **Headed** | Running tests with the browser visible |
| **LOB** | Line of Business (Leave, Disability, etc.) |
| **Requirement (Req)** | A business rule that must be tested |
| **Fixture** | Pre-configured setup for tests |
| **Page Object** | Code that represents a page in the application |
| **Assertion** | A check that something is true |
| **Timeout** | Maximum time to wait for something |
| **CI/CD** | Automated testing in the cloud |
| **Regression** | Testing to ensure old features still work |

---

## Quick Reference

### Running Tests
- **Test Explorer**: View → Testing → Click play button
- **All Tests**: `npm test`
- **With Browser**: `npm run test:qa1`
- **Specific File**: `npx playwright test filename.spec.ts --headed`

### Viewing Results
- **In Test Explorer**: See icons (✅/❌) next to tests
- **Detailed Report**: `npm run report` or `npx playwright show-report`

### Test Organization
- **By LOB**: LV (Leave), DS (Disability), GL, AU, WC
- **By Feature**: contacts, claim-header, certifications, etc.
- **By Requirement**: Each test links to a requirement number

### Status Meanings
- ✅ **Green Checkmark** = Passed (everything worked)
- ❌ **Red X** = Failed (problem found)
- ⏸️ **Pause Icon** = Skipped (not run)
- ⏳ **Spinner** = Running (in progress)

---

## Tips for Success

### For First-Time Users
1. ✅ Start with **Test Explorer** - it's the easiest way
2. ✅ Run **one test at a time** to understand results
3. ✅ **Read error messages** - they explain what went wrong
4. ✅ **Check screenshots** in reports - they show what happened
5. ✅ **Ask questions** - don't hesitate to ask for help

### Best Practices
1. ✅ **Run tests regularly** - catch problems early
2. ✅ **Review failed tests** - understand what broke
3. ✅ **Check reports** - get detailed information
4. ✅ **Document issues** - help the team fix problems
5. ✅ **Keep tests updated** - ensure they test current features

### What NOT to Worry About
- ❌ You don't need to write code
- ❌ You don't need to understand all technical details
- ❌ You don't need to fix test failures yourself
- ❌ You don't need to modify test files

**Your job is to**:
- ✅ Run tests
- ✅ Understand results
- ✅ Report findings
- ✅ Help identify issues

---

## Next Steps

Now that you understand the basics:

1. **Try It Out**: Run a test using Test Explorer
2. **Explore Reports**: View a test report to see details
3. **Practice**: Run different test suites
4. **Learn More**: Ask team members about specific features
5. **Contribute**: Share feedback and suggestions

---

## Additional Resources

- **Git Guide**: See `docs/GIT_GUIDE.md` for version control help
- **Technical Docs**: See `README.md` for developer information
- **Team Members**: Ask developers or QA team for help
- **Playwright Docs**: https://playwright.dev/ (for advanced users)

---

**Remember**: This framework is a tool to help ensure quality. Don't be afraid to use it, ask questions, or make mistakes. The goal is to find problems before users do! 🎯

---

*Last Updated: [Current Date]*  
*Framework Version: PlaywrightVoV5*

