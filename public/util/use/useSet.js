import { BehaviorSubject, combineLatest, of } from 'rxjs'
import { shareReplay, switchMap } from 'rxjs/operators'
import { withProperties } from '../with.js'

export function useSet () {
  const source = new Set()
  const source$ = new BehaviorSubject(source)
  const add = () => (value) => {
    const r = source.add(value)
    source$.next(source)
    return r
  }
  const _delete = () => (key) => {
    const r = source.delete(key)
    if (r) {
      source$.next(source)
    }
    return r
  }
  const forEach = () => (...args) => source.forEach(...args)
  const _source$ = () => source$
  const latestValues = () => (selector = (value) => value) => source$.pipe(
    // Every time a value is added or removed,
    // watch for changes for all the values.
    switchMap((m) => {
      const values = [...m.values()].map(selector)
      return values.length ? combineLatest(values) : of([])
    }),
    shareReplay(1)
  )
  return withProperties(source, {
    value$: source$.asObservable(),
    source$: _source$,
    add,
    delete: _delete,
    forEach,
    latestValues
  })
}
