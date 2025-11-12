# 📖 Git Workflow Guide for Non-Programmers

## Table of Contents
1. [What is Git?](#what-is-git)
2. [Getting Started](#getting-started)
3. [First-Time Setup](#first-time-setup)
4. [Cloning the Repository](#cloning-the-repository)
5. [Daily Workflow](#daily-workflow)
6. [Creating a Branch](#creating-a-branch)
7. [Making Changes](#making-changes)
8. [Committing Changes](#committing-changes)
9. [Pushing Changes](#pushing-changes)
10. [Creating a Pull Request](#creating-a-pull-request)
11. [Updating Your Local Copy](#updating-your-local-copy)
12. [Common Scenarios](#common-scenarios)
13. [Troubleshooting](#troubleshooting)
14. [Visual Guide](#visual-guide)

---

## What is Git?

### Simple Explanation
Think of Git like a **time machine for your files**. It:
- **Saves snapshots** of your work at different points in time
- **Tracks changes** so you can see what was modified
- **Allows multiple people** to work on the same project without conflicts
- **Lets you go back** to previous versions if something goes wrong

### Why We Use Git
- ✅ **Safety**: Never lose your work
- ✅ **Collaboration**: Multiple people can work together
- ✅ **History**: See who changed what and when
- ✅ **Backup**: Your code is stored safely online
- ✅ **Organization**: Keep different features separate

### Key Terms (Simple Definitions)

| Term | Simple Meaning |
|------|----------------|
| **Repository** | The project folder with all files and history |
| **Clone** | Download a copy of the repository to your computer |
| **Branch** | A separate workspace for your changes (like a copy) |
| **Commit** | Save a snapshot of your changes with a message |
| **Push** | Upload your changes to the online repository |
| **Pull Request** | Ask to merge your changes into the main code |
| **Pull** | Download the latest changes from online |

---

## Getting Started

### Step 1: Install Git

**For Windows:**
1. Go to [https://gitforwindows.org/]
2. Download the installer
3. Run the installer
4. Click "Next" through all steps (default options are fine)
5. Click "Finish"

**Verify Installation:**
1. Open **Command Prompt** or **PowerShell**
2. Type: `git --version`
3. You should see something like: `git version 2.40.0`

---

## First-Time Setup

### Configure Your Name and Email

Open **Command Prompt** (Windows) or **Terminal** (Mac) and run:

```bash
git config --global user.name "Your Full Name"
git config --global user.email "your.email@company.com"
```

**Example:**
```bash
git config --global user.name "John Smith"
git config --global user.email "john.smith@company.com"
```

**Important:** Use the **same email** that's connected to your GitHub/company account!

### Verify Your Settings

```bash
git config --global user.name
git config --global user.email
```

This will show you what you just set.

---

## Cloning the Repository

### What is Cloning?
**Cloning** means downloading a complete copy of the repository to your computer.

### Step-by-Step: Clone the Repository

#### Step 1: Get the Repository URL
1. Go to the repository on GitHub/Azure DevOps
2. Click the green **"Code"** button
3. Copy the URL (it looks like: `https://github.com/OferiaSed/PlaywrightVoV5.git`)

#### Step 2: Choose Where to Save
1. Open **File Explorer** (Windows)
2. Go to your C:/ drive and create a folder like:  "AutomationVOV"
3. Navigate to where you want to save the project (e.g., `C:\AutomationVOV`)
4. Remember this location!

#### Step 3: Open Terminal/Command Prompt
**Windows:**
- Press `Windows Key + R`
- Type `cmd` and press Enter
- OR right-click in the folder and select "Open in Terminal"


#### Step 4: Navigate to Your Folder
```bash
cd C:\AutomationVOV
```
(Replace `C:\AutomationVOV` with your actual folder path)

#### Step 5: Clone the Repository
```bash
git clone https://github.com/OferiaSed/PlaywrightVoV5.git
```

**What happens:**
- Git downloads all files
- Creates a folder with the repository name
- Sets up everything you need

#### Step 6: Enter the Repository Folder
```bash
cd repository
```
(Replace `repository` with the actual repository name like `PlaywrightVoV5`)

#### Step 7: Verify It Worked
```bash
git status
```

You should see: `On branch main` (or `master`)

**✅ Success!** You now have a local copy of the repository.

---

## Daily Workflow

### The Typical Day

```
1. Update your local copy (pull latest changes)
2. Create a new branch for your work
3. Make your changes
4. Save your changes (commit)
5. Upload your changes (push)
6. Create a pull request
```

---

## Creating a Branch

### What is a Branch?
A **branch** is like creating a separate copy of the project where you can make changes without affecting the main code.

**Think of it like:**
- **Main branch** = The official, working version
- **Your branch** = Your personal workspace to make changes

### Why Create a Branch?
- ✅ Work on new features safely
- ✅ Test changes without breaking main code
- ✅ Multiple people can work simultaneously
- ✅ Easy to review changes before merging

### Step-by-Step: Create a Branch

#### Step 1: Make Sure You're Up to Date
```bash
git checkout main
git pull
```

#### Step 2: Create Your Branch
```bash
git checkout -b feature/your-feature-name
```

**Branch Naming Examples:**
- `feature/add-login-test`
- `bugfix/fix-contact-validation`
- `update/improve-documentation`

**Good Branch Names:**
- ✅ `feature/contacts-page-tests`
- ✅ `bugfix/header-display-issue`
- ❌ `my-changes`
- ❌ `test1`

#### Step 3: Verify You're on Your Branch
```bash
git branch
```

You should see an asterisk (*) next to your branch name:
```
  main
* feature/your-feature-name
```

**✅ Success!** You're now working on your own branch.

---

## Making Changes

### How to Make Changes

1. **Open files** in VS Code or your editor
2. **Edit the files** as needed
3. **Save your files** (Ctrl+S or Cmd+S)

### What Git Sees

Git automatically tracks:
- ✅ Files you modified
- ✅ Files you added
- ✅ Files you deleted

### Check What Changed

Before committing, see what you changed:

```bash
git status
```

This shows:
- **Modified files** (files you changed)
- **Untracked files** (new files you created)
- **Deleted files** (files you removed)

### See Detailed Changes

```bash
git diff
```

This shows the actual changes (additions in green, deletions in red).

---

## Committing Changes

### What is a Commit?
A **commit** is like saving a snapshot of your work with a message describing what you did.

**Think of it like:**
- Taking a photo of your work
- Writing a note about what's in the photo
- Storing it in a photo album (the repository history)

### Step-by-Step: Commit Your Changes

#### Step 1: Stage Your Changes
Tell Git which files you want to include in this commit:

**Option A: Stage All Changes**
```bash
git add .
```
(This adds all modified files)

**Option B: Stage Specific Files**
```bash
git add tests/specs/LV-contacts.spec.ts
git add tests/pages/ContactsPage.ts
```

#### Step 2: Verify What's Staged
```bash
git status
```

Files listed under "Changes to be committed" will be included in your commit.

#### Step 3: Commit with a Message
```bash
git commit -m "Add contact validation tests for Leave module"
```

**Good Commit Messages:**
- ✅ `"Add contact validation tests for Leave module"`
- ✅ `"Fix header display issue in claim page"`
- ✅ `"Update documentation for Git workflow"`
- ❌ `"Changes"`
- ❌ `"Fixed stuff"`
- ❌ `"asdf"`

**Commit Message Format:**
```
[Action] [What] [Why/Details]

Examples:
- "Add contact validation tests for Leave module"
- "Fix header display issue in claim page"
- "Update README with installation instructions"
```

#### Step 4: Verify Your Commit
```bash
git log --oneline -5
```

This shows your last 5 commits.

**✅ Success!** Your changes are now saved locally.

---

## Pushing Changes

### What is Pushing?
**Pushing** means uploading your commits to the online repository so others can see them.

### Step-by-Step: Push Your Changes

#### Step 1: Push Your Branch
```bash
git push origin feature/your-feature-name
```

(Replace `feature/your-feature-name` with your actual branch name)

**What happens:**
- Git uploads your commits
- Creates the branch online (if it's the first push)
- Others can now see your work

#### Step 2: First Time? Set Upstream
If this is the first time pushing this branch, use:

```bash
git push -u origin feature/your-feature-name
```

The `-u` flag sets up tracking so future pushes are easier.

#### Step 3: Verify It Worked
- Go to the repository on GitHub/Azure DevOps
- You should see your branch listed
- Your commits should be visible

**✅ Success!** Your changes are now online.

---

## Creating a Pull Request

### What is a Pull Request?
A **Pull Request (PR)** is a request to merge your changes into the main code. It's like asking: "Can you review my work and add it to the main project?"

### Step-by-Step: Create a Pull Request

#### Step 1: Go to the Repository
1. Open your web browser
2. Go to the repository on GitHub/Azure DevOps
3. You should see a banner saying "Your branch is X commits ahead"

#### Step 2: Click "Create Pull Request"
1. Click the **"Compare & pull request"** button
2. OR go to the **"Pull Requests"** tab
3. Click **"New Pull Request"**

#### Step 3: Fill Out the Form

**Title:**
- Clear, descriptive title
- Example: `Add contact validation tests for Leave module`

**Description:**
- What did you change?
- Why did you change it?
- Any important notes?

**Example Description:**
```
## What Changed
- Added contact validation tests for Leave module
- Updated ContactsPage with new validation methods

## Why
- Required by User Story US-123
- Ensures contact data is validated correctly

## Testing
- All tests pass locally
- Tested on QA1 environment
```

#### Step 4: Select Reviewers
- Choose team members to review your code
- They will check your changes before merging

#### Step 5: Submit the Pull Request
- Click **"Create Pull Request"**
- Wait for reviewers to approve
- Address any feedback if needed

#### Step 6: After Approval
- Once approved, click **"Merge"**
- Your changes will be added to the main branch
- You can delete your branch after merging

**✅ Success!** Your changes are now part of the main code.

---

## Updating Your Local Copy

### Why Update?
When others make changes, you need to download them to keep your local copy up to date.

### Step-by-Step: Update Your Local Copy

#### Method 1: Update Main Branch

**Step 1: Switch to Main Branch**
```bash
git checkout main
```

**Step 2: Download Latest Changes**
```bash
git pull
```

**What happens:**
- Git downloads new commits
- Updates your local files
- Your main branch is now up to date

#### Method 2: Update Your Feature Branch

**Step 1: Make Sure You're on Your Branch**
```bash
git checkout feature/your-feature-name
```

**Step 2: Update from Main**
```bash
git pull origin main
```

**OR merge main into your branch:**
```bash
git checkout main
git pull
git checkout feature/your-feature-name
git merge main
```

**What happens:**
- Gets latest changes from main
- Merges them into your branch
- Your branch now includes all latest updates

---

## Common Scenarios

### Scenario 1: Starting a New Day

**Goal:** Get the latest code and start working

```bash
# 1. Go to your repository folder
cd C:\Projects\PlaywrightVoV5

# 2. Update main branch
git checkout main
git pull

# 3. Create a new branch for today's work
git checkout -b feature/todays-feature

# 4. Start working!
```

### Scenario 2: Saving Your Work

**Goal:** Save your progress before lunch/end of day

```bash
# 1. Check what changed
git status

# 2. Stage your changes
git add .

# 3. Commit with message
git commit -m "WIP: Add contact validation tests"

# 4. Push to save online
git push
```

### Scenario 3: Undo Local Changes

**Goal:** Discard changes you haven't committed yet

```bash
# See what would be discarded
git status

# Discard all uncommitted changes
git checkout .

# OR discard specific file
git checkout -- filename.ts
```

**⚠️ Warning:** This permanently deletes uncommitted changes!

### Scenario 4: See What You Changed

**Goal:** Review your changes before committing

```bash
# See list of changed files
git status

# See detailed changes
git diff

# See changes in a specific file
git diff tests/specs/LV-contacts.spec.ts
```

### Scenario 5: Switch Between Branches

**Goal:** Work on different features

```bash
# See all branches
git branch

# Switch to a branch
git checkout branch-name

# Create and switch to new branch
git checkout -b new-branch-name
```

### Scenario 6: Update Your Branch with Latest Changes

**Goal:** Get latest changes from main into your branch

```bash
# Make sure you're on your branch
git checkout feature/your-feature-name

# Get latest from main
git pull origin main

# If there are conflicts, resolve them, then:
git add .
git commit -m "Merge latest changes from main"
```

---

## Troubleshooting

### Problem 1: "fatal: not a git repository"

**Error Message:**
```
fatal: not a git repository (or any of the parent directories)
```

**Solution:**
- You're not in a Git repository folder
- Navigate to the repository folder first:
```bash
cd C:\Projects\PlaywrightVoV5
```

### Problem 2: "Please tell me who you are"

**Error Message:**
```
*** Please tell me who you are.
```

**Solution:**
- Set your Git identity (see [First-Time Setup](#first-time-setup)):
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@company.com"
```

### Problem 3: "Your branch is behind"

**Error Message:**
```
Your branch is behind 'origin/main' by X commits
```

**Solution:**
- Update your local copy:
```bash
git pull
```

### Problem 4: "Merge conflict"

**Error Message:**
```
CONFLICT (content): Merge conflict in filename.ts
```

**What it means:**
- You and someone else changed the same part of a file
- Git doesn't know which version to keep

**Solution:**
1. Open the file with conflicts
2. Look for conflict markers:
   ```
   <<<<<<< HEAD
   Your changes
   =======
   Their changes
   >>>>>>> branch-name
   ```
3. Decide which version to keep (or combine both)
4. Remove the conflict markers
5. Save the file
6. Stage and commit:
   ```bash
   git add filename.ts
   git commit -m "Resolve merge conflict in filename.ts"
   ```

### Problem 5: "Permission denied"

**Error Message:**
```
Permission denied (publickey)
```

**Solution:**
- You need to set up SSH keys or use HTTPS
- Contact your team lead for help with authentication

### Problem 6: "Nothing to commit"

**Error Message:**
```
nothing to commit, working tree clean
```

**What it means:**
- You haven't made any changes, OR
- All changes are already committed

**Solution:**
- This is usually fine! It means everything is saved
- If you expected changes, check:
  - Did you save your files?
  - Are you in the right folder?

### Problem 7: "Branch already exists"

**Error Message:**
```
fatal: A branch named 'feature-name' already exists
```

**Solution:**
- The branch name is already taken
- Use a different name:
```bash
git checkout -b feature-name-v2
```

### Problem 8: Can't Push - "Updates were rejected"

**Error Message:**
```
Updates were rejected because the remote contains work that you do not have locally
```

**Solution:**
- Someone else pushed changes
- Update first, then push:
```bash
git pull
# Resolve any conflicts if needed
git push
```

---

## Visual Guide

### Git Workflow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    ONLINE REPOSITORY                    │
│                  (GitHub/Azure DevOps)                  │
└─────────────────────────────────────────────────────────┘
                          ▲  │
                          │  │
                    PULL  │  │  PUSH
                          │  │
                          │  ▼
┌─────────────────────────────────────────────────────────┐
│                  YOUR LOCAL COMPUTER                   │
│                                                          │
│  ┌──────────────┐         ┌──────────────┐            │
│  │  WORKING     │  ADD    │   STAGED     │            │
│  │  DIRECTORY   │ ──────► │   AREA       │            │
│  │  (Your files)│         │  (Ready to   │            │
│  └──────────────┘         │   commit)    │            │
│                           └──────────────┘            │
│                                  │                      │
│                                  │ COMMIT               │
│                                  ▼                      │
│                           ┌──────────────┐            │
│                           │   LOCAL      │            │
│                           │  REPOSITORY  │            │
│                           │  (History)   │            │
│                           └──────────────┘            │
└─────────────────────────────────────────────────────────┘
```

### Branch Visualization

```
main:     ●──●──●──●──●──●──●
                           │
feature:                   ●──●──●──●
```

- **main**: The main branch (official code)
- **feature**: Your feature branch (your changes)
- **●**: Commits (saved snapshots)

### Typical Day Flow

```
1. START OF DAY
   └─► git checkout main
   └─► git pull
   └─► git checkout -b feature/new-work

2. MAKE CHANGES
   └─► Edit files in VS Code
   └─► Save files

3. SAVE PROGRESS
   └─► git add .
   └─► git commit -m "Description"
   └─► git push

4. END OF DAY / COMPLETE FEATURE
   └─► Create Pull Request online
   └─► Wait for review
   └─► Merge when approved
```

---

## Quick Reference Card

### Essential Commands

| Command | What It Does | When to Use |
|---------|--------------|-------------|
| `git status` | Shows what changed | Before committing |
| `git add .` | Stages all changes | Before committing |
| `git commit -m "message"` | Saves changes | After making changes |
| `git push` | Uploads changes | After committing |
| `git pull` | Downloads changes | Start of day, before work |
| `git checkout -b name` | Creates new branch | Starting new feature |
| `git checkout branch` | Switches branch | Moving between features |
| `git branch` | Lists branches | See what branches exist |
| `git log` | Shows commit history | See what was changed |

### Common Workflows

**Start New Feature:**
```bash
git checkout main
git pull
git checkout -b feature/name
```

**Save Your Work:**
```bash
git add .
git commit -m "Description"
git push
```

**Update Your Copy:**
```bash
git checkout main
git pull
```

**See What Changed:**
```bash
git status
git diff
```

---

## Best Practices

### ✅ Do's

- ✅ **Commit often** - Save your work frequently
- ✅ **Write clear commit messages** - Describe what and why
- ✅ **Pull before starting work** - Always get latest changes
- ✅ **Use descriptive branch names** - `feature/add-tests` not `test1`
- ✅ **Create branches for each feature** - Keep work organized
- ✅ **Test before committing** - Make sure code works
- ✅ **Review your changes** - Use `git status` and `git diff`

### ❌ Don'ts

- ❌ **Don't commit broken code** - Test first!
- ❌ **Don't use vague commit messages** - "Fixed stuff" is bad
- ❌ **Don't work directly on main** - Always use a branch
- ❌ **Don't force push to main** - Always use pull requests
- ❌ **Don't commit sensitive data** - No passwords or keys
- ❌ **Don't ignore merge conflicts** - Resolve them properly
- ❌ **Don't delete branches others use** - Check first

---

## Getting Help

### If You're Stuck

1. **Check this guide** - Look for your problem in Troubleshooting
2. **Use Git help** - Type `git help <command>` (e.g., `git help commit`)
3. **Ask your team** - Don't hesitate to ask for help!
4. **Check online** - Search for the error message

### Useful Resources

- [Git Official Documentation](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [Visual Git Guide](https://learngitbranching.js.org/)

---

## Summary

### The Complete Workflow

```
1. CLONE (First time only)
   git clone <repository-url>

2. DAILY START
   git checkout main
   git pull
   git checkout -b feature/name

3. WORK
   - Edit files
   - Save files

4. SAVE PROGRESS
   git add .
   git commit -m "Description"
   git push

5. SHARE WORK
   - Create Pull Request online
   - Get review
   - Merge when approved
```

### Remember

- 🔄 **Pull** before you start (get latest)
- 🌿 **Branch** for each feature (stay organized)
- 💾 **Commit** often (save your work)
- 📤 **Push** regularly (backup online)
- 🔍 **Review** before committing (check your changes)

---

**Last Updated**: [Date]
**Maintained By**: Test Automation Team

**Need Help?** Contact your team lead or check the troubleshooting section above.

