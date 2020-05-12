import { useValue } from './useValue.js'

export function useInt (initValue = 0) {
  const source = useValue(initValue, { parseValue })
  return {
    ...source,
    decrement,
    increment
  }

  function decrement () {
    source.set(source.value() - 1)
    return source.value()
  }

  function increment () {
    source.set(source.value() + 1)
    return source.value()
  }
}

function parseValue (value) {
  if (parseInt(value) !== value) {
    throw new Error(`"${value}" must be an integer.`)
  }
  return value
}
