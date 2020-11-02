import { BehaviorSubject } from 'rxjs'
import { tap } from 'rxjs/operators'

export function createValue (initValue = null, options = {}) {
  const { distinct = false, parseValue = (value) => value } = options
  if (typeof parseValue !== 'function') {
    throw new Error('"options.parseValue" must be a function.')
  }
  const v = parseValue(initValue)
  const subject$ = new BehaviorSubject(v)
  const value$ = subject$.asObservable()
  return {
    get$: value$,
    value$,
    get: value,
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
