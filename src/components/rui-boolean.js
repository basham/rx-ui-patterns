import { define, html } from 'uce'
import { createSubscribe, createValue } from '../util/create.js'
import { connect, render } from '../util/dom.js'
import { combineLatestObject } from '../util/rx.js'

define('rui-boolean', connect(init))

function init (el) {
  const [subscribe, unsubscribe] = createSubscribe()
  const bool = createValue(false)
  const toTrue = () => bool.set(true)
  const toFalse = () => bool.set(false)
  const toggle = () => bool.set(!bool.get())
  const props$ = combineLatestObject({
    value: bool.value$,
    toTrue,
    toFalse,
    toggle
  })
  const render$ = props$.pipe(
    render(el, renderBoolean)
  )
  subscribe(render$)
  return unsubscribe
}

function renderBoolean (props) {
  const { value, toTrue, toFalse, toggle } = props
  return html`
    <hr />
    <p>Value: <strong>${value}</strong></p>
    <div class='flex flex--gap-1 m-top-2'>
      <button onclick=${toggle}>Toggle</button>
      <button onclick=${toTrue}>True</button>
      <button onclick=${toFalse}>False</button>
    </div>
  `
}
