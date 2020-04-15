import { BehaviorSubject } from '/web_modules/rxjs.js'
import { distinctUntilChanged, map, shareReplay } from '/web_modules/rxjs/operators.js'

export function useSet () {
  const source = new Set()
  const source$ = new BehaviorSubject(source)
  const update = () => source$.next(source)
  const add = (...values) => {
    values.forEach((value) => source.add(value))
    update()
  }
  const clear = () => {
    source.clear()
    update()
  }
  const del = (...values) => {
    values.forEach((value) => source.delete(value))
    update()
  }
  const values = () => [...source.values()]
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
    get size () {
      return source.size
    },
    get values () {
      return values()
    },
    add,
    clear,
    delete: del,
    size$,
    values$
  }
}
