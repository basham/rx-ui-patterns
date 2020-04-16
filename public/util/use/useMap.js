import { distinctUntilChanged, map, shareReplay } from 'rxjs/operators'
import { useValue } from './useValue.js'

export function useMap () {
  const source = useValue(new Map())
  const entries$ = source.value$.pipe(
    map(() => entries()),
    shareReplay(1)
  )
  const keys$ = source.value$.pipe(
    map(() => keys()),
    shareReplay(1)
  )
  const size$ = source.value$.pipe(
    map(() => size()),
    distinctUntilChanged(),
    shareReplay(1)
  )
  const values$ = source.value$.pipe(
    map(() => values()),
    shareReplay(1)
  )
  return {
    get entries () {
      return entries()
    },
    get keys () {
      return keys()
    },
    get size () {
      return size()
    },
    get values () {
      return values()
    },
    clear,
    delete: del,
    get,
    has,
    set,
    entries$,
    keys$,
    size$,
    values$
  }

  function clear () {
    source.value.clear()
    source.update()
  }

  function del (...values) {
    values.forEach((value) => source.value.delete(value))
    source.update()
  }

  function entries () {
    return [...source.value.entries()]
  }

  function get (key) {
    return source.value.get(key)
  }

  function has (key) {
    return source.value.has(key)
  }

  function keys () {
    return [...source.value.keys()]
  }

  function set (key, value) {
    const r = source.value.set(key, value)
    source.update()
    return r
  }

  function size () {
    return source.value.size
  }

  function values () {
    return [...source.value.values()]
  }
}
