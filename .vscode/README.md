# VS Code Extensions Configuration

This folder contains the VS Code workspace configuration, including recommended extensions for the team.

## Overview

This workspace uses **92 extensions** to provide a comprehensive development environment for:

- Frontend development (React, Next.js, TypeScript, Tailwind CSS)
- Backend development (Python, Java)
- DevOps and containerization
- Code quality and productivity tools

## Installation

When you open this workspace in VS Code, you'll be prompted to install the recommended extensions. You can also install them manually by:

1. Opening the Extensions view (`Ctrl+Shift+X` / `Cmd+Shift+X`)
2. Typing `@recommended` in the search box
3. Installing the recommended extensions

## Extensions by Category

### 🎨 Frontend Development

| Extension                              | ID                                           | Description                               |
| -------------------------------------- | -------------------------------------------- | ----------------------------------------- |
| Tailwind CSS IntelliSense              | `bradlc.vscode-tailwindcss`                  | Intelligent Tailwind CSS tooling          |
| ES7+ React/Redux/React-Native snippets | `dsznajder.es7-react-js-snippets`            | JavaScript and React snippets             |
| ES7+ React/Redux/React-Native snippets | `rodrigovallades.es7-react-js-snippets`      | Additional React snippets                 |
| JavaScript (ES6) code snippets         | `xabikos.javascriptsnippets`                 | ES6 syntax snippets                       |
| HTML CSS Support                       | `ecmel.vscode-html-css`                      | CSS class name completion                 |
| Auto Rename Tag                        | `formulahendry.auto-rename-tag`              | Automatically rename paired HTML/XML tags |
| HTML Tag Wrapper                       | `hwencc.html-tag-wrapper`                    | Wrap selected text with HTML tags         |
| Styled Components                      | `styled-components.vscode-styled-components` | Syntax highlighting for styled-components |
| React Component Tree                   | `habeebarul.react-component-tree`            | Visualize React component hierarchy       |
| React Native Stylesheet Color Palette  | `rajd.react-native-stylesheet-color-palette` | Color palette for React Native            |
| React Theme                            | `mikaelkristiansson87.react-theme-vscode`    | React-themed color scheme                 |
| Vue Language Features (Volar)          | `vue.volar`                                  | Vue.js language support                   |
| Vue 3 Snippets                         | `hollowtree.vue-snippets`                    | Vue.js code snippets                      |

### 🔧 TypeScript & JavaScript

| Extension                     | ID                                 | Description                          |
| ----------------------------- | ---------------------------------- | ------------------------------------ |
| TypeScript Importer           | `ms-vscode.vscode-typescript-next` | Enhanced TypeScript support          |
| Pretty TypeScript Errors      | `yoavbls.pretty-ts-errors`         | Make TypeScript errors more readable |
| JavaScript Debugger (Nightly) | `ms-vscode.js-debug-nightly`       | Latest JavaScript debugging features |

### 📝 Code Quality & Formatting

| Extension                      | ID                                                    | Description                          |
| ------------------------------ | ----------------------------------------------------- | ------------------------------------ |
| ESLint                         | `dbaeumer.vscode-eslint`                              | JavaScript linting                   |
| Prettier - Code formatter      | `esbenp.prettier-vscode`                              | Code formatter                       |
| Prettier ESLint                | `rvest.vs-code-prettier-eslint`                       | Format code with Prettier and ESLint |
| Code Spell Checker             | `streetsidesoftware.code-spell-checker`               | Spell checking for code              |
| IntelliCode                    | `visualstudioexptteam.vscodeintellicode`              | AI-assisted development              |
| IntelliCode API Usage Examples | `visualstudioexptteam.intellicode-api-usage-examples` | API usage examples                   |

### 🐍 Python Development

| Extension                  | ID                                        | Description                     |
| -------------------------- | ----------------------------------------- | ------------------------------- |
| Python                     | `ms-python.python`                        | Python language support         |
| Python Extension Pack      | `donjayamanne.python-extension-pack`      | Collection of Python extensions |
| Pylance                    | `ms-python.vscode-pylance`                | Fast Python language server     |
| Python Debugger            | `ms-python.debugpy`                       | Python debugging support        |
| Python Environment Manager | `donjayamanne.python-environment-manager` | Manage Python environments      |
| Python Environments        | `ms-python.vscode-python-envs`            | Python environment management   |
| Python Indent              | `kevinrose.vsc-python-indent`             | Correct Python indentation      |
| autoDocstring              | `njpwerner.autodocstring`                 | Generate Python docstrings      |
| Python Type Hint           | `njqdev.vscode-python-typehint`           | Type hint support               |
| Jinja                      | `wholroyd.jinja`                          | Jinja template support          |
| Jinja HTML                 | `samuelcolvin.jinjahtml`                  | Jinja2 syntax highlighting      |
| Django                     | `batisteo.vscode-django`                  | Django framework support        |

