import { useValue } from './useValue.js'

export function useMode (modes, initValue) {
  if (!Array.isArray(modes)) {
    throw new Error('First argument must be an array.')
  }
  if (modes.length < 2) {
    throw new Error('There must be at least two modes.')
  }
  initValue = initValue === undefined ? modes[0] : initValue
  const source = useValue(initValue, { parseValue })
  return source

  function parseValue (value) {
    if (!modes.includes(value)) {
      throw new Error(`"${value}" is not a valid mode.`)
    }
    return value
  }
}
