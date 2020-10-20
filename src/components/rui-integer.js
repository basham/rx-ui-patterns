import { define, html } from 'uce'
import { connect, render } from '../util/dom.js'
import { combineLatestObject } from '../util/rx.js'
import { useSubscribe, useValue } from '../util/use.js'

define('rui-integer', connect(init))

function init (el) {
  const [subscribe, unsubscribe] = useSubscribe()
  const int = useValue(0)
  const increment = () => int.set(int.get() + 1)
  const decrement = () => int.set(int.get() - 1)
  const props$ = combineLatestObject({
    value: int.value$,
    increment,
    decrement
  })
  const render$ = props$.pipe(
    render(el, renderBoolean)
  )
  subscribe(render$)
  return unsubscribe
}

function renderBoolean (props) {
  const { value, increment, decrement } = props
  return html`
    <hr />
    <p>Value: <strong>${value}</strong></p>
    <div class='flex flex--gap-1 m-top-2'>
      <button onclick=${increment}>Increment</button>
      <button onclick=${decrement}>Decrement</button>
    </div>
  `
}
