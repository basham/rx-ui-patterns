import { BehaviorSubject } from 'rxjs'
import { map, shareReplay, distinctUntilChanged, tap } from 'rxjs/operators'
import { define, html, renderComponent, svg } from '../util/dom.js'
import { combineLatestObject, debug } from '../util/rx.js'
import { useKeychain, useList, useSubscribe } from '../util/use.js'
import { withProperties } from '../util/with.js'

const ON = true
const OFF = false

const powerLabels = {
  [ON]: 'On',
  [OFF]: 'Off'
}

define('rui-lightswitches', (el) => {
  const [ subscribe, unsubscribe ] = useSubscribe()
  const lights$ = useLightSwitches()
  lights$.add(ON)
  const props$ = combineLatestObject({
    addLight: () => lights$.add(OFF),
    toggleAll: lights$.toggle,
    lights: lights$,
  })
  const render$ = props$.pipe(
    renderComponent(el, renderRoom)
  )
  subscribe(render$)
  return unsubscribe
})

function useLightSwitches () {
  let output = null
  const list$ = useList()
  const createKey = useKeychain('L')
  const add = (power) => {
    const key = createKey()
    const remove = () => list$.remove(key)
    const lightSwitch$ = useLightSwitch(power, { key, remove })
    list$.set(key, lightSwitch$)
  }
  const toggle = () => {
    const { isAllOn } = output
    const turn = isAllOn ? 'turnOff' : 'turnOn'
    list$.value.forEach((light$) => light$[turn]())
  }
  const output$ = list$.pipe(
    map((list) => {
      const count = list.length
      const onCount = list.filter(({ value }) => value === ON).length
      const offCount = list.filter(({ value }) => value === OFF).length
      const isAllOn = onCount === count
      const isAllOff = offCount === count
      return {
        list, count, onCount, offCount, isAllOn, isAllOff, add
      }
    }),
    tap((v) => output = v),
    shareReplay(1)
  )
  return withProperties(output$, {
    add: () => add,
    toggle: () => toggle
  })
}

function useLightSwitch (power = OFF, other = {}) {
  const light$ = new BehaviorSubject(power)
  const toggle = () => light$.next(!light$.value)
  const turnOn = () => light$.next(ON)
  const turnOff = () => light$.next(OFF)
  const output$ = light$.pipe(
    distinctUntilChanged(),
    map((value) => ({
      value,
      label: powerLabels[value],
      toggle,
      turnOn,
      turnOff,
      ...other
    })),
    shareReplay(1)
  )
  return withProperties(output$, {
    toggle: () => toggle,
    turnOn: () => turnOn,
    turnOff: () => turnOff
  })
}

function renderRoom (props) {
  const { addLight, toggleAll, lights } = props
  return html`
    <h2>Room lights (${lights.onCount}/${lights.count} on)</h2>
    <div class='group m-top'>
      <button onclick=${addLight}>Add light</button>
      <button onclick=${toggleAll} hidden=${lights.count ? null : true}>Toggle all</button>
    </div>
    <ol class='box width-sm'>${lights.list.map(renderLight)}</ol>
  `
}

function renderLight (props) {
  const { key, label, remove, toggle } = props
  return html`
    <li class='box__row flex-space-between'>
      <span><strong>${key}:</strong> ${label}</span>
      <span class='group'>
        <button onclick=${toggle}>Toggle</button>
        <button onclick=${remove} class='button button--icon'>
          ${renderIcon('x')}
          <span class='sr-only'>Remove</span>
        </button>
      </span>
    </li>
  `
}

const x = svg`<use xlink:href='/icons.svg#x'></use>`
const icons = { x }

// https://feathericons.com/
// https://github.com/feathericons/feather
function renderIcon (name) {
  return html`
    <svg aria-hidden='true'>
      ${icons[name]}
    </svg>
  `
}
