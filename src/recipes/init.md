## Hello World Setup

1. create the folder, npm init, git init
   `mkdir playground && cd playground && npm init -y && echo {}> .gitignore && git init`

2. update `.gitignore`

```json
node_modules
```

`git add . && git commit -m "npm, git init"`

3. add typescript
   `npm install typescript`

`npx tsc --init`

`git add . && git commit -m "typescript"`

4. add prettier
   `npm install --save-dev --save-exact prettier`

`echo {}> .prettierrc.json`

5. create and update .prettierignore
   `touch .prettierignore`

add the following:

```json
build
coverage
node_modules
```

6. update VS Code `settings.json`:

```json
{
  "editor.fontLigatures": true,
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  },
  "aws.profile": "profile:default",
  "aws.onDefaultRegionMissing": "add",
  "workbench.colorTheme": "Default Dark+",
  "editor.accessibilitySupport": "off",
  "editor.tabSize": 2,
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  },
  "git.confirmSync": false,
  "vs-color-picker.autoLaunch": true,
  "security.workspace.trust.untrustedFiles": "open",
  "[markdown]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  },
  "files.insertFinalNewline": true,
  "json.schemas": [],
  "editor.fontFamily": "FiraCode Nerd Font",
  "terminal.integrated.env.osx": {
    "FIG_NEW_SESSION": "1"
  }
}
```

7. update `tsconfig.json`

```json
{
  // ...

  "outDir": "build"
}
```

8. update NPM scripts:

```json
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "npx tsc",
    "watch": "npx tsc --outDir build/ --watch"
  },
```

9. create `index.ts`
   `touch index.ts`
