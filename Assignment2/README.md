# Assignment 2 — Version Control using Git & GitHub

**Course:** Full Stack Web Development  
**Institution:** MIT Academy of Engineering (MITAOE), Pune  
**Student Name:** Sameet Pisal  
**PRN:** 202401120018  
**GitHub Profile:** [https://github.com/Sameet728](https://github.com/Sameet728)  
**Repository:** [https://github.com/Sameet728/FullStack_MITAOE](https://github.com/Sameet728/FullStack_MITAOE)  

---

## 📌 Problem Statement
> **1. Create version control account on GitHub and using Git commands to create repository and push your code to GitHub.**

---

## 🚀 Git Commands Reference & Workflow Executed

### 1. Account Creation & Git Configuration
```bash
# Verify Git installation
git --version

# Configure global user identity
git config --global user.name "Sameet728"
git config --global user.email "sameetpisal@gmail.com"

# Verify configuration settings
git config --list
```

### 2. Local Repository Initialization
```bash
# Initialize a new Git repository in workspace root
git init

# Set default primary branch to main
git branch -M main
```

### 3. File Staging & Commits
```bash
# Inspect repository status
git status

# Stage all project files (ignoring node_modules via .gitignore)
git add .

# Create initial descriptive commit
git commit -m "Assignment 2: Setup version control and initialize FullStack coursework repository"
```

### 4. Remote Linking & Synchronization
```bash
# Link local repository to GitHub remote
git remote add origin https://github.com/Sameet728/FullStack_MITAOE.git

# Verify remote configuration
git remote -v

# Fetch & reconcile remote state
git pull origin main --allow-unrelated-histories --no-rebase

# Push local commits to remote GitHub repository
git push -u origin main
```

### 5. Repository History Inspection
```bash
# View graphical single-line commit history
git log --oneline --graph --all --decorate
```

---

## 📁 Repository Coursework Structure
```
FullStack_MITAOE/
├── .gitignore                      # Ignored patterns (node_modules, logs)
├── README.md                       # Main repository overview
├── Assignment1/                    # Assignment 1 - Responsive Admin Dashboard
│   └── dashboard.html              # Modern ShopKart Admin Dashboard
├── Assignment_1/                   # Assignment 1 Mirror & Academic Report
│   ├── dashboard.html
│   └── Assignment_1_Report_Sameet_Pisal_202401120018.docx
├── Assignment2/                    # Assignment 2 - Version Control Documentation
│   └── README.md                   # Git commands and workflow guide
└── Assignment_3/                   # Assignment 3 - Student Management System (React)
    └── student-management/
```
