import { BehaviorSubject, combineLatest, of } from 'rxjs'
import { shareReplay, switchMap } from 'rxjs/operators'
import { withProperties } from '../with.js'

// https://github.com/immerjs/immer/issues/146#issuecomment-385235749
export function useMap () {
  const source = new Map()
  const source$ = new BehaviorSubject(source)
  const _delete = () => (key) => {
    const r = source.delete(key)
    if (r) {
      source$.next(source)
    }
    return r
  }
  const forEach = () => (...args) => source.forEach(...args)
  const set = () => (key, value) => {
    const r = source.set(key, value)
    source$.next(source)
    return r
  }
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
    delete: _delete,
    forEach,
    latestValues,
    set,
    source$: _source$
  })
}
