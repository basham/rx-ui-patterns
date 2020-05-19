import { define, html, renderComponent } from '../util/dom.js'
import { Mode } from '../util/objects.js'
import { combineLatestObject } from '../util/rx.js'
import { useSubscribe, useValue } from '../util/use.js'

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
  const mode = useValue(new Mode({ modes: MODES }))
  const methods = {
    previous: () => {
      mode.get().previous()
      mode.update()
    },
    previousWrap: () => {
      mode.get().previous({ wrap: true })
      mode.update()
    },
    next: () => {
      mode.get().next()
      mode.update()
    },
    nextWrap: () => {
      mode.get().next({ wrap: true })
      mode.update()
    },
    toRed: () => {
      mode.get().value = MODE_RED
      mode.update()
    },
    toYellow: () => {
      mode.get().value = MODE_YELLOW
      mode.update()
    },
    toGreen: () => {
      mode.get().value = MODE_GREEN
      mode.update()
    }
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
    mode: mode.value$
  })
  const render$ = props$.pipe(
    renderComponent(el, renderMode)
  )
  subscribe(render$)
  return unsubscribe
})

function renderMode (props) {
  const { handler, mode } = props
  return html`
    <p>Mode values must be set to an option within a given sequence of options.</p>
    <p>This example is configured for 3 options (red, yellow, green).</p>
    <hr />
    <p>Value: <strong>${mode.value}</strong></p>
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
