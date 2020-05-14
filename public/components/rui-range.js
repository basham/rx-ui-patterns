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
    <h1>useRange</h1>
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
        --size: 1rem;
        display: grid;
        grid-template-columns: repeat(var(--cols), var(--size));
        grid-template-rows: repeat(var(--rows), var(--size));
        width: fit-content;
      }

      rui-range-grid .grid__cell {
        border: calc(3rem/16) solid var(--color-light-gray);
        height: 100%;
        width: 100%;
      }

      rui-range-grid .grid__cell[data-selected="true"] {
        background-color: var(--color-blue);
        border-color: var(--color-blue);
      }
    </style>
    <div
      class='grid'
      onkeyup=${handler}
      tabindex='0'
      style=${`--cols: ${cols}; --rows: ${rows};`}>
      ${range(1, rows).map((row) =>
        html`${
          range(1, cols).map((col) =>
            html`
              <div
                class='grid__cell'
                data-col=${col}
                data-row=${row}
                data-selected=${x === col && y === row}>
              </div>
            `
          )
        }`
      )}
    </div>
  `
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from
function range (start, stop, step = 1) {
  return Array.from(
    { length: (stop - start) / step + 1 },
    (_, i) => start + (i * step)
  )
}
