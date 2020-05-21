import { define, html, renderComponent } from '../util/dom.js'
import { useRange, useSubscribe } from '../util/use.js'

define('rui-range', (el) => {
  const [subscribe, unsubscribe] = useSubscribe()
  const range = useRange({ defaultValue: 0, min: -5, max: 5, step: 1, wrap: true })
  const render$ = range.value$.pipe(
    renderComponent(el, renderRange)
  )
  subscribe(render$)
  return unsubscribe
})

function renderRange (props) {
  const { stepDown, stepUp, value } = props
  return html`
    <hr />
    <p>Value: <strong>${value}</strong></p>
    <div class='flex flex--gap-1 m-top-2'>
      <button onclick=${stepDown}>Step Down</button>
      <button onclick=${stepUp}>Step Up</button>
    </div>
  `
}
