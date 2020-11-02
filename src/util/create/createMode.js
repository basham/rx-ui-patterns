import { mode } from '../mode.js'
import { combineLatestObject } from '../rx.js'
import { createValue } from './createValue.js'

export function createMode (options = {}) {
  const { defaultValue } = mode.parseOptions(options)
  const value = createValue(defaultValue, { distinct: true })
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
