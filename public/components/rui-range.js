import { BehaviorSubject } from 'rxjs'
import { define, html, renderComponent } from '../util/dom.js'
import { Range } from '../util/objects.js'
import { combineLatestObject } from '../util/rx.js'
import { useSubscribe } from '../util/use.js'

define('rui-range', (el) => {
  const [subscribe, unsubscribe] = useSubscribe()
  const range = new Range({ min: -5, max: 5, step: 1, value: 0 })
  const range$ = new BehaviorSubject(range)
  const stepDown = () => {
    range.stepDown({ wrap: true })
    range$.next(range)
  }
  const stepUp = () => {
    range.stepUp({ wrap: true })
    range$.next(range)
  }
  const props$ = combineLatestObject({
    range: range$,
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
    <p>Value: <strong>${range.get()}</strong></p>
    <div class='flex flex--gap-1 m-top-2'>
      <button onclick=${stepDown}>Step Down</button>
      <button onclick=${stepUp}>Step Up</button>
    </div>
  `
}
