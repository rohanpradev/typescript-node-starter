<img height="0" width="0" alt="typescript-starter dark logo" src="https://www.typescriptlang.org/images/branding/logo-grouping.svg"><img alt="pnpm logo" src="https://pnpm.io/assets/images/pnpm-standard-79c9dbb2e99b8525ae55174580061e1b.svg">

[![NPM version](https://img.shields.io/npm/v/typescript-starter.svg)](https://www.npmjs.com/package/typescript-starter)
[![Codecov](https://img.shields.io/codecov/c/github/bitjson/typescript-starter.svg)](https://codecov.io/gh/bitjson/typescript-starter)
[![GitHub stars](https://img.shields.io/github/stars/bitjson/typescript-starter.svg?style=social&logo=github&label=Stars)](https://github.com/rohanpradev/typescript-node-starter)

<p align="center">
  <img alt="demo of the typescript-starter command-line interface" src="https://cdn.rawgit.com/bitjson/typescript-starter/c3e3b7ec/demo.svg">
</p>

## Start Now

Run one simple command to install and use the interactive project generator. You'll need [Node](https://nodejs.org/) `v10` or later.

```sh
pnpm install
```

# Features

- Write **standard, future javascript** – with stable ESNext features – today ([stage 3](https://github.com/tc39/proposals) or [finished](https://github.com/tc39/proposals/blob/master/finished-proposals.md) features)
- [Optionally use typescript](https://medium.freecodecamp.org/its-time-to-give-typescript-another-chance-2caaf7fabe61) to improve tooling, linting, and documentation generation
- Both strict and flexible [typescript configurations](./tsconfig.json) available

So we can have nice things:

- Automatic linting and formatting using [`typescript-eslint`](https://github.com/typescript-eslint/typescript-eslint) and [Prettier](https://prettier.io/)

## But first, a good editor

Before you start, consider using an [editor with good typescript support](https://github.com/Microsoft/TypeScript/wiki/TypeScript-Editor-Support).

[VS Code](https://code.visualstudio.com/) (below) is a popular option. Editors with typescript support can provide helpful autocomplete, inline documentation, and code refactoring features.

Also consider installing editor extensions for [ESLint](https://github.com/Microsoft/vscode-eslint) and [Prettier](https://github.com/prettier/prettier-vscode). These extensions automatically format your code each time you save, and may quickly become invaluable.

<p align="center">
  <img alt="Typescript Editor Support – vscode" width="600" src="https://cloud.githubusercontent.com/assets/904007/23042221/ccebd534-f465-11e6-838d-e2449899282c.png">
</p>

# Developing with Typescript starter

## Run in Development

To start working, run the `pnpm dev` task using [`pnpm`](https://pnpm.io/).

```sh
pnpm dev
```

## Run in Production
To start working, run the `pnpm build` task using [`pnpm`](https://pnpm.io/).

```sh
pnpm build
```


Since only changed files are rebuilt and retested, this workflow remains fast even for large projects.

## Enable stronger type checking (recommended)

To make getting started easier, the default `tsconfig.json` is using a very flexible configuration. This will allow you to get started without many warnings from Typescript.

To enable additional Typescript type checking features (a good idea for mission-critical or large projects), review the commented-out lines in your [typescript compiler options](./tsconfig.json).

## Auto-fix and format project

To automatically check `eslint` and `prettier` formatting issues, run:

```sh
pnpm lint:check
pnpm prettier:check
```

To automatically fix `eslint` and `prettier` formatting issues, run:

```sh
pnpm lint:fix
pnpm prettier:fix
```