### 📊 Data Science & Jupyter

| Extension                  | ID                                    | Description                         |
| -------------------------- | ------------------------------------- | ----------------------------------- |
| Jupyter                    | `ms-toolsai.jupyter`                  | Jupyter notebook support            |
| Jupyter Keymap             | `ms-toolsai.jupyter-keymap`           | Jupyter keyboard shortcuts          |
| Jupyter Notebook Renderers | `ms-toolsai.jupyter-renderers`        | Additional output renderers         |
| Jupyter Cell Tags          | `ms-toolsai.vscode-jupyter-cell-tags` | Cell tagging support                |
| Jupyter Slide Show         | `ms-toolsai.vscode-jupyter-slideshow` | Create presentations from notebooks |

### ☕ Java Development

| Extension                     | ID                               | Description                    |
| ----------------------------- | -------------------------------- | ------------------------------ |
| Extension Pack for Java       | `vscjava.vscode-java-pack`       | Complete Java development pack |
| Language Support for Java(TM) | `redhat.java`                    | Java language server           |
| Debugger for Java             | `vscjava.vscode-java-debug`      | Java debugging support         |
| Test Runner for Java          | `vscjava.vscode-java-test`       | Java test execution            |
| Maven for Java                | `vscjava.vscode-maven`           | Maven project support          |
| Gradle for Java               | `vscjava.vscode-gradle`          | Gradle project support         |
| Project Manager for Java      | `vscjava.vscode-java-dependency` | Java project management        |

### 🐳 DevOps & Containers

| Extension           | ID                                   | Description                |
| ------------------- | ------------------------------------ | -------------------------- |
| Docker              | `docker.docker`                      | Docker support             |
| Docker              | `ms-azuretools.vscode-docker`        | Docker tooling             |
| Dev Containers      | `ms-vscode-remote.remote-containers` | Development containers     |
| Remote - Containers | `ms-azuretools.vscode-containers`    | Container development      |
| Terraform           | `hashicorp.terraform`                | Terraform language support |
| Jenkinsfile Support | `ivory-lab.jenkinsfile-support`      | Jenkins pipeline support   |
| Jenkinsfile Support | `secanis.jenkinsfile-support`        | Additional Jenkins support |

### 🔗 Git & GitHub

| Extension                  | ID                             | Description                |
| -------------------------- | ------------------------------ | -------------------------- |
| GitLens — Git supercharged | `eamodio.gitlens`              | Enhanced Git capabilities  |
| GitHub Copilot             | `github.copilot`               | AI pair programmer         |
| GitHub Copilot Chat        | `github.copilot-chat`          | AI chat assistant          |
| GitHub Actions             | `github.vscode-github-actions` | GitHub Actions support     |
| GitHub Repositories        | `github.remotehub`             | Browse GitHub repositories |
| Azure Repos                | `ms-vscode.azure-repos`        | Azure DevOps integration   |

### 📄 Documentation & Markdown

| Extension                            | ID                                    | Description                    |
| ------------------------------------ | ------------------------------------- | ------------------------------ |
| Markdown All in One                  | `yzhang.markdown-all-in-one`          | Comprehensive markdown support |
| Markdown Preview Enhanced            | `shd101wyy.markdown-preview-enhanced` | Enhanced markdown preview      |
| Markdown Emoji                       | `bierner.markdown-emoji`              | Emoji support in markdown      |
| Mermaid Markdown Syntax Highlighting | `bierner.markdown-mermaid`            | Mermaid diagrams in markdown   |
| markdownlint                         | `davidanson.vscode-markdownlint`      | Markdown linting               |
| MDX                                  | `unifiedjs.vscode-mdx`                | MDX file support               |

### 🔍 Search & Navigation

| Extension       | ID                            | Description                   |
| --------------- | ----------------------------- | ----------------------------- |
| Better Outline  | `adamerose.better-outline`    | Enhanced code outline         |
| Better Comments | `aaron-bond.better-comments`  | Improved comment highlighting |
| TODO Highlight  | `wayou.vscode-todo-highlight` | Highlight TODO comments       |
| Regex Previewer | `chrmarti.regex`              | Regular expression testing    |

