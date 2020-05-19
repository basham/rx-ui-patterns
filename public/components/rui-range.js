import { define, html, renderComponent } from '../util/dom.js'
import { Range } from '../util/objects.js'
import { combineLatestObject } from '../util/rx.js'
import { useSubscribe, useValue } from '../util/use.js'

define('rui-range', (el) => {
  const [subscribe, unsubscribe] = useSubscribe()
  const options = { min: -5, max: 5, step: 1, value: 0, wrap: true }
  const range = useValue(new Range(options))
  const stepDown = () => {
    range.get().stepDown()
    range.update()
  }
  const stepUp = () => {
    range.get().stepUp()
    range.update()
  }
  const props$ = combineLatestObject({
    range: range.value$,
    stepDown,
    stepUp
  })
  const render$ = props$.pipe(
    renderComponent(el, renderRange)
  )
  subscribe(render$)
  return unsubscribe
})

function renderRange (props) {
  const { range, stepDown, stepUp } = props
  return html`
    <hr />
    <p>Value: <strong>${range.value}</strong></p>
    <div class='flex flex--gap-1 m-top-2'>
      <button onclick=${stepDown}>Step Down</button>
      <button onclick=${stepUp}>Step Up</button>
    </div>
  `
}
