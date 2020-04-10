import { map, shareReplay, distinctUntilChanged } from 'rxjs/operators'
import { define, html, renderComponent } from '../util/dom.js'
import { combineLatestObject } from '../util/rx.js'
import { useIncrementor, useLatest, useMap, useMode, useSubscribe } from '../util/use.js'

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

define('rui-lights', (el) => {
  const [subscribe, unsubscribe] = useSubscribe()
  const lights = useLights()
  lights.add(ON)
  const props$ = combineLatestObject({
    addLight: () => lights.add(OFF),
    toggleAll: lights.toggleAll,
    lights: lights.latest$
  })
  const render$ = props$.pipe(
    renderComponent(el, renderLights)
  )
  subscribe(render$)
  return unsubscribe
})

function useLights () {
  const latest = useLatest()
  const lights = useMap()
  const getId = useIncrementor(1)
  const add = (power) => {
    const id = getId()
    const label = `Light ${id}`
    const remove = () => lights.delete(id)
    const light = useLight(power, { id, label, remove })
    lights.set(id, light)
  }
  const toggleAll = () => {
    const { isAllOn } = latest.value
    const turn = isAllOn ? 'turnOff' : 'turnOn'
    lights.forEach((light) => light[turn]())
  }
  const latestValues$ = lights.latestValues((light) => light.latest$)
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

function useLight (power = OFF, other = {}) {
  const latest = useLatest()
  const mode = useMode([OFF, ON], power)
  const toggle = () => mode.set(mode.value === ON ? OFF : ON)
  const turnOn = () => mode.set(ON)
  const turnOff = () => mode.set(OFF)
  const latest$ = mode.value$.pipe(
    distinctUntilChanged(),
    map((value) => ({
      value,
      icon: powerIcons[value],
      valueLabel: powerLabels[value],
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

function renderLights (props) {
  const { addLight, toggleAll, lights } = props
  const hideIfNoLights = lights.count ? null : true
  return html`
    <div class='flex flex--center width-sm m-top-md'>
      <div class='flex flex--center flex--gap-sm flex-grow'>
        <h2 class='m-none'>Lights</h2>
        <p class='m-none' hidden=${hideIfNoLights}>
          ${lights.onCount}/${lights.count} ${powerLabels[ON]}
        </p>
      </div>
      <div class='flex flex--center flex--gap-sm'>
        <button onclick=${toggleAll} hidden=${hideIfNoLights}>
          Toggle all
        </button>
        <button onclick=${addLight} class='button button--icon'>
          <rui-icon name='plus' />
          <span class='sr-only'>Add light</span>
        </button>
      </div>
    </div>
    <ol class='box width-sm'>${lights.list.map(renderLight)}</ol>
  `
}

function renderLight (props) {
  const { id, icon, label, remove, toggle, value } = props
  return html`
    <li class='box__row flex'>
      <span class='flex flex--center flex--gap-sm flex-grow'>
      <rui-icon name=${icon} />
        <strong>${id}</strong>
      </span>
      <span class='flex flex--center flex--gap-sm'>
        <button
          aria-checked=${value === ON}
          aria-label=${label}
          onclick=${toggle}
          role='switch'>
          <span data-checked='true'>On</span>
          <span data-checked='false'>Off</span>
        </button>
        <button
          class='button button--icon'
          onclick=${remove}>
          <rui-icon name='x' />
          <span class='sr-only'>
            ${`Remove ${label}`}
          </span>
        </button>
      </span>
    </li>
  `
}
