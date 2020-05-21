import { define, html, renderComponent } from '../util/dom.js'
import { combineLatestObject } from '../util/rx.js'
import { useRange, useSubscribe } from '../util/use.js'

define('rui-range-grid', (el) => {
  const [subscribe, unsubscribe] = useSubscribe()
  const grid = useGrid({ cols: 8, rows: 8 })
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
    renderComponent(el, renderRangeGrid)
  )
  subscribe(render$)
  return unsubscribe
})

function useGrid ({ cols, rows }) {
  const options = { defaultValue: 1, min: 1, step: 1, wrap: true }
  const x = useRange({ ...options, max: cols })
  const y = useRange({ ...options, max: rows })
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
    <p>Pair two <a href='/util/use/useRange.js'><code>useRange</code></a> hooks to create a 2D grid.</p>
    <p>Move focus to the grid. Use arrow keys to navigate.</p>
    <hr />
    <style>
      rui-range-grid .grid {
        --border-width: calc(1rem/16);
        --full-border-width: calc(var(--border-width) * 2);
        --size: 1rem;
        --border-offset: calc(var(--size) - var(--border-width));
        background-image:
          linear-gradient(to right, var(--color-light-gray) var(--full-border-width), transparent 0),
          linear-gradient(to bottom, var(--color-light-gray) var(--full-border-width), transparent 0);
        background-position: var(--border-offset) var(--border-offset);
        background-size: var(--size) var(--size);
        border: var(--border-width) solid var(--color-light-gray);
        box-sizing: content-box;
        height: calc(var(--size) * var(--rows));
        position: relative;
        width: calc(var(--size) * var(--cols));
      }

      rui-range-grid .grid__cell {
        background-color: var(--color-blue);
        height: var(--size);
        left: calc(var(--size) * (var(--x) - 1));
        position: absolute;
        top: calc(var(--size) * (var(--y) - 1));
        width: var(--size);
      }
    </style>
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
