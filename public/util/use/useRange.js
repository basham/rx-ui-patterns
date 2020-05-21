import { stepDown, stepUp, parseOptions } from '../range.js'
import { combineLatestObject } from '../rx.js'
import { useValue } from './useValue.js'

export function useRange (options = {}) {
  const { defaultValue } = parseOptions(options)
  const value = useValue(defaultValue, { distinct: true })
  const { get, set, value$: rawValue$ } = value
  const methods = {
    stepDown: () => set(stepDown(get(), options)),
    stepUp: () => set(stepUp(get(), options))
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
