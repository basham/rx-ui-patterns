import { define, html, renderComponent } from '../util/dom.js'
import { combineLatestObject } from '../util/rx.js'
import { useMode, useSubscribe } from '../util/use.js'

const MODE_RED = '1. Red'
const MODE_YELLOW = '2. Yellow'
const MODE_GREEN = '3. Green'
const MODES = [
  MODE_RED,
  MODE_YELLOW,
  MODE_GREEN
]

define('rui-mode', (el) => {
  const [subscribe, unsubscribe] = useSubscribe()
  const mode = useMode(MODES)
  const methods = {
    previous: mode.previous,
    previousWrap: () => mode.previous({ wrap: true }),
    next: mode.next,
    nextWrap: () => mode.next({ wrap: true }),
    toRed: () => mode.set(MODE_RED),
    toYellow: () => mode.set(MODE_YELLOW),
    toGreen: () => mode.set(MODE_GREEN)
  }
  const handler = (event) => {
    const { type } = event.target.dataset
    const method = methods[type]
    if (method) {
      method()
    }
  }
  const props$ = combineLatestObject({
    handler,
    value: mode.value$
  })
  const render$ = props$.pipe(
    renderComponent(el, renderMode)
  )
  subscribe(render$)
  return unsubscribe
})

function renderMode (props) {
  const { handler, value } = props
  return html`
    <h1>useMode</h1>
    <p>Mode values must be set to an option within a given sequence of options.</p>
    <p>This example is configured for 3 options (red, yellow, green).</p>
    <p><a href='/components/rui-mode.js'>Source code</a></p>
    <hr />
    <p>Value: <strong>${value}</strong></p>
    <div class='flex flex--gap-1 m-top-2'>
      ${renderButton({ handler, label: 'Previous', type: 'previous' })}
      ${renderButton({ handler, label: 'Next', type: 'next' })}
    </div>
    <div class='flex flex--gap-1 m-top-2'>
      ${renderButton({ handler, label: 'Previous (wrap)', type: 'previousWrap' })}
      ${renderButton({ handler, label: 'Next (wrap)', type: 'nextWrap' })}
    </div>
    <div class='flex flex--gap-1 m-top-2'>
      ${renderButton({ handler, label: 'Red', type: 'toRed' })}
      ${renderButton({ handler, label: 'Yellow', type: 'toYellow' })}
      ${renderButton({ handler, label: 'Green', type: 'toGreen' })}
    </div>
  `
}

function renderButton (props) {
  const { handler, label, type } = props
  return html`
    <button
      data-type=${type}
      onclick=${handler}>
      ${label}
    </button>
  `
}
