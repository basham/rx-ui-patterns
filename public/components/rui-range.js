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
  `
}
