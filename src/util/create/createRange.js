import { stepDown, stepUp, parseOptions } from '../range.js'
import { combineLatestObject } from '../rx.js'
import { createValue } from './createValue.js'

export function createRange (options = {}) {
  const { defaultValue } = parseOptions(options)
  const value = createValue(defaultValue, { distinct: true })
  const { get, set, value$: rawValue$ } = value
  const methods = {
    stepDown: (opts) => set(stepDown(get(), { ...options, ...opts })),
    stepUp: (opts) => set(stepUp(get(), { ...options, ...opts }))
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
