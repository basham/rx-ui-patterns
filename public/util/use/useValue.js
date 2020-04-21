import { BehaviorSubject } from 'rxjs'
import { tap } from 'rxjs/operators'

export function useValue (initValue = null, options = {}) {
  const { distinct = false, parseValue = (value) => value } = options
  initValue = parseValue(initValue)
  const subject$ = new BehaviorSubject(initValue)
  return {
    value$: subject$.asObservable(),
    get,
    set,
    tapSet,
    update,
    value: get
  }

  function get () {
    return subject$.value
  }

  function set (value) {
    const v = parseValue(value)
    if (distinct && v === get()) {
      return
    }
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
