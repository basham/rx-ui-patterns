import { combineLatest, of } from 'rxjs'
import { distinctUntilChanged, map, shareReplay, switchMap } from 'rxjs/operators'
import { define, html } from 'uce'
import { connect, render } from '../util/dom.js'
import { combineLatestObject } from '../util/rx.js'
import { useSubscribe, useValue } from '../util/use.js'

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

define('rui-lights', connect(init))

function init (el) {
  const [subscribe, unsubscribe] = useSubscribe()
  const lights = useLights()
  lights.add(ON)
  const props$ = combineLatestObject(lights.props)
  const render$ = props$.pipe(
    render(el, renderLights)
  )
  subscribe(render$)
  return unsubscribe
}

function useLights () {
  const latest = useValue()
  const lightsMap = useValue(new Map())
  const idCounter = useValue(0)
  const selections = useValue(new Set())
  const lights$ = lightsMap.get$.pipe(
    map((lightsMap) => [...lightsMap.values()]),
    switchMap((lights) => {
      const values = lights.map((light) => light.get$)
      return values.length ? combineLatest(values) : of([])
    })
  )
  const value$ = combineLatest(
    lights$,
    selections.get$
  ).pipe(
    map(([lights, selections]) => {
      const count = lights.length
      const onCount = lights.filter(({ value }) => value === ON).length
      const offCount = lights.filter(({ value }) => value === OFF).length
      const isAllOn = onCount === count
      const isAllOff = offCount === count
      const selectedCount = selections.size
      const hasSelections = selectedCount > 0
      const isAllSelected = selectedCount === count
      const all = lights.map((light) => ({
        ...light,
        selected: selections.has(light.id)
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
    value: latest.get,
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
      selections.get()[method](id)
      selections.update()
    }
    const light = useLight(power, { id, key, label, select })
    lightsMap.get().set(id, light)
    lightsMap.update()
  }

  function deselectAll () {
    selections.get().clear()
    selections.update()
  }

  function getId () {
    const id = idCounter.get() + 1
    idCounter.set(id)
    return id
  }

  function removeSelected () {
    const ids = [...selections.get().values()]
    ids.forEach((id) => lightsMap.get().delete(id))
    selections.get().clear()
    lightsMap.update()
    selections.update()
  }

  function selectAll () {
    const ids = [...lightsMap.get().keys()]
    ids.forEach((id) => selections.get().add(id))
    selections.update()
  }

  function toggleAll () {
    const { isAllOn } = latest.get()
    const turn = isAllOn ? 'turnOff' : 'turnOn'
    const lights = [...lightsMap.get().values()]
    lights.forEach((light) => light[turn]())
  }
}

function useLight (power = OFF, other = {}) {
  const latest = useValue()
  const powered = useValue(power)
  const methods = {
    toggle: () => powered.set(!powered.get()),
    turnOn: () => powered.set(true),
    turnOff: () => powered.set(false)
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
    get$: value$,
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
