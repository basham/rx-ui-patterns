import { BehaviorSubject } from '/web_modules/rxjs.js'

export function useInt (initValue = 0) {
  let source = isNaN(parseInt(initValue)) ? 0 : parseInt(initValue)
  const source$ = new BehaviorSubject(source)
  const update = () => source$.next(source)
  const decrement = () => {
    source = source - 1
    update()
    return source
  }
  const increment = () => {
    source = source + 1
    update()
    return source
  }
  const set = (value) => {
    source = value
    update()
  }
  return {
    get value () {
      return source
    },
    set value (value) {
      set(value)
    },
    decrement,
    increment,
    value$: source$.asObservable()
  }
}
