# Reactive User Interface Patterns

A user interface is a conversation between people and systems. This feedback loop can be modeled as sequences of events over time, from multiple sources. A tool like [RxJS](https://github.com/ReactiveX/rxjs) is a general purpose library that can manage this complexity well. Events such as a key press or a server response can be transformed and reworked to derive new events, such as rendering a change in the browser.

In 2017, I published [Conduit](https://github.com/indiana-university/conduit) as a set of small RxJS utility functions to assist with state management. It tries not to dictate how state management should be implemented, knowing that no single single pattern will be a universal or timeless solution. Years later, there are a number of scalability issues that I hope to resolve.

In 2018, [React Hooks](https://reactjs.org/docs/hooks-intro.html) was introduced as a functional alternative to class-based state. Business logic can now be grouped together and reused, rather than scattered and repeated among numerous lifecycle methods.

This repo is an exploration of how to leverage RxJS in UI development, inspired by React Hooks, Conduit, and other modern techniques.

## Patterns

### Decouple stateful logic from rendering

Rendering functions should only be concerned about transforming data into HTML. React Hooks couples business logic with rendering. It is easy to read, but this coupling is eventually limiting.

```jsx
import React, { useState } from 'react'
import { render } from 'react-dom'

export function createCounter (target) {
  render(target, Counter)
}

function Counter () {
  const [count, setCount] = useState(0)
  const increment = () => setCount(count + 1)
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={increment}>
        Click me
      </button>
    </div>
  )
}
```

Instead, move all logic out of the rendering function. Use Observables to control when and how a component renders. Rendering is triggered by a subscription to an Observable (a stream of "prop" objects), rather than triggered by `useState` setters or calls to `setState`.

```jsx
import React from 'react'
import { render } from 'react-dom'
import { BehaviorSubject } from 'rxjs'
import { map, takeWhile, tap } from 'rxjs/operators'

export function createCounter (target) {
  // Store state in BehaviorSubjects.
  const count$ = new BehaviorSubject(0)
  // Define methods to set state.
  const increment = () => count$.next(count$.value + 1)
  // Set up rendering.
  const render$ = count$.pipe(
    // Transform state into props.
    map((count) => ({ count, increment }),
    // Stop rendering if the target no longer exists.
    takeWhile(() => document.body.contains(target)),
    // Render props to DOM.
    tap((props) => render(target, Counter(props)))
  )
  // Start rendering.
  render$.subscribe()
}

function Counter (props) {
  const { count, increment } = props
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={increment}>
        Click me
      </button>
    </div>
  )
}
```

Now, you can substitute React for any rendering library of your choice, without rewriting or losing any reactive logic. For example, you can use a single-purpose rendering library, such as [µhtml](https://github.com/WebReflection/uhtml).

```js
import { BehaviorSubject } from 'rxjs'
import { map, takeWhile, tap } from 'rxjs/operators'
import { html, render } from 'uhtml'

export function createCounter (target) {
  const count$ = new BehaviorSubject(defaultValue)
  const increment = () => count$.next(count$.value + 1)
  const render$ = count$.pipe(
    map((count) => ({ count, increment }),
    takeWhile(() => document.body.contains(target)),
    tap((props) => render(target, Counter(props)))
  )
  render$.subscribe()
}

// uhtml uses template strings instead of a virtual DOM.
function Counter (props) {
  const { count, increment } = props
  return html`
    <div>
      <p>You clicked ${count} times</p>
      <button onclick=${increment}>
        Click me
      </button>
    </div>
  `
}
```

### Reuse stateful logic

React Hooks can be [refactored into reusable functions](https://reactjs.org/docs/hooks-custom.html). Such functions are named in the format of `use<Thing>`. However, built-in React Hooks (such as `useState`, `useEffect`, and others) can only be called within the context of a React component.

```js
function useCount (defaultValue = 0) {
  const [count, setCount] = useState(0)
  const increment = () => setCount(count + 1)
  return { count, increment }
}
```

RxJS code can be organized in a similar way, yet it works in any context. However, this function must return an Observable instead of the raw value, so it can ultimately trigger renders or other effects.

```js
function useCount (defaultValue = 0) {
  const count$ = new BehaviorSubject(defaultValue)
  const increment = () => count$.next(count$.value + 1)
  return { count$, increment }
}
```

### Test stateful logic

[React Hooks can only be tested by explicitly rendering a component](https://reactjs.org/docs/hooks-faq.html#how-to-test-components-that-use-hooks). However, this RxJS code can be tested independently of the component, making test scripts lighter and more direct.

```js
const { count$, increment } = useCount(0)
increment()
expect(count$.value).to.equal(1)

// Note: Unlike an Observable, you can inspect the value
// of a BehaviorSubject without subscribing to it.
```

### Create props object

The most common way to pass data into a rendering function is by providing a "props" object. This object needs to be updated whenever any of its data sources change. The typical way to do this is with the [`combineLatest`](https://rxjs-dev.firebaseapp.com/api/index/function/combineLatest) operator. Given a set of Observables, it emits an array containing the latest values from those Observables. That array can then be transformed into the desired object. That new object can even contain data that was not present in the Observables.

```js
import { BehaviorSubject, combineLatest } from 'rxjs'
import { map } from 'rxjs/operators'

const a$ = new BehaviorSubject(1)
const b$ = new BehaviorSubject(1)
const c = 1

combineLatest(a$, b$).pipe(
  map(([a, b]) => ({ a, b, c }))
).subscribe(console.log)

setTimeout(() => a$.next(2), 1000)
setTimeout(() => b$.next(2), 2000)
setTimeout(() => a$.next(3), 3000)

// Console log:
// { a: 1, b: 1, c: 1 }
// { a: 2, b: 1, c: 1 }
// { a: 2, b: 2, c: 1 }
// { a: 3, b: 2, c: 1 }
```

With a lot of Observables, this mapping can become quite tedious. To resolve this, consider this custom operator called [`combineLatestObject`](./public/util/rx/combineLatestObject.js). It will inspect the provided object's values for any Observables, get their latest values, and map the values back to their original keys.

```js
import { BehaviorSubject } from 'rxjs'
import { combineLatestObject } from './combineLatestObject.js'

const a$ = new BehaviorSubject(1)
const b$ = new BehaviorSubject(1)
const c = 1

combineLatestObject({
  a: a$,
  b: b$,
  c
}).subscribe(console.log)

setTimeout(() => a$.next(2), 1000)
setTimeout(() => b$.next(2), 2000)
setTimeout(() => a$.next(3), 3000)

// Console log:
// { a: 1, b: 1, c: 1 }
// { a: 2, b: 1, c: 1 }
// { a: 2, b: 2, c: 1 }
// { a: 3, b: 2, c: 1 }
```

## Next steps

1. Develop more examples (e.g. component communication, data loading).
2. Name this pattern ("hook") and determine a naming convention (`use*`).
3. Document pattern and best practices.
4. Write unit tests for all stateful logic.

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
