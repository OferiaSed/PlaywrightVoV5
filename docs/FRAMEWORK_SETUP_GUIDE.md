# 📖 Framework Setup Guide for Non-Programmers

## Table of Contents
1. [What is Setup?](#what-is-setup)
2. [Prerequisites Checklist](#prerequisites-checklist)
3. [Step 1: Install Node.js](#step-1-install-nodejs)
4. [Step 2: Install Cursor AI (Recommended) or Visual Studio Code](#step-2-install-cursor-ai-recommended-or-visual-studio-code)
5. [Step 3: Install VS Code Extensions](#step-3-install-vs-code-extensions)
6. [Step 4: Get the Project](#step-4-get-the-project)
7. [Step 5: Install Dependencies](#step-5-install-dependencies)
8. [Step 6: Install Playwright Browsers](#step-6-install-playwright-browsers)
9. [Step 7: Verify Installation](#step-7-verify-installation)
10. [Configuration (If Needed)](#configuration-if-needed)
11. [Troubleshooting Setup Issues](#troubleshooting-setup-issues)
12. [Quick Setup Checklist](#quick-setup-checklist)

---

## What is Setup?

### Simple Explanation
**Setup** means getting everything ready on your computer so you can run tests. Think of it like:
- **Setting up a new phone** - you need to install apps and configure settings
- **Preparing a workspace** - you need all your tools before you can start working
- **Installing software** - you need the right programs to do the job

### What We're Setting Up
1. ✅ **Node.js** - The engine that runs the tests
2. ✅ **Cursor AI** (Recommended) or **Visual Studio Code** - The editor where you'll work
3. ✅ **VS Code Extensions** - Tools that make testing easier (work in both Cursor and VS Code)
4. ✅ **The Project** - Download the test framework to your computer
5. ✅ **Dependencies** - All the pieces the framework needs to work
6. ✅ **Playwright Browsers** - The browsers that will run the tests

### Time Required
- **First-time setup**: 30-60 minutes (depending on internet speed)
- **After setup**: You're ready to run tests!

---

## Prerequisites Checklist

Before you start, make sure you have:

| Requirement | What It Is | How to Check |
|-------------|------------|--------------|
| **Computer** | Windows, Mac, or Linux | ✅ You're reading this! |
| **Internet Connection** | To download files | ✅ Check your Wi-Fi |
| **Administrator Access** | To install software | Ask IT if you're not sure |
| **Git** (Optional) | To download the project | See [Git Guide](GIT_GUIDE.md) |
| **Project Access** | Permission to use the framework | Ask your team lead |

---

## Step 1: Install Node.js

### What is Node.js?
**Node.js** is like the **engine** of a car - it's what makes everything run. The test framework needs it to execute tests.

### How to Install Node.js

#### For Windows:

1. **Go to the Node.js Website**
   - Open your web browser
   - Go to: https://nodejs.org/
   - You'll see two big green buttons

2. **Choose the Version**
   - Click the **LTS version** (Long Term Support) - it's the most stable
   - It will say something like "Recommended For Most Users"
   - The version number will be something like "v20.x.x"

3. **Download**
   - Click the download button
   - The file will download (usually to your Downloads folder)
   - The file name will be something like: `node-v20.x.x-x64.msi`

4. **Install**
   - Double-click the downloaded file
   - Click **Next** through all the screens
   - **Important**: Check the box that says "Automatically install the necessary tools"
   - Click **Install**
   - Wait for installation to complete (2-5 minutes)
   - Click **Finish**

5. **Verify Installation**
   - Press `Windows Key + R`
   - Type `cmd` and press Enter
   - In the black window, type: `node --version`
   - Press Enter
   - You should see something like: `v20.11.0`
   - ✅ **Success!** Node.js is installed

6. **Verify npm** (comes with Node.js)
   - In the same window, type: `npm --version`
   - Press Enter
   - You should see something like: `10.2.4`
   - ✅ **Success!** npm is installed

#### For Mac:

1. **Go to the Node.js Website**
   - Open your web browser
   - Go to: https://nodejs.org/
   - Click the **LTS version** download button

2. **Install**
   - Open the downloaded `.pkg` file
   - Follow the installation wizard
   - Click through all steps
   - Enter your password when asked

3. **Verify Installation**
   - Open **Terminal** (Applications → Utilities → Terminal)
   - Type: `node --version` and press Enter
   - Type: `npm --version` and press Enter
   - ✅ You should see version numbers

### Troubleshooting Node.js Installation

**Problem**: Command not found
- **Solution**: Restart your computer, then try again
- **Solution**: Make sure you installed Node.js (not just downloaded it)

**Problem**: Wrong version
- **Solution**: That's okay! Any recent LTS version will work

---

## Step 2: Install Cursor AI (Recommended) or Visual Studio Code

### What is Cursor AI?
**Cursor AI** is an **AI-powered code editor** - it's like Visual Studio Code but with built-in AI assistance. Think of it as your **smart workspace** that can help you understand code, write tests, and solve problems with AI support.

**Why Use Cursor AI?**
- ✅ **All VS Code features** - Everything VS Code can do, Cursor can do too
- ✅ **Built-in AI assistant** - Get help understanding code and writing tests
- ✅ **Better for beginners** - AI can explain things in simple terms
- ✅ **Faster problem-solving** - Ask questions and get instant answers
- ✅ **Same extensions** - All VS Code extensions work in Cursor

**Note**: If you prefer, you can use regular Visual Studio Code instead. Both work the same way for running tests.

### How to Install Cursor AI

#### For Windows:

1. **Go to Cursor AI Website**
   - Open your web browser
   - Go to: https://cursor.sh/
   - Click the **Download** button (usually says "Download for Windows")

2. **Download**
   - The file will download (usually to your Downloads folder)
   - The file name will be something like: `Cursor-Setup-x.x.x.exe`

3. **Install**
   - Double-click the downloaded file
   - **Important**: Check these boxes:
     - ✅ "Add to PATH"
     - ✅ "Create desktop icon"
     - ✅ "Register Cursor as an editor"
   - Click **Next** through all screens
   - Click **Install**
   - Wait for installation (1-2 minutes)
   - Click **Finish**

4. **Open Cursor AI**
   - Look for the Cursor icon on your desktop (it looks like a cursor/arrow)
   - Double-click to open it
   - ✅ **Success!** Cursor AI is installed

#### For Mac:

1. **Go to Cursor AI Website**
   - Open your web browser
   - Go to: https://cursor.sh/
   - Click **Download for Mac**

2. **Install**
   - Open the downloaded file
   - Drag **Cursor** to your **Applications** folder

3. **Open Cursor AI**
   - Go to Applications
   - Double-click Cursor
   - ✅ **Success!** Cursor AI is installed

### Alternative: Install Visual Studio Code (If You Prefer)

If you prefer to use regular Visual Studio Code instead of Cursor AI:

#### For Windows:

1. **Go to VS Code Website**
   - Open your web browser
   - Go to: https://code.visualstudio.com/
   - Click the big **Download for Windows** button

2. **Download and Install**
   - Follow the same installation steps as Cursor AI above
   - The file name will be something like: `VSCodeUserSetup-x64-1.85.x.exe`

#### For Mac:

1. **Go to VS Code Website**
   - Open your web browser
   - Go to: https://code.visualstudio.com/
   - Click **Download for Mac**

2. **Install**
   - Open the downloaded `.zip` file
   - Drag **Visual Studio Code** to your **Applications** folder

### First Time Opening Cursor AI (or VS Code)

When you first open Cursor AI (or VS Code), you might see:
- A welcome screen - that's normal!
- Some pop-ups about settings - you can click "Skip" or "OK"
- **For Cursor AI**: You might be asked to sign in or create an account - this is optional for basic use

---

## Step 3: Install VS Code Extensions

### What are Extensions?
**Extensions** are like **add-ons** that give your editor (Cursor AI or VS Code) extra powers. They make testing easier and more visual. **Good news**: All VS Code extensions work in Cursor AI too!

### Required Extensions

You need to install these extensions:

| Extension Name | What It Does | Why You Need It |
|----------------|---------------|-----------------|
| **Playwright Test for VSCode** | Shows tests in a visual way | Essential - lets you see and run tests |
| **DotENV** | Helps with configuration files | Makes setup easier |
| **Azure Repos** | Connects to Azure DevOps | If your project is in Azure |
| **GitHub Repositories** | Connects to GitHub | If your project is in GitHub |
| **PowerShell** | Terminal support for Windows | Helps run commands |
| **Remote Repositories** | Work with remote code | If needed for your setup |

### How to Install Extensions

#### Method 1: Using the Extensions Panel (Easiest)

1. **Open Extensions Panel**
   - In Cursor AI (or VS Code), look at the left sidebar
   - Click the **Extensions icon** (looks like four squares)
   - Or press `Ctrl + Shift + X` (Windows) or `Cmd + Shift + X` (Mac)

2. **Search for Extension**
   - In the search box at the top, type: `Playwright Test for VSCode`
   - Press Enter

3. **Install**
   - Find "Playwright Test for VSCode" by Microsoft
   - Click the **Install** button (green button)
   - Wait for installation (30 seconds - 2 minutes)
   - ✅ The button will change to say "Installed"

4. **Repeat for Other Extensions**
   - Search for each extension from the list above
   - Install them one by one

#### Method 2: Quick Install Links

You can also install by searching for these exact names:
- `Playwright Test for VSCode`
- `DotENV`
- `Azure Repos`
- `GitHub Repositories`
- `PowerShell` (Windows only)
- `Remote Repositories`

### Verify Extensions Are Installed

1. **Check Extensions Panel**
   - Click the Extensions icon in the left sidebar
   - Look for "INSTALLED" section
   - You should see all your extensions listed there

2. **Look for Icons**
   - After installing Playwright extension, you should see a **beaker/flask icon** in the left sidebar
   - This is the Test Explorer - you'll use it to run tests!

---

## Step 4: Get the Project

### What Does "Get the Project" Mean?
This means **downloading** the test framework to your computer so you can use it.

### Option 1: Using Git (Recommended)

If you have Git installed (see [Git Guide](GIT_GUIDE.md)):

1. **Open Terminal in Cursor AI (or VS Code)**
   - Click **Terminal** → **New Terminal** in the menu
   - Or press `` Ctrl + ` `` (backtick key)

2. **Navigate to Your Folder**
   - Type: `cd C:\` (or wherever you want to save the project)
   - Press Enter

3. **Clone the Repository**
   - Get the repository URL from your team
   - Type: `git clone [repository-url]`
   - Example: `git clone https://github.com/OferiaSed/PlaywrightVoV5.git`
   - Press Enter
   - Wait for download (1-5 minutes depending on size)

4. **Open the Project**
   - In Cursor AI (or VS Code), click **File** → **Open Folder**
   - Navigate to the folder you just cloned
   - Click **Select Folder**

### Option 2: Download as ZIP

If you don't have Git:

1. **Get the Repository URL**
   - Ask your team for the repository link
   - Or go to Azure DevOps/GitHub

2. **Download ZIP**
   - On the repository page, look for a **"Download"** or **"Code"** button
   - Click it and select **"Download ZIP"**
   - Save the file to your computer

3. **Extract the ZIP**
   - Right-click the downloaded ZIP file
   - Select **"Extract All"** or **"Extract Here"**
   - Choose a location (like `C:\PlaywrightVoV5`)

4. **Open in Cursor AI (or VS Code)**
   - Open Cursor AI (or VS Code)
   - Click **File** → **Open Folder**
   - Navigate to the extracted folder
   - Click **Select Folder**

### Verify Project is Open

You should see:
- ✅ Files and folders in the left sidebar
- ✅ A folder called `tests`
- ✅ A file called `package.json`
- ✅ A file called `playwright.config.ts`

---

## Step 5: Install Dependencies

### What are Dependencies?
**Dependencies** are like **ingredients** for a recipe - they're all the pieces the framework needs to work. Think of them as tools in a toolbox.

### How to Install Dependencies

1. **Open Terminal in Cursor AI (or VS Code)**
   - Click **Terminal** → **New Terminal** in the menu
   - Or press `` Ctrl + ` `` (backtick key)
   - Make sure you're in the project folder (you should see the project name in the terminal)

2. **Install All Dependencies**
   - Type this command: `npm install`
   - Press Enter
   - ⏳ **Wait** - this will take 2-10 minutes
   - You'll see lots of text scrolling - that's normal!
   - Look for: `added XXX packages` at the end

3. **What You'll See**
   ```
   npm install
   > Lots of text scrolling...
   > added 245 packages, and audited 246 packages in 2m
   ```
   - ✅ **Success!** Dependencies are installed

### Understanding the Output

**Good Signs** ✅:
- `added XXX packages`
- `audited XXX packages`
- No red error messages
- Process completes

**Warning Signs** ⚠️:
- `npm WARN` messages - Usually okay, just warnings
- Yellow text - Usually okay, just information

**Bad Signs** ❌:
- `npm ERR!` in red - Something went wrong
- Process stops with an error - Need to fix

### If Installation Fails

See the [Troubleshooting](#troubleshooting-setup-issues) section below.

---

## Step 6: Install Playwright Browsers

### What are Playwright Browsers?
**Playwright Browsers** are the actual browsers (Chrome, Firefox, etc.) that will run your tests. Think of them as the "actors" that perform the tests.

### How to Install Browsers

1. **Open Terminal in Cursor AI (or VS Code)**
   - Make sure you're still in the project folder

2. **Install Browsers**
   - Type this command: `npx playwright install`
   - Press Enter
   - ⏳ **Wait** - this will take 5-15 minutes (browsers are large!)
   - You'll see progress for each browser

3. **What You'll See**
   ```
   npx playwright install
   > Downloading Chromium...
   > Downloading Firefox...
   > Downloading WebKit...
   > Installed browsers successfully
   ```
   - ✅ **Success!** Browsers are installed

### Understanding the Output

**Good Signs** ✅:
- `Downloading [Browser Name]...`
- `Installed browsers successfully`
- No error messages

**Bad Signs** ❌:
- `Error downloading`
- `Failed to install`
- Red error messages

### If Browser Installation Fails

- Check your internet connection
- Try running the command again
- See the [Troubleshooting](#troubleshooting-setup-issues) section

---

## Step 7: Verify Installation

### How to Check Everything Works

Let's test that everything is set up correctly:

#### Test 1: Check Node.js and npm

1. **Open Terminal in Cursor AI (or VS Code)**
2. **Type**: `node --version`
3. **Press Enter**
4. **Expected**: You should see a version number like `v20.11.0`
5. **Type**: `npm --version`
6. **Press Enter**
7. **Expected**: You should see a version number like `10.2.4`

✅ **If you see version numbers, Node.js is working!**

#### Test 2: Check Project Files

1. **Look at the left sidebar in Cursor AI (or VS Code)**
2. **Check for these files/folders**:
   - ✅ `package.json` - Should exist
   - ✅ `playwright.config.ts` - Should exist
   - ✅ `tests/` folder - Should exist
   - ✅ `node_modules/` folder - Should exist (this means dependencies are installed)

✅ **If you see these, the project is set up!**

#### Test 3: Check Test Explorer

1. **Look at the left sidebar in Cursor AI (or VS Code)**
2. **Find the beaker/flask icon** (Test Explorer)
3. **Click it**
4. **Expected**: You should see a list of tests (or it might say "No tests found" if tests haven't been detected yet)

✅ **If you see the Test Explorer, Playwright extension is working!**

#### Test 4: Run a Simple Command

1. **Open Terminal in Cursor AI (or VS Code)**
2. **Type**: `npx playwright --version`
3. **Press Enter**
4. **Expected**: You should see a version number like `Version 1.46.0`

✅ **If you see a version, Playwright is installed!**

### All Tests Passed? 🎉

If all tests passed, **you're ready to run tests!** 

See the [Framework Guide](FRAMEWORK_GUIDE.md) to learn how to run tests.

---

## Configuration (If Needed)

### What is Configuration?
**Configuration** means setting up specific settings for your environment. Most users won't need to change anything, but sometimes you might need to configure:
- Environment URLs (QA1, QA2, Demo, etc.)
- Login credentials
- Test data files

### Environment Configuration

The framework supports different environments:
- **QA1** - Quality Assurance environment 1
- **QA2** - Quality Assurance environment 2
- **Demo** - Demonstration environment
- **PreProd** - Pre-production environment
- **Proto** - Prototype environment

**Default**: The framework uses QA1 by default.

### When You Might Need Configuration

You might need to configure if:
- ❓ You need to test against a different environment
- ❓ Your login credentials are different
- ❓ You need to use different test data
- ❓ A developer asks you to change settings

### How to Configure (If Needed)

**Important**: Only change configuration if:
1. ✅ You understand what you're changing
2. ✅ A developer or team lead asked you to
3. ✅ You know how to undo the change

**If you need help with configuration:**
- Ask a developer or team member
- They can guide you through the specific changes needed

### Configuration Files (For Reference)

These files control configuration (don't modify unless instructed):
- `playwright.config.ts` - Main configuration
- `config/environments.ts` - Environment settings
- `.env` file - Environment variables (if it exists)

---

## Troubleshooting Setup Issues

### Problem: Node.js Not Found

**Symptoms**:
- Terminal says: `'node' is not recognized`
- `node --version` doesn't work

**Solutions**:
1. **Restart your computer** - Sometimes needed after installation
2. **Reinstall Node.js** - Download and install again
3. **Check PATH** - Ask IT or a developer for help
4. **Use full path** - Try: `C:\Program Files\nodejs\node.exe --version`

### Problem: npm Install Fails

**Symptoms**:
- Red error messages during `npm install`
- Process stops with errors

**Solutions**:
1. **Check internet connection** - Make sure you're connected
2. **Try again** - Sometimes it's a temporary network issue
3. **Clear npm cache** - Run: `npm cache clean --force`
4. **Delete node_modules** - Delete the `node_modules` folder and try again
5. **Check Node.js version** - Make sure you have a recent version

### Problem: Extensions Won't Install

**Symptoms**:
- Extension installation fails
- Extensions don't appear after installing

**Solutions**:
1. **Restart Cursor AI (or VS Code)** - Close and reopen
2. **Check internet connection** - Extensions download from the internet
3. **Try installing one at a time** - Install extensions individually
4. **Check editor version** - Make sure you have the latest version of Cursor AI or VS Code

### Problem: Playwright Browsers Won't Install

**Symptoms**:
- `npx playwright install` fails
- Browsers don't download

**Solutions**:
1. **Check internet connection** - Browsers are large files
2. **Check disk space** - Browsers need several GB of space
3. **Try again** - Sometimes downloads fail and retry works
4. **Install specific browser** - Try: `npx playwright install chromium` (just one browser)

### Problem: Can't Find the Project

**Symptoms**:
- Can't see project files in Cursor AI (or VS Code)
- Terminal says "command not found"

**Solutions**:
1. **Open the correct folder** - File → Open Folder → Select project folder
2. **Check you're in the right place** - Terminal should show project name
3. **Verify project downloaded** - Check if the folder exists on your computer

### Problem: Test Explorer Not Showing

**Symptoms**:
- No beaker/flask icon in sidebar
- Can't see tests

**Solutions**:
1. **Install Playwright extension** - Make sure it's installed
2. **Reload Cursor AI (or VS Code)** - Press `Ctrl + Shift + P`, type "Reload Window"
3. **Check project is open** - Make sure you opened the project folder
4. **Wait a moment** - Sometimes it takes time to detect tests

### Problem: "Command Not Found" Errors

**Symptoms**:
- Terminal says commands don't exist
- `npm`, `node`, or `npx` not recognized

**Solutions**:
1. **Restart terminal** - Close and reopen the terminal
2. **Restart Cursor AI (or VS Code)** - Close and reopen the editor
3. **Check installation** - Verify Node.js is installed correctly
4. **Use full paths** - Ask a developer for help with PATH configuration

### Problem: Installation Takes Forever

**Symptoms**:
- `npm install` takes more than 15 minutes
- Downloads are very slow

**Solutions**:
1. **Check internet speed** - Slow internet = slow downloads
2. **Be patient** - First-time setup can take 30-60 minutes
3. **Check for errors** - Make sure it's actually working (not stuck)
4. **Try different network** - If possible, use a faster connection

### Getting More Help

If you're still stuck:
1. ✅ **Read error messages carefully** - They often tell you what's wrong
2. ✅ **Check this guide again** - Make sure you followed all steps
3. ✅ **Ask a team member** - Developers or QA team can help
4. ✅ **Take screenshots** - Capture error messages to show others
5. ✅ **Document the issue** - Write down what happened and when

---

## Quick Setup Checklist

Use this checklist to make sure you've completed everything:

### Prerequisites
- [ ] Computer with internet connection
- [ ] Administrator access (if needed)
- [ ] Project access/permissions

### Installation Steps
- [ ] ✅ Node.js installed (`node --version` works)
- [ ] ✅ npm installed (`npm --version` works)
- [ ] ✅ Cursor AI (or VS Code) installed and opened
- [ ] ✅ Playwright extension installed
- [ ] ✅ Other VS Code extensions installed
- [ ] ✅ Project downloaded/cloned to computer
- [ ] ✅ Project opened in Cursor AI (or VS Code)
- [ ] ✅ Dependencies installed (`npm install` completed)
- [ ] ✅ Playwright browsers installed (`npx playwright install` completed)

### Verification
- [ ] ✅ Can see project files in Cursor AI (or VS Code)
- [ ] ✅ Test Explorer icon visible in sidebar
- [ ] ✅ `npx playwright --version` shows version number
- [ ] ✅ `node_modules` folder exists in project

### Ready to Use
- [ ] ✅ All checks passed
- [ ] ✅ Ready to run tests!

---

## What's Next?

Once setup is complete:

1. **Read the Framework Guide** - See `docs/FRAMEWORK_GUIDE.md` to learn how to run tests
2. **Try Running a Test** - Use Test Explorer to run your first test
3. **Explore the Project** - Look at test files to understand the structure
4. **Ask Questions** - Don't hesitate to ask team members for help

---

## Summary

### What You've Set Up

✅ **Node.js** - The engine that runs tests  
✅ **Cursor AI** (Recommended) or **VS Code** - Your workspace for testing  
✅ **Extensions** - Tools that make testing easier  
✅ **Project** - The test framework on your computer  
✅ **Dependencies** - All the pieces needed to run tests  
✅ **Browsers** - The browsers that execute tests  

### Time Investment

- **First-time setup**: 30-60 minutes
- **Future use**: Ready to go immediately!

### Key Commands to Remember

| Command | What It Does |
|---------|--------------|
| `node --version` | Check Node.js version |
| `npm --version` | Check npm version |
| `npm install` | Install dependencies |
| `npx playwright install` | Install browsers |
| `npx playwright --version` | Check Playwright version |

---

**Congratulations! 🎉** You've successfully set up the test framework. You're now ready to start running tests!

---

*Last Updated: [Current Date]*  
*Framework Version: PlaywrightVoV5*

