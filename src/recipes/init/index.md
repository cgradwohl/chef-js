## Node.js + Typescript

### Init

1. create the folder, npm init, git init
   `mkdir playground && cd playground && npm init -y && echo -e "node_modules" >> .gitignore && git init`
2. commit
   `git add . && git commit -m "npm, git init"`

### Add Typescript

3. add typescript
   `npm install typescript`
   `npx tsc --init`
   `git add . && git commit -m "typescript"`

### Add Prettier

4. add prettier
   `npm install --save-dev --save-exact prettier`
   `echo {}> .prettierrc.json`

5. create and update .prettierignore
   `echo -e "build\r\nnode_modules" >> .prettierignore`

6. update VS Code `settings.json`

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

7. commit
   `git add . && git commit -m "prettier"`

### Create build Folder

8. open VS Code
   `code .`

9. update `tsconfig.json`

   ```json
   {
     // ...

     "outDir": "build",
     "rootDir": "src"
   }
   ```

10. update package.json

    ```json
    {
      // ...
      "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1",
        "build": "npx tsc",
        "watch": "npx tsc --outDir build/ --watch"
      }
    }
    ```

11. commit
    `git add . && git commit -m "create build folder"`

### Create src Folder

12. create and update index.ts
    `mkdir src && echo -e "(() => console.log('hello world'))()" >> src/index.ts`

13. commit
    `git add . && git commit -m "create src folder"`

14. compile the program
    `npm run build`

15. run the program
    `node build/index.js`
