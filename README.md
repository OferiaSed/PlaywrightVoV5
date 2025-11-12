```
****************************************************************************************************
*                                                                                                  *
*                                                                                                  *
*                                 ██╗   ██╗ ██████╗ ██╗   ██╗███████╗                              *
*                                 ██║   ██║██╔═══██╗██║   ██║██╔════╝                              *
*                                 ██║   ██║██║   ██║██║   ██║███████╗                              *
*                                 ╚██╗ ██╔╝██║   ██║╚██╗ ██╔╝╚════██║                              *
*                                  ╚████╔╝ ╚██████╔╝ ╚████╔╝ ███████║                              *
*                                   ╚═══╝   ╚═════╝   ╚═══╝  ╚══════╝                              *
*                                                                                                  *
****************************************************************************************************
```

# Playwright Test Automation Framework

A professional test automation framework built with Playwright and TypeScript. This framework tests the Viaone application at Sedgwick, covering multiple lines of business with automated functional testing.

## Overview

This framework provides automated testing for the Viaone project. It uses the Page Object Model pattern to create maintainable and reusable test code. Tests run automatically to check that application features work correctly.

## Key Features

- **Page Object Model**: Organized code structure for easy maintenance
- **Custom Fixtures**: Reusable test setup and page objects
- **Data-Driven Testing**: Excel file support for test data
- **Multiple Environments**: Support for QA, Demo, Proto, and Pre-Production environments
- **Multiple Browsers**: Chrome, Firefox, and Edge support
- **Parallel Execution**: Run multiple tests at the same time
- **Detailed Reports**: HTML reports with screenshots and traces
- **CI/CD Integration**: Works with Azure DevOps pipelines
- **Line of Business Coverage**: Tests for Leave (LV), Disability (DS), General Liability (GL), Auto Liability (AU), and Workers' Compensation (WC)

## Technologies Used

