# admin.vb-poker.com

this is a project for `admin.vb-poker.com`.

```[bash]
# install
yarn install --ignore-engines

# only first time before launch(generate IVY compile)
yarn ngc

# build
yarn build

# build for prod
build:prod

# start
yarn start
```

## ARCHITECTURE

base on CRUD Moel based desgin.

- [ARCHITECTURE.MD](ARCHITECTURE.MD)

## VSCODE EXTENSIONS FOR DEV

### FOR ANGULAR

- `mikael.angular-beastcode`
- `angular.ng-template`
- `cyrilletuzi.angular-schematics`

### TS AUTO IMPORT

- `nucllear.vscode-extension-auto-import`
- `steoates.autoimport`
- `ionutvmi.path-autocomplete`

### TODO

- `wayou.vscode-todo-highlight`
- `fabiospampinato.vscode-todo-plus`

### LINT, FORMAT

- `hookyqr.beautify`
- `esbenp.prettier-vscode`
- `rvest.vs-code-prettier-eslint`
- `mohsen1.prettify-json`
- `dbaeumer.vscode-eslint`
- `ms-vscode.vscode-typescript-tslint-plugin`
- `shardulm94.trailing-spaces`
- `mkaufman.htmlhint`
- `mohd-akram.vscode-html-format`

### JS(TS)DOC

- `oouo-diogo-perdigao.docthis`

### MARKDOWN(PREVIEW)

- `shd101wyy.markdown-preview-enhanced`

### DEBUG

1. need these extensions:

- `codemooseus.vscode-devtools-for-chrome`
- `msjsdiag.debugger-for-chrome-nightly`

2. and added `launch.json` file into `.vscode` directory.

```[json]
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "ADMIN.VB-POKER.COM",
      "url": "http://dev.admin.vb-poker.com:4250/",
      "webRoot": "${workspaceFolder}"
    }
  ]
}
```

3. RUN AND DEBUG

run command `yarn start` on VSCODE and you can debug now.
[see more information](https://www.c-sharpcorner.com/article/debug-angular-in-vs-code/)

## create a new page module

```[bash]
npx ng g module pages/${new-page} --routing
npx ng g component pages/${new-page} --module=pages/${new-page}/${new-page}.module.ts
npx ng g component pages/${new-page}/${new-page}-list --module=pages/${new-page}/${new-page}.module.ts
npx ng g component pages/${new-page}/${new-page}-detail --module=pages/${new-page}/${new-page}.module.ts
npx ng g component pages/${new-page}/${new-page}-update --module=pages/${new-page}/${new-page}.module.ts
npx ng g component pages/${new-page}/${new-page}-delete --module=pages/${new-page}/${new-page}.module.ts
npx ng g component pages/${new-page}/${new-page}-status --module=pages/${new-page}/${new-page}.module.ts

## if need a service
npx ng g service shared/services/${new-page}

## update service barrel file(index.ts)
yarn brl:services

## if need a resolver
npx ng g resolver shared/resolvers/${new-page}
yarn brl:resolvers

## if need a guard
npx ng g guard shared/guards/${new-page}
yarn brl:guards

## if need an interface
npx ng g interface shared/interfaces/${new-page}
yarn brl:interfaces

## and one more thing, if you need interface definition from DB, you can use cli-tool by using command on `admin.vb-poker.com`:
yarn ts-interface ${new-page}

## if need a pipe
npx ng g pipe shared/pipes/${new-page}
yarn brl:pipes

## or add the partial components to be shared
npx ng g components shared/components/${new-class-name}
yarn brl:components

## or the other kind of class
npx ng g class core/class/${new-class-name}
yarn brl:class
```

4. The other way to debug by using Chrome extension `angular-devtools`:

[angular-devtools](https://chrome.google.com/webstore/detail/angular-devtools/ienfalfjdbdpebioblfackkekamfmbnh/)
[see more info](https://qiita.com/aqlwah/items/9667d462d0f7f080eda6)

## about nodejs

```[bash]
nodenv install 14.10.0
nodenv local 14.10.0
```
