import { BehaviorSubject, combineLatest, isObservable, of } from 'rxjs'
import { shareReplay, switchMap } from 'rxjs/operators'
import { withProperties } from './withProperties.js'

export function useList () {
  const list$ = new BehaviorSubject(new Map())
  const remove = () => (key) => {
    const list = list$.value
    const r = list.delete(key)
    if (r) {
      list$.next(list)
    }
    return r
  }
  const set = () => (key, value) => {
    const list = list$.value
    const r = list.set(key, isObservable(value) ? value : of(value))
    list$.next(list)
    return r
  }
  const value = () => [ ...list$.value.values() ]
  const subject$ = () => list$
  const output$ = list$.pipe(
    // Every time a value is added or removed,
    // watch for changes for all the values.
    switchMap((list) => {
      const values = [ ...list.values() ]
      return values.length ? combineLatest(values) : of([])
    }),
    shareReplay(1)
  )
  return withProperties(output$, { remove, set, value, subject$ })
}
