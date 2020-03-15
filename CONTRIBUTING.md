# Contributing to ts-configurable

The ts-configurable repository is managed using an [Nx](https://nx.dev/getting-started/what-is-nx) workspace.

Run all tests for the ts-configurable library:
`$ npm run test ts-configurable`

Run the example-webserver application:
`$ npm run start example-webserver`

## Development Setup

The recommended IDE for developing is [Visual Studio Code (VSCode)](https://code.visualstudio.com/). The following extensions can be helpful:

- [Docker](https://marketplace.visualstudio.com/items?itemName=PeterJausovec.vscode-docker)
- [TSLint](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-tslint-plugin)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

A development environment can be created using [docker](https://www.docker.com/get-started) and [docker-compose](https://docs.docker.com/compose/install/):

```
$ ./start-dev-container.sh
```

All dependencies have to be initially installed using npm:

```
$ npm install
```

## Test Coverage

![Codecov](https://img.shields.io/codecov/c/gh/derbenoo/ts-configurable.svg)

As the ts-configurable package is small in size yet its correct behavior is critical for the applications depending on it, a 100% test coverage is enforced. This means that all contributed source code needs to be tested with a 100% code coverage before being accepted into the main branch. Reasonable exceptions can be discussed and added to the Jest coverage configuration.

## Publishing to npm

![npm](https://img.shields.io/npm/v/ts-configurable.svg?color=007acc)

A new version of the `ts-configurable` package can be published to npm like this:

```
$ npm run pack:lib
$ cd dist/libs/ts-configurable/src
$ npm publish
```
