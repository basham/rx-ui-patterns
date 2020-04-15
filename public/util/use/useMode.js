import { BehaviorSubject } from '/web_modules/rxjs.js'

export function useMode (modes, initMode) {
  if (!Array.isArray(modes)) {
    throw new Error('The first argument must be an array of modes')
  }
  if (modes.length < 2) {
    throw new Error('There must be at least two modes')
  }
  const mode = modes.includes(initMode) ? initMode : modes[0]
  const value$ = new BehaviorSubject(mode)
  const set = (mode) => {
    if (modes.includes(mode) && value$.value !== mode) {
      value$.next(mode)
    }
  }
  return {
    value$: value$.asObservable(),
    get value () {
      return value$.value
    },
    set value (mode) {
      return set(mode)
    },
    get: () => value$.value,
    set
  }
}
