import { distinctUntilChanged, map, shareReplay } from 'rxjs/operators'
import { define, html, renderComponent } from '../util/dom.js'
import { Range } from '../util/objects.js'
import { combineLatestObject } from '../util/rx.js'
import { useSubscribe, useValue } from '../util/use.js'

define('rui-range-grid', (el) => {
  const [subscribe, unsubscribe] = useSubscribe()
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
    renderComponent(el, renderRangeGrid)
  )
  subscribe(render$)
  return unsubscribe
})

function createGrid ({ cols, rows }) {
  const min = 1
  const step = 1
  const value = 1
  const wrap = true
  const x = createRange({ min, max: cols, step, value, wrap })
  const y = createRange({ min, max: rows, step, value, wrap })
  const value$ = combineLatestObject({
    cols,
    rows,
    x: x.value$,
    y: y.value$
  })
  return {
    value$,
    down: y.stepUp,
    left: x.stepDown,
    right: x.stepUp,
    up: y.stepDown
  }
}

function createRange (options) {
  const range = useValue(new Range(options))
  const value$ = range.value$.pipe(
    map(({ value }) => value),
    distinctUntilChanged(),
    shareReplay(1)
  )
  return {
    value$,
    stepDown,
    stepUp
  }

  function stepDown () {
    range.get().stepDown()
    range.update()
  }

  function stepUp () {
    range.get().stepUp()
    range.update()
  }
}

function renderRangeGrid (props) {
  const { handler, grid } = props
  const { cols, rows, x, y } = grid
  return html`
    <p>This example demonstrates how to pair two <code>Range</code> objects to create a 2D coordinate.</p>
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
