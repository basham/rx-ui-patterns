import { combineLatest, of } from 'rxjs'
import { distinctUntilChanged, map, shareReplay, switchMap } from 'rxjs/operators'
import { define, html, renderComponent } from '../util/dom.js'
import { combineLatestObject } from '../util/rx.js'
import { useBoolean, useInt, useLatest, useMap, useSet, useSubscribe } from '../util/use.js'

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
  const lights = useLights(el)
  lights.add(ON)
  const props$ = combineLatestObject({
    addLight: () => lights.add(OFF),
    selectAll: lights.selectAll,
    deselectAll: lights.deselectAll,
    removeSelected: lights.removeSelected,
    toggleAll: lights.toggleAll,
    lights: lights.value$
  })
  const render$ = props$.pipe(
    renderComponent(el, renderLights)
  )
  subscribe(render$)
  return unsubscribe
})

function useLights (el) {
  const latest = useLatest()
  const lights = useMap()
  const idCounter = useInt()
  const getId = () => idCounter.increment()
  const selections = useSet()
  const getCheckbox = (id) => el.querySelector(`input[type="checkbox"][value="${id}"]`)
  const selectAll = () => {
    const ids = lights.values.map(({ id }) => id)
    ids.forEach((id) => {
      getCheckbox(id).checked = true
    })
    selections.add(...ids)
  }
  const deselectAll = () => {
    selections.values.forEach((id) => {
      getCheckbox(id).checked = false
    })
    selections.clear()
  }
  const removeSelected = () => {
    selections.values.forEach((id) => lights.delete(id))
    selections.clear()
  }
  const add = (power) => {
    const id = getId()
    const key = {}
    const label = `Light ${id}`
    const select = (e) => {
      const { checked } = e.target
      const method = checked ? 'add' : 'delete'
      selections[method](id)
    }
    const light = useLight(power, { id, key, label, select })
    lights.set(id, light)
  }
  const toggleAll = () => {
    const { isAllOn } = latest.value
    const turn = isAllOn ? 'turnOff' : 'turnOn'
    lights.values.forEach((light) => light[turn]())
  }
  const lights$ = lights.values$.pipe(
    switchMap((lights) => {
      const values = lights.map((light) => light.value$)
      return values.length ? combineLatest(values) : of([])
    })
  )
  const value$ = combineLatest(
    lights$,
    selections.size$
  ).pipe(
    map(([all, selectedCount]) => {
      const count = all.length
      const onCount = all.filter(({ value }) => value === ON).length
      const offCount = all.filter(({ value }) => value === OFF).length
      const isAllOn = onCount === count
      const isAllOff = offCount === count
      const hasSelections = selectedCount > 0
      const isAllSelected = selectedCount === count
      return {
        all, count, onCount, offCount, isAllOn, isAllOff, selectedCount, hasSelections, isAllSelected
      }
    }),
    latest.update(),
    shareReplay(1)
  )
  return {
    get value () {
      return latest.value
    },
    add,
    selectAll,
    deselectAll,
    removeSelected,
    toggleAll,
    value$
  }
}

function useLight (power = OFF, other = {}) {
  const latest = useLatest()
  const powered = useBoolean(power)
  const methods = {
    toggle: powered.toggle,
    turnOn: powered.toTrue,
    turnOff: powered.toFalse
  }
  const value$ = powered.value$.pipe(
    distinctUntilChanged(),
    map((value) => ({
      ...other,
      ...methods,
      value,
      icon: powerIcons[value],
      valueLabel: powerLabels[value]
    })),
    latest.update(),
    shareReplay(1)
  )
  return {
    ...other,
    ...methods,
    get value () {
      return latest.value
    },
    value$
  }
}

function renderLights (props) {
  const { addLight, selectAll, deselectAll, removeSelected, toggleAll, lights } = props
  const { count, onCount } = lights
  const { selectedCount, hasSelections, isAllSelected } = lights
  return html`
    <h2>Lights</h2>
    <p class='m-none'>
      <span hidden=${hide(hasSelections)}>
        ${onCount}/${count} ${powerLabels[ON]}
      </span>
      <span hidden=${hide(!hasSelections)}>
        ${selectedCount}/${count} selected
      </span>
    </p>
    <div class='flex flex--gap-sm m-top-sm'>
      <button onclick=${addLight}>
        Add
      </button>
      <button onclick=${isAllSelected ? deselectAll : selectAll} hidden=${hide(!count)}>
        ${isAllSelected ? 'Deselect all' : 'Select all'}
      </button>
      <button onclick=${removeSelected} hidden=${hide(!hasSelections)}>
        Remove
      </button>
      <button onclick=${toggleAll} hidden=${hide(hasSelections || !count)}>
        Toggle
      </button>
    </div>
    <ol class='box width-sm'>${lights.all.map(renderLight)}</ol>
  `
}

function renderLight (props) {
  const { icon, id, key, label, select, toggle, value, valueLabel } = props
  const checkboxId = `select-light-${id}`
  return html.for(key)`
    <li class='box__row flex'>
      <span class='flex flex--center flex--gap-sm flex-grow'>
        <input id=${checkboxId} type='checkbox' onchange=${select} value=${id} class='sr-only' />
        <label for=${checkboxId} class='flex flex--center flex--gap-sm'>
          <rui-icon name='check' data-checkbox />
          <rui-icon name=${icon} />
          <span>${label}</span>
          <span class='sr-only'>${valueLabel}</span>
        </label>
      </span>
      <span class='flex flex--center flex--gap-sm'>
        <button
          aria-checked=${value === ON}
          aria-label=${label}
          onclick=${toggle}
          role='switch'>
          <span data-checked='true'>
            ${powerLabels[ON]}
          </span>
          <span data-checked='false'>
            ${powerLabels[OFF]}
          </span>
        </button>
      </span>
    </li>
  `
}

function hide (h) {
  return h ? true : null
}
