# Reactive User Interface Patterns

Patterns for UI development with [RxJS](https://github.com/ReactiveX/rxjs)

## Goals

1. Simplify [Conduit](https://github.com/indiana-university/conduit) concepts (Values, Events, Intent, State, Reducers, Selectors, Handlers).
2. Reuse stateful logic (like [React Hooks](https://reactjs.org/docs/hooks-intro.html)).
3. Decouple hooks from rendering (unlike React Hooks).
4. Make hooks directly testable.

## Next steps

1. Develop more examples (e.g. component communication, data loading).
2. Name this pattern ("hook") and determine a naming convention (`use*`).
3. Document pattern and best practices.
4. Write unit tests for all hooks.

## Install

```
npm install
```

## Start

Start the local development server. It should automatically open the browser to [`http://localhost:8000/`](http://localhost:8000/).

```
npm run start
```

## Test

Review code style, run unit tests, and analyze code coverage.

```
npm run test
```

## Development environment

This repo uses a ["buildless" environment](https://dev.to/open-wc/on-the-bleeding-edge-3cb8). There is no Webpack or other bundling system. [Snowpack](https://www.snowpack.dev/) prepares browser dependencies as JS modules and generates an import map. [`es-module-shims`](https://github.com/guybedford/es-module-shims) provides support for [import maps](https://github.com/WICG/import-maps), JS modules, and CSS modules (via [`construct-style-sheets-polyfill`](https://github.com/calebdwilliams/construct-style-sheets)).
