import { BehaviorSubject } from 'rxjs'
import { tap } from 'rxjs/operators'

export function useValue (initValue = null, options = {}) {
  const { parseValue = (value) => value } = options
  initValue = parseValue(initValue)
  const subject$ = new BehaviorSubject(initValue)
  return {
    value$: subject$.asObservable(),
    get value () {
      return get()
    },
    set value (value) {
      set(value)
    },
    get,
    set,
    tapSet,
    update
  }

  function get () {
    return subject$.value
  }

  function set (value) {
    const v = parseValue(value)
    subject$.next(v)
  }

  function tapSet (selector = (value) => value) {
    if (typeof selector !== 'function') {
      throw new Error('Argument must be a function.')
    }
    return tap((value) => {
      set(selector(value))
    })
  }

  function update () {
    set(get())
  }
}
