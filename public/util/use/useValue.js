import { BehaviorSubject } from 'rxjs'
import { tap } from 'rxjs/operators'

export function useValue (initValue = null, options = {}) {
  const { distinct = false, parseValue = (value) => value } = options
  const v = parseValue(initValue)
  const subject$ = new BehaviorSubject(v)
  return {
    value$: subject$.asObservable(),
    set,
    tapSet,
    update,
    value
  }

  function set (newValue) {
    const v = parseValue(newValue)
    if (distinct && v === value()) {
      return
    }
    subject$.next(v)
  }

  function tapSet (selector = (newValue) => newValue) {
    if (typeof selector !== 'function') {
      throw new Error('Argument must be a function.')
    }
    return tap((newValue) => {
      set(selector(newValue))
    })
  }

  function update () {
    set(value())
  }

  function value () {
    return subject$.value
  }
}
