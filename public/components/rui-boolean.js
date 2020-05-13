import { define, html, renderComponent } from '../util/dom.js'
import { combineLatestObject } from '../util/rx.js'
import { useBoolean, useSubscribe } from '../util/use.js'

define('rui-boolean', (el) => {
  const [subscribe, unsubscribe] = useSubscribe()
  const bool = useBoolean()
  const props$ = combineLatestObject({
    value: bool.value$,
    toTrue: bool.toTrue,
    toFalse: bool.toFalse,
    toggle: bool.toggle
  })
  const render$ = props$.pipe(
    renderComponent(el, renderBoolean)
  )
  subscribe(render$)
  return unsubscribe
})

function renderBoolean (props) {
  const { value, toTrue, toFalse, toggle } = props
  return html`
    <h1>useBoolean</h1>
    <p>Value: <strong>${value}</strong></p>
    <div>
      <button onclick=${toggle}>Toggle</button>
      <button onclick=${toTrue}>True</button>
      <button onclick=${toFalse}>False</button>
    </div>
  `
}
