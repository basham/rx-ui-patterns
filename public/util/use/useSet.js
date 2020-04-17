import { distinctUntilChanged, map, shareReplay } from 'rxjs/operators'
import { useValue } from './useValue.js'

export function useSet () {
  const source = useValue(new Set())
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
    size$,
    values$,
    get size () {
      return size()
    },
    get values () {
      return values()
    },
    add,
    clear,
    delete: del
  }

  function add (...values) {
    values.forEach((value) => source.value.add(value))
    source.update()
  }

  function clear () {
    source.value.clear()
    source.update()
  }

  function del (...values) {
    values.forEach((value) => source.value.delete(value))
    source.update()
  }

  function size () {
    return source.value.size
  }

  function values () {
    return [...source.value.values()]
  }
}