### 🎨 UI & Themes

| Extension            | ID                             | Description                      |
| -------------------- | ------------------------------ | -------------------------------- |
| Material Icon Theme  | `pkief.material-icon-theme`    | Material Design icons            |
| Indent Rainbow       | `oderwat.indent-rainbow`       | Colorize indentation             |
| Bracket Pair Toggler | `dzhavat.bracket-pair-toggler` | Toggle bracket pair colorization |
| vscode-color         | `anseki.vscode-color`          | Color picker and palette         |
| Emoji                | `perkovec.emoji`               | Emoji picker                     |

### 🛠️ Productivity Tools

| Extension      | ID                             | Description              |
| -------------- | ------------------------------ | ------------------------ |
| Live Server    | `ritwickdey.liveserver`        | Local development server |
| REST Client    | `humao.rest-client`            | HTTP client              |
| Thunder Client | `rangav.vscode-thunder-client` | Lightweight REST client  |
| Polacode       | `pnp.polacode`                 | Code screenshots         |
| CodeSnap       | `adpyke.codesnap`              | Code screenshots         |
| File Header    | `mikey.vscode-fileheader`      | Add file headers         |
| PDF            | `tomoki1207.pdf`               | PDF viewer               |

### 🗄️ Data & Database

| Extension     | ID                         | Description            |
| ------------- | -------------------------- | ---------------------- |
| SQLite Viewer | `alexcvzz.vscode-sqlite`   | SQLite database viewer |
| Rainbow CSV   | `mechatroner.rainbow-csv`  | CSV file highlighting  |
| Excel Viewer  | `grapecity.gc-excelviewer` | Excel file viewer      |
| Prisma        | `prisma.prisma`            | Prisma ORM support     |

### 🌐 Remote Development

| Extension                                 | ID                                 | Description                 |
| ----------------------------------------- | ---------------------------------- | --------------------------- |
| Remote - SSH                              | `ms-vscode-remote.remote-ssh`      | SSH remote development      |
| Remote - SSH: Editing Configuration Files | `ms-vscode-remote.remote-ssh-edit` | SSH configuration           |
| Remote - WSL                              | `ms-vscode-remote.remote-wsl`      | Windows Subsystem for Linux |
| Remote Explorer                           | `ms-vscode.remote-explorer`        | Remote connection explorer  |
| Remote Repositories                       | `ms-vscode.remote-repositories`    | Browse remote repositories  |
| Remote Server                             | `ms-vscode.remote-server`          | Remote server support       |
| Live Share                                | `ms-vsliveshare.vsliveshare`       | Real-time collaboration     |

### 📊 Data Science (R)

| Extension  | ID                        | Description           |
| ---------- | ------------------------- | --------------------- |
| R          | `reditorsupport.r`        | R language support    |
| R Syntax   | `reditorsupport.r-syntax` | R syntax highlighting |
| R Debugger | `rdebugger.r-debugger`    | R debugging support   |

### 🧪 Testing

| Extension                  | ID                         | Description                |
| -------------------------- | -------------------------- | -------------------------- |
| Playwright Test for VSCode | `ms-playwright.playwright` | Playwright testing support |
| LeetCode                   | `leetcode.vscode-leetcode` | LeetCode problem solving   |

### 🔧 Development Tools

| Extension      | ID                               | Description            |
| -------------- | -------------------------------- | ---------------------- |
| GraphQL        | `graphql.vscode-graphql-syntax`  | GraphQL syntax support |
| XML Tools      | `dotjoshjohnson.xml`             | XML language support   |
| Diff Viewer    | `caponetto.vscode-diff-viewer`   | Enhanced diff viewing  |
| JSON Generator | `dadroit.dadroit-json-generator` | Generate JSON data     |

## Project-Specific Recommendations

For this Next.js + TypeScript + Tailwind CSS project, the most essential extensions are:

1. **GitHub Copilot** - AI assistance for faster development
2. **Tailwind CSS IntelliSense** - Essential for Tailwind development
3. **ESLint + Prettier** - Code quality and formatting
4. **TypeScript** extensions - Enhanced TypeScript support
5. **React snippets** - Faster React development
6. **GitLens** - Better Git workflow

## Getting Started

1. Install the recommended extensions when prompted
2. Reload VS Code after installation
3. Configure your user settings as needed
4. Start coding with enhanced tooling!

---

_This configuration is maintained for the nextjs-react-lib-all-in-one project to ensure consistent development experience across the team._
