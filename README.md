```
***************************************************************************
*                                                                         *
*                                                                         *
*                  ██╗   ██╗ ██████╗ ██╗   ██╗███████╗                    *
*                  ██║   ██║██╔═══██╗██║   ██║██╔════╝                    *
*                  ██║   ██║██║   ██║██║   ██║███████╗                    *
*                  ╚██╗ ██╔╝██║   ██║╚██╗ ██╔╝╚════██║                    *
*                   ╚████╔╝ ╚██████╔╝ ╚████╔╝ ███████║                    *
*                    ╚═══╝   ╚═════╝   ╚═══╝  ╚══════╝                    *
*                                                                         *
***************************************************************************
```


# 🧪 Playwright Automation Test Framework

This repository contains functional test automation framework built with Playwright, developed in TypeScript. It's designed to validate principal functionality for Smart.ly Project at Segdwick, with support for both local and CI/CD execution.



## 📦 Technologies & Tools

- [Playwright](https://playwright.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [dotenv](https://www.npmjs.com/package/dotenv) – for environment variable management
- [ExcelJS](https://www.npmjs.com/package/exceljs) (optional) – for data-driven testing
- CI/CD: Azure DevOps


## 🗂️ Project Structure

playwright-framework/
├── package.json
├── playwright.config.ts
├── .env.example
├── .gitignore
├── tsconfig.json
├── config/
│   ├── environments.ts
│   └── advanced-environments.ts
├── utils/
│   └── environment.ts
├── tests/
│   ├── base/
│   │   └── BaseTest.ts
│   ├── specs/
│   │   ├── example.spec.ts
│   │   └── login.spec.ts
│   └── fixtures/
│       └── test-data.ts
├── pages/
│   ├── BasePage.ts
│   ├── LoginPage.ts
│   └── HomePage.ts
└── reports/
    └── .gitkeep

---

## ⚙️ VS Setup

1.- Install VSCode from MS official Page
2.- Install the following Extensions
- Azure Repos
- DotENV
- GitHub Actions
- GitHub Repositories
- Playwright Test For VSCode
- PowerShell
- Remote Repositories


---

## ⚙️ Installation

1.- Create Project
- Create a local folder on your machine
- Open VSCode and select the folder previosly created
- Go to Terminal > New Terminal
- execute following command --> npm init playwright@latest --yes
- This command will install latest version of playwright
-  npm install @playwright/test@1.46.0  playwright@1.46.0 --save -dev

2.- Install dependencies:
- Go to VSCode Terminal and execute the following commands:
- npm install xlsx
- npm install --save-dev@faker-js/faker
- npm install clipboardy
- npm install dotenv --save
- npm install mssql @azure/identity
- npm install oracledb
- npm install mssql
- npm install @alex_neo/playwright-azure-reporter  

## 🧪 Running Tests

1.- Run using Test Explorer
- Go to VSCode, at toolbar select View -> Testing
- At left side the Test Explorer will show you all test cases detected
- Select any number of test cases, right click and the select "run"
- Test cases will be executed

2.- Run All by Terminal (headless mode)
- npx playwright test

3.- Run All by Terminal UI 
- npx playwright test --headed 

4.- Run All by Terminal UI + parallel testing 
- npx playwright test --headed --workers=3

5.- Run All by Terminal UI + parallel testing + specific test file
- npx playwright test pepsico-regression-test.spec.ts  --headed  --workers=3


## ▶️ Open the report:
Open the report executing this command: npx playwright show-report

---

## 📚 Documentation

Comprehensive documentation is available in the `docs/` directory:

- **[Repository Usage Guide](docs/REPOSITORY_USAGE.md)** - Complete guide on how to use the repository, write tests, and follow best practices
- **[GitHub Actions Guide](docs/GITHUB_ACTIONS.md)** - Detailed documentation about CI/CD workflows, configuration, and troubleshooting
- **[PowerPoint Layers](docs/POWERPOINT_LAYERS.md)** - Structured outline for creating presentations about the framework
- **[Git Workflow Guide](docs/GIT_WORKFLOW_GUIDE.md)** - Beginner-friendly guide for Git operations (cloning, branching, committing, etc.)

### Quick Links
- [Getting Started](docs/REPOSITORY_USAGE.md#getting-started)
- [Writing Tests](docs/REPOSITORY_USAGE.md#writing-tests)
- [Page Object Model](docs/REPOSITORY_USAGE.md#page-object-model)
- [CI/CD Workflow](docs/GITHUB_ACTIONS.md#current-workflow)
- [Git Workflow for Beginners](docs/GIT_WORKFLOW_GUIDE.md#what-is-git)
- [Troubleshooting](docs/REPOSITORY_USAGE.md#troubleshooting)