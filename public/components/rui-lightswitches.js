import { BehaviorSubject } from 'rxjs'
import { map, shareReplay, distinctUntilChanged } from 'rxjs/operators'
import { define, html, renderComponent } from '../util/dom.js'
import { combineLatestObject } from '../util/rx.js'
import { useKeychain, useLatest, useMap, useSubscribe } from '../util/use.js'

const ON = true
const OFF = false

const powerLabels = {
  [ON]: 'On',
  [OFF]: 'Off'
}

define('rui-lightswitches', (el) => {
  const [subscribe, unsubscribe] = useSubscribe()
  const lights = useLightSwitches()
  lights.add(ON)
  const props$ = combineLatestObject({
    addLight: () => lights.add(OFF),
    toggleAll: lights.toggleAll,
    lights: lights.latest$
  })
  const render$ = props$.pipe(
    renderComponent(el, renderRoom)
  )
  subscribe(render$)
  return unsubscribe
})

function useLightSwitches () {
  const latest = useLatest()
  const lightSwitches = useMap()
  const createKey = useKeychain('L')
  const add = (power) => {
    const key = createKey()
    const remove = () => lightSwitches.delete(key)
    const lightSwitch = useLightSwitch(power, { key, remove })
    lightSwitches.set(key, lightSwitch)
  }
  const toggleAll = () => {
    const { isAllOn } = latest.value
    const turn = isAllOn ? 'turnOff' : 'turnOn'
    lightSwitches.forEach((ls) => ls[turn]())
  }
  const latestValues$ = lightSwitches.latestValues((ls) => ls.latest$)
  const latest$ = latestValues$.pipe(
    map((list) => {
      const count = list.length
      const onCount = list.filter(({ value }) => value === ON).length
      const offCount = list.filter(({ value }) => value === OFF).length
      const isAllOn = onCount === count
      const isAllOff = offCount === count
      return {
        list, count, onCount, offCount, isAllOn, isAllOff
      }
    }),
    latest.update(),
    shareReplay(1)
  )
  return {
    latest$,
    get latest () {
      return latest.value
    },
    add,
    toggleAll
  }
}

function useLightSwitch (power = OFF, other = {}) {
  const latest = useLatest()
  const light$ = new BehaviorSubject(power)
  const toggle = () => light$.next(!light$.value)
  const turnOn = () => light$.next(ON)
  const turnOff = () => light$.next(OFF)
  const latest$ = light$.pipe(
    distinctUntilChanged(),
    map((value) => ({
      value,
      label: powerLabels[value],
      toggle,
      turnOn,
      turnOff,
      ...other
    })),
    latest.update(),
    shareReplay(1)
  )
  return {
    latest$,
    get latest () {
      return latest.value
    },
    toggle,
    turnOn,
    turnOff,
    ...other
  }
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

// https://feathericons.com/
// https://github.com/feathericons/feather
function renderIcon (name) {
  const href = `/icons.svg#${name}`
  return html`
    <svg aria-hidden='true'>
      <use href=${href}></use>
    </svg>
  `
}
