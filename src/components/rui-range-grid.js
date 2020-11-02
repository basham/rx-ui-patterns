import { css, define, html } from 'uce'
import { createRange, createSubscribe } from '../util/create.js'
import { connect, render } from '../util/dom.js'
import { combineLatestObject } from '../util/rx.js'

define('rui-range-grid', {
  ...connect(init),
  style
})

function init (el) {
  const [subscribe, unsubscribe] = createSubscribe()
  const grid = createGrid({ cols: 8, rows: 8 })
  const arrowHandlers = {
    ArrowDown: grid.down,
    ArrowLeft: grid.left,
    ArrowRight: grid.right,
    ArrowUp: grid.up
  }
  const handler = (event) => {
    const { key } = event
    const arrowHandler = arrowHandlers[key]
    if (arrowHandler) {
      arrowHandler()
    }
  }
  const props$ = combineLatestObject({
    handler,
    grid: grid.value$
  })
  const render$ = props$.pipe(
    render(el, renderRangeGrid)
  )
  subscribe(render$)
  return unsubscribe
}

function createGrid ({ cols, rows }) {
  const options = { defaultValue: 1, min: 1, step: 1, wrap: true }
  const x = createRange({ ...options, max: cols })
  const y = createRange({ ...options, max: rows })
  const value$ = combineLatestObject({
    cols,
    rows,
    x: x.value.value$,
    y: y.value.value$
  })
  return {
    cols,
    down: y.stepUp,
    left: x.stepDown,
    right: x.stepUp,
    rows,
    up: y.stepDown,
    value$,
    x,
    y
  }
}

function renderRangeGrid (props) {
  const { handler, grid } = props
  const { cols, rows, x, y } = grid
  return html`
    <p>Pair two <a href='/util/create/createRange.js'><code>createRange</code></a> hooks to create a 2D grid.</p>
    <p>Move focus to the grid. Use arrow keys to navigate.</p>
    <hr />
    <div
      class='grid'
      onkeyup=${handler}
      style=${`--cols: ${cols}; --rows: ${rows};`}
      tabindex='0'>
      <div
        class='grid__cell'
        style=${`--x: ${x}; --y: ${y};`}>
      </div>
    </div>
  `
}

function style (selector) {
  return css`
    ${selector} .grid {
      --border-width: var(--px-1);
      --full-border-width: calc(var(--border-width) * 2);
      --size: var(--space-3);
      --border-offset: calc(var(--size) - var(--border-width));
      background-image:
        linear-gradient(to right, var(--color-black-1) var(--full-border-width), transparent 0),
        linear-gradient(to bottom, var(--color-black-1) var(--full-border-width), transparent 0);
      background-position: var(--border-offset) var(--border-offset);
      background-size: var(--size) var(--size);
      border: var(--border-width) solid var(--color-black-1);
      box-sizing: content-box;
      height: calc(var(--size) * var(--rows));
      position: relative;
      width: calc(var(--size) * var(--cols));
    }

    ${selector} .grid__cell {
      background-color: var(--color-blue);
      height: var(--size);
      left: calc(var(--size) * (var(--x) - 1));
      position: absolute;
      top: calc(var(--size) * (var(--y) - 1));
      width: var(--size);
    }
  `
}
