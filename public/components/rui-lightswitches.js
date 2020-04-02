import { BehaviorSubject } from 'rxjs'
import { map, shareReplay, distinctUntilChanged, tap } from 'rxjs/operators'
import { define, html } from 'uce'
import { combineLatestObject, debug, renderComponent, useKeychain, useList, useSubscribe, withProperties } from '../util.js'

const ON = true
const OFF = false

const powerLabels = {
  [ON]: 'On',
  [OFF]: 'Off'
}

define('rui-lightswitches', {
  init () {
    const [ subscribe, unsubscribe ] = useSubscribe()
    const lights$ = useLightSwitches()
    lights$.add(ON)
    const props$ = combineLatestObject({
      addLight: () => lights$.add(OFF),
      toggleAll: lights$.toggle,
      lights: lights$,
    })
    const render$ = props$.pipe(
      renderComponent(this, renderRoom)
    )
    subscribe(render$)
    this.unsubscribe = unsubscribe
  },
  disconnected () {
    this.unsubscribe()
  }
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
    <h1>Room lights (${lights.onCount}/${lights.count})</h1>
    <button onclick=${addLight}>Add light</button>
    <button onclick=${toggleAll} hidden=${lights.count ? null : true}>Toggle all</button>
    <ol>${lights.list.map(renderLight)}</ol>
  `
}

function renderLight (props) {
  const { key, label, remove, toggle } = props
  return html`
    <li>
      <span>Light ${key}: ${label}</span>
      <button onclick=${toggle}>Toggle</button>
      <button onclick=${remove}>Remove</button>
    </li>
  `
}
