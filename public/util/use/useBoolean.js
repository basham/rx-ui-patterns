import { BehaviorSubject } from '/web_modules/rxjs.js'

export function useBoolean (initValue = false) {
  let source = !!initValue
  const source$ = new BehaviorSubject(source)
  const update = () => source$.next(source)
  const toggle = () => set(!source)
  const toFalse = () => set(false)
  const toTrue = () => set(true)
  const set = (value) => {
    source = !!value
    update()
  }
  return {
    get value () {
      return source
    },
    set value (value) {
      return set(value)
    },
    toggle,
    toFalse,
    toTrue,
    value$: source$.asObservable()
  }
}
