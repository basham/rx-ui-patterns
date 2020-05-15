import { combineLatest, of } from 'rxjs'
import { distinctUntilChanged, map, shareReplay, switchMap } from 'rxjs/operators'
import { define, html, renderComponent } from '../util/dom.js'
import { combineLatestObject } from '../util/rx.js'
import { useBoolean, useInt, useMap, useSet, useSubscribe, useValue } from '../util/use.js'

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
  const props$ = combineLatestObject(lights.props)
  const render$ = props$.pipe(
    renderComponent(el, renderLights)
  )
  subscribe(render$)
  return unsubscribe
})

function useLights () {
  const latest = useValue()
  const lights = useMap()
  const idCounter = useInt()
  const selections = useSet()
  const lights$ = lights.values$.pipe(
    switchMap((lights) => {
      const values = lights.map((light) => light.value$)
      return values.length ? combineLatest(values) : of([])
    })
  )
  const value$ = combineLatest(
    lights$,
    selections.values$
  ).pipe(
    map(([lights, selected]) => {
      const count = lights.length
      const onCount = lights.filter(({ value }) => value === ON).length
      const offCount = lights.filter(({ value }) => value === OFF).length
      const isAllOn = onCount === count
      const isAllOff = offCount === count
      const selectedCount = selected.length
      const hasSelections = selectedCount > 0
      const isAllSelected = selectedCount === count
      const all = lights.map((light) => ({
        ...light,
        selected: selected.includes(light.id)
      }))
      return {
        all, count, onCount, offCount, isAllOn, isAllOff, selectedCount, hasSelections, isAllSelected
      }
    }),
    latest.tapSet(),
    shareReplay(1)
  )
  const methods = {
    add,
    selectAll,
    deselectAll,
    removeSelected,
    toggleAll
  }
  const props = {
    ...methods,
    add: (event) => add(OFF),
    lights: value$
  }
  return {
    value$,
    value: latest.value,
    ...methods,
    props
  }

  function add (power) {
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

  function deselectAll () {
    selections.clear()
  }

  function getId () {
    return idCounter.increment()
  }

  function removeSelected () {
    selections.values().forEach((id) => lights.delete(id))
    selections.clear()
  }

  function selectAll () {
    const ids = lights.values().map(({ id }) => id)
    selections.add(...ids)
  }

  function toggleAll () {
    const { isAllOn } = latest.value()
    const turn = isAllOn ? 'turnOff' : 'turnOn'
    lights.values().forEach((light) => light[turn]())
  }
}

function useLight (power = OFF, other = {}) {
  const latest = useValue()
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
    latest.tapSet(),
    shareReplay(1)
  )
  return {
    ...other,
    value$,
    value: latest.value,
    ...methods
  }
}

function renderLights (props) {
  const { add, selectAll, deselectAll, removeSelected, toggleAll, lights } = props
  const { count, onCount } = lights
  const { selectedCount, hasSelections, isAllSelected } = lights
  return html`
    <hr />
    <p class='m-none'>
      <span .hidden=${hasSelections}>
        ${onCount}/${count} ${powerLabels[ON]}
      </span>
      <span .hidden=${!hasSelections}>
        ${selectedCount}/${count} selected
      </span>
    </p>
    <div class='flex flex--gap-1 m-top-2'>
      <button onclick=${add}>
        Add
      </button>
      <button
        .hidden=${!count}
        onclick=${isAllSelected ? deselectAll : selectAll}>
        ${isAllSelected ? 'Deselect all' : 'Select all'}
      </button>
      <button
        .hidden=${!hasSelections}
        onclick=${removeSelected}>
        Remove
      </button>
      <button
        .hidden=${hasSelections || !count}
        onclick=${toggleAll}>
        Toggle
      </button>
    </div>
    <ol class='box width-sm'>${lights.all.map(renderLight)}</ol>
  `
}

function renderLight (props) {
  const { icon, id, key, label, select, selected, toggle, value, valueLabel } = props
  const checkboxId = `select-light-${id}`
  return html.for(key)`
    <li class='box__row flex'>
      <span class='flex flex--center flex--gap-1 flex-grow'>
        <input
          .checked=${selected}
          class='sr-only'
          id=${checkboxId}
          onchange=${select}
          type='checkbox'
          value=${id} />
        <label
          class='flex flex--center flex--gap-1'
          for=${checkboxId}>
          <rui-icon name='check' data-checkbox />
          <rui-icon name=${icon} />
          <span>${label}</span>
          <span class='sr-only'>${valueLabel}</span>
        </label>
      </span>
      <span class='flex flex--center flex--gap-1'>
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
