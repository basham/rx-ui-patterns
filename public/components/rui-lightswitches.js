import { BehaviorSubject } from 'rxjs'
import { map, shareReplay, distinctUntilChanged } from 'rxjs/operators'
import { define, html, renderComponent } from '../util/dom.js'
import { combineLatestObject } from '../util/rx.js'
import { useIncrementor, useLatest, useMap, useSubscribe } from '../util/use.js'

const ON = true
const OFF = false

const powerIcons = {
  [ON]: 'sun',
  [OFF]: 'moon'
}

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
  const getId = useIncrementor(1)
  const add = (power) => {
    const id = getId()
    const remove = () => lightSwitches.delete(id)
    const lightSwitch = useLightSwitch(power, { id, remove })
    lightSwitches.set(id, lightSwitch)
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
      icon: powerIcons[value],
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
    <div class='flex flex--gap-sm m-top'>
      <button onclick=${addLight}>Add light</button>
      <button onclick=${toggleAll} hidden=${lights.count ? null : true}>Toggle all</button>
    </div>
    <ol class='box width-sm'>${lights.list.map(renderLight)}</ol>
  `
}

function renderLight (props) {
  const { id, icon, label, remove, toggle } = props
  return html`
    <li class='box__row flex'>
      <span class='flex flex--center flex--gap-sm flex-grow'>
        <strong>${id}:</strong>
        <rui-icon name=${icon} />
        <span>${label}</span>
      </span>
      <span class='flex flex--gap-sm'>
        <button onclick=${toggle}>Toggle</button>
        <button onclick=${remove} class='button button--icon'>
          <rui-icon name='x' />
          <span class='sr-only'>Remove</span>
        </button>
      </span>
    </li>
  `
}
