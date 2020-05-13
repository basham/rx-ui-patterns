import { define, html, renderComponent } from '../util/dom.js'
import { combineLatestObject } from '../util/rx.js'
import { useInt, useSubscribe } from '../util/use.js'

define('rui-int', (el) => {
  const [subscribe, unsubscribe] = useSubscribe()
  const bool = useInt()
  const props$ = combineLatestObject({
    value: bool.value$,
    increment: bool.increment,
    decrement: bool.decrement
  })
  const render$ = props$.pipe(
    renderComponent(el, renderBoolean)
  )
  subscribe(render$)
  return unsubscribe
})

function renderBoolean (props) {
  const { value, increment, decrement } = props
  return html`
    <h1>useInt</h1>
    <p>Value: <strong>${value}</strong></p>
    <div>
      <button onclick=${increment}>Increment</button>
      <button onclick=${decrement}>Decrement</button>
    </div>
  `
}
