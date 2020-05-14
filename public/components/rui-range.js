import { define, html, renderComponent } from '../util/dom.js'
import { combineLatestObject } from '../util/rx.js'
import { useRange, useSubscribe } from '../util/use.js'

define('rui-range', (el) => {
  const [subscribe, unsubscribe] = useSubscribe()
  const range = useRange(0, { min: -5, max: 5, step: 1 })
  const props$ = combineLatestObject({
    value: range.value$,
    stepDown: () => range.stepDown({ wrap: true }),
    stepUp: () => range.stepUp({ wrap: true })
  })
  const render$ = props$.pipe(
    renderComponent(el, renderRange)
  )
  subscribe(render$)
  return unsubscribe
})

function renderRange (props) {
  const { value, stepDown, stepUp } = props
  return html`
    <p>Value: <strong>${value}</strong></p>
    <div class='flex flex--gap-1'>
      <button onclick=${stepDown}>Step Down</button>
      <button onclick=${stepUp}>Step Up</button>
    </div>
    <rui-range-grid />
  `
}

define('rui-range-grid', (el) => {
  const [subscribe, unsubscribe] = useSubscribe()
  const cols = 8
  const rows = 8
  const min = 1
  const step = 1
  const x = useRange(min, { min, max: cols, step })
  const y = useRange(min, { min, max: rows, step })
  const arrowHandlers = {
    ArrowDown: () => y.stepUp({ wrap: true }),
    ArrowLeft: () => x.stepDown({ wrap: true }),
    ArrowRight: () => x.stepUp({ wrap: true }),
    ArrowUp: () => y.stepDown({ wrap: true })
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
    cols,
    rows,
    x: x.value$,
    y: y.value$
  })
  const render$ = props$.pipe(
    renderComponent(el, renderRangeGrid)
  )
  subscribe(render$)
  return unsubscribe
})

function renderRangeGrid (props) {
  const { handler, cols, rows, x, y } = props
  return html`
    <h2>Grid example</h2>
    <p>Use arrow keys to navigate around the grid.</p>
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
