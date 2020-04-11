import { BehaviorSubject } from 'rxjs'
import { distinctUntilChanged, map, shareReplay } from 'rxjs/operators'

// https://github.com/immerjs/immer/issues/146#issuecomment-385235749
export function useMap () {
  const source = new Map()
  const source$ = new BehaviorSubject(source)
  const update = () => source$.next(source)
  const clear = () => {
    source.clear()
    update()
  }
  const del = (...values) => {
    values.forEach((value) => source.delete(value))
    update()
  }
  const entries = () => [...source.entries()]
  const get = (key) => source.get(key)
  const has = (key) => source.has(key)
  const keys = () => [...source.keys()]
  const set = (key, value) => {
    const r = source.set(key, value)
    update()
    return r
  }
  const values = () => [...source.values()]
  const entries$ = source$.pipe(
    map(() => entries()),
    shareReplay(1)
  )
  const keys$ = source$.pipe(
    map(() => keys()),
    shareReplay(1)
  )
  const size$ = source$.pipe(
    map(() => source.size),
    distinctUntilChanged(),
    shareReplay(1)
  )
  const values$ = source$.pipe(
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
      return source.size
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
}