- **[Playwright](https://playwright.dev/)** - Modern browser automation
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[dotenv](https://www.npmjs.com/package/dotenv)** - Environment variable management
- **[ExcelJS](https://www.npmjs.com/package/exceljs)** - Excel file reading for test data
- **Azure DevOps** - Continuous Integration and Deployment

## Project Structure

```
PlaywrightVoV5/
├── config/
│   └── environments.ts          # Environment configurations
├── tests/
│   ├── fixtures/
│   │   └── BaseTest.ts          # Custom fixtures and test setup
│   ├── pages/
│   │   ├── BasePage.ts          # Base page object class
│   │   ├── LoginPage.ts         # Login page object
│   │   ├── HomePage.ts          # Home page object
│   │   ├── ViewPage.ts          # View page object
│   │   ├── CustomClaimHeader.ts # Claim header page object
│   │   ├── ContactsPage.ts     # Contacts page object
│   │   ├── CertificationsPage.ts # Certifications page object
│   │   └── HRDataAccrualsPage.ts # HR Data Accruals page object
│   └── specs/
│       ├── admin.setup.ts       # Authentication setup
│       ├── LV-contacts.spec.ts  # Leave contacts tests
│       ├── LV-claim-header.spec.ts # Leave claim header tests
│       ├── LV-certifications.spec.ts # Leave certifications tests
│       ├── DS-claim-header.spec.ts # Disability claim header tests
│       └── DS-hr-accruals.spec.ts # Disability HR accruals tests
├── utils/
│   ├── environment.ts           # Environment utilities
│   ├── console-logger.ts        # Console logging utilities
│   └── helpers/
│       └── excel-reader.ts      # Excel file reader helper
├── playwright.config.ts         # Playwright configuration
├── package.json                 # Project dependencies
└── tsconfig.json                # TypeScript configuration
```

## Prerequisites

Before you begin, ensure you have:

- **Node.js** (version 16 or higher)
- **npm** (comes with Node.js)
- **Visual Studio Code** (basic)
- **Cursor AI** (recommended)
- **Git** (for version control)

## VS Code Setup

### Required Extensions

Install these extensions in Visual Studio Code:

1. **Azure Repos** - Azure DevOps integration
2. **DotENV** - Environment variable support
3. **GitHub Actions** - GitHub workflow support
4. **GitHub Repositories** - GitHub integration
5. **Playwright Test For VSCode** - Playwright test runner
6. **PowerShell** - PowerShell support
7. **Remote Repositories** - Remote repository access

### Installation Steps

1. Open Visual Studio Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for each extension name
4. Click Install for each extension

## Installation

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd PlaywrightVoV5
```

### Step 2: Install Playwright

If you are setting up a new project, initialize Playwright first:

```bash
npm init playwright@latest --yes
```

This command installs the latest version of Playwright.

To install a specific version of Playwright (recommended for this framework):

```bash
npm install @playwright/test@1.46.0 playwright@1.46.0 --save-dev
```

### Step 3: Install Dependencies

Open a terminal in VS Code and run:

```bash
npm install
```

This will install all required packages including:
- TypeScript
- dotenv
- xlsx (for Excel file support)

### Step 3.5: Install Additional Dependencies

Copy and paste the following commands one by one in your terminal:

```bash
npm install xlsx
```

```bash
npm install --save-dev @faker-js/faker
```

```bash
npm install dotenv --save
```

### Step 4: Install Playwright Browsers

**Note:** If you used `npm init playwright@latest --yes` in Step 2, browsers are usually installed automatically. However, if you used the specific version installation command, you must run this step.

```bash
npx playwright install
```

This installs the browser binaries (Chrome, Firefox, Edge) needed for testing. It's recommended to run this command to ensure all browsers are properly installed.

### Step 5: Configure Environment

1. Copy the `.env.example` file to `.env`
2. Update the `.env` file with your environment settings:
   - Base URLs
   - Credentials
   - Timeout values

## Running Tests

### Method 1: Using Test Explorer (Recommended for Beginners)

1. Open VS Code
2. Go to **View** → **Testing** (or press Ctrl+Shift+T)
3. The Test Explorer panel will show all available tests
4. Click the play button next to any test to run it
5. You can run a single test, a test file, or all tests

### Method 2: Using Terminal Commands

#### Run All Tests (Headless Mode)
```bash
npm test
```
or
```bash
npx playwright test
```

#### Run All Tests with Browser Visible
```bash
npx playwright test --headed
```

#### Run Tests for Specific Environment

```bash
# QA1 Environment
npm run test:qa1

# QA2 Environment
npm run test:qa2

# Demo Environment
npm run test:demo

# Proto Environment
npm run test:proto

# Pre-Production Environment
npm run test:preprod
```

#### Run Specific Test File
```bash
npx playwright test tests/specs/LV-contacts.spec.ts --headed
```

#### Run Tests in Parallel
```bash
npx playwright test --headed --workers=3
```

#### Run Specific Test File with Parallel Execution
```bash
npx playwright test tests/specs/LV-contacts.spec.ts --headed --workers=3
```

### Method 3: Generate Test Code

Use Playwright's code generator to create new tests:

```bash
npm run test:codegen
```

This opens a browser and records your actions to generate test code.

## Viewing Test Reports

After running tests, view the detailed HTML report:

```bash
npm run report
```

or

```bash
npx playwright show-report
```

The report includes:
- Test results (passed, failed, skipped)
- Screenshots for failed tests
- Execution traces
- Test duration
- Error messages

## Test Organization

Tests are organized by:

- **Line of Business (LOB)**: LV (Leave), DS (Disability), GL, AU, WC
- **Feature**: contacts, claim-header, certifications, hr-accruals
- **Requirement**: Each test links to a specific requirement number

### Test File Naming Convention

Test files follow this pattern: `{LOB}-{feature}.spec.ts`

Examples:
- `LV-contacts.spec.ts` - Leave contacts tests
- `DS-claim-header.spec.ts` - Disability claim header tests
- `LV-certifications.spec.ts` - Leave certifications tests

## Framework Architecture

### Page Object Model (POM)

The framework uses the Page Object Model pattern:

- Each page has its own class (e.g., `LoginPage`, `ContactsPage`)
- Page classes extend `BasePage` for common functionality
- Locators and actions are organized in page classes
- Tests use page objects instead of direct locators

### Custom Fixtures

The framework provides custom fixtures for easy test setup:

- `login` - LoginPage instance
- `home` - HomePage instance
- `view` - ViewPage instance
- `customClaimHeader` - CustomClaimHeader instance
- `contacts` - ContactsPage instance
- `certifications` - CertificationsPage instance
- `hrDataAccruals` - HRDataAccrualsPage instance
- `consoleLogger` - ConsoleLogger utility

### Data-Driven Testing

Tests can use Excel files for test data:

- Excel files stored in a data directory
- ExcelReader utility reads test data
- Tests iterate through data rows
- Supports multiple data sets per file

## Environment Configuration

The framework supports multiple environments:

- **QA1** - Quality Assurance environment 1
- **QA2** - Quality Assurance environment 2
- **Demo** - Demonstration environment
- **Proto** - Prototype environment
- **Pre-Production** - Pre-production environment

Each environment has its own:
- Base URL
- Timeout settings
- Headless mode configuration

## Documentation

Comprehensive documentation is available in the `docs/` directory:

- **[Framework Guide](docs/FRAMEWORK_GUIDE.md)** - Complete guide for understanding and using the framework
- **[Framework Setup Guide](docs/FRAMEWORK_SETUP_GUIDE.md)** - Detailed setup and configuration instructions
- **[Git Workflow Guide](docs/GIT_GUIDE.md)** - Git operations and workflow for beginners

### Quick Links

- [Getting Started](docs/FRAMEWORK_SETUP_GUIDE.md)
- [Understanding Tests](docs/FRAMEWORK_GUIDE.md)
- [Page Object Model](docs/FRAMEWORK_GUIDE.md)
- [Git Workflow](docs/GIT_GUIDE.md)
- [Troubleshooting](docs/FRAMEWORK_GUIDE.md)

## Best Practices

1. **Use Page Objects**: Always use page objects instead of direct locators in tests
2. **Organize Tests**: Group related tests in describe blocks
3. **Use Fixtures**: Leverage custom fixtures for page objects
4. **Clear Test Names**: Include requirement numbers in test names
5. **Data-Driven Tests**: Use Excel files for multiple test scenarios
6. **Wait for Elements**: Always wait for elements before interacting
7. **Meaningful Assertions**: Use descriptive error messages
8. **Clean Code**: Follow TypeScript and Playwright best practices

## Troubleshooting

### Common Issues

**Tests fail with timeout errors:**
- Check network connectivity
- Verify environment URLs are correct
- Increase timeout values in configuration

**Browser not found:**
- Run `npx playwright install` to install browsers

**Environment variables not loading:**
- Ensure `.env` file exists in project root
- Check that dotenv package is installed

**Tests not appearing in Test Explorer:**
- Reload VS Code window (Ctrl+Shift+P → "Reload Window")
- Check that test files end with `.spec.ts`

## Support

For questions or issues:
1. Check the documentation in the `docs/` folder
2. Review test examples in `tests/specs/`
3. Check page object examples in `tests/pages/`

## License

This project is for internal use at Sedgwick.

---

**Last Updated**: 2024
