import { BehaviorSubject } from 'rxjs'

export function useBoolean (initValue = false) {
  const value$ = new BehaviorSubject(!!initValue)
  const get = () => value$.value
  const toggle = () => set(!get())
  const toFalse = () => set(false)
  const toTrue = () => set(true)
  const set = (value) => {
    value$.next(!!value)
  }
  return {
    value$: value$.asObservable(),
    get value () {
      return get()
    },
    set value (value) {
      return set(value)
    },
    get,
    set,
    toggle,
    toFalse,
    toTrue
  }
}
