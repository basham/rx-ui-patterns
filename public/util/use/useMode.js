import { mode } from '../mode.js'
import { combineLatestObject } from '../rx.js'
import { useValue } from './useValue.js'

export function useMode (options = {}) {
  const { defaultValue } = mode.parseOptions(options)
  const value = useValue(defaultValue, { distinct: true })
  const { get, set, value$: rawValue$ } = value
  const methods = {
    previous: (opts) => set(mode.previous(get(), { ...options, ...opts })),
    next: (opts) => set(mode.next(get(), { ...options, ...opts })),
    set: (v, opts) => set(mode.set(v, { ...options, ...opts }))
  }
  const value$ = combineLatestObject({
    ...methods,
    value: rawValue$
  })
  return {
    ...methods,
    value$,
    value
  }
}
