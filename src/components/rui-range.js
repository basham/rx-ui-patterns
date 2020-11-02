import { define, html } from 'uce'
import { createRange, createSubscribe } from '../util/create.js'
import { connect, render } from '../util/dom.js'

define('rui-range', connect(init))

function init (el) {
  const [subscribe, unsubscribe] = createSubscribe()
  const range = createRange({ defaultValue: 0, min: -5, max: 5, step: 1, wrap: true })
  const render$ = range.value$.pipe(
    render(el, renderRange)
  )
  subscribe(render$)
  return unsubscribe
}

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
