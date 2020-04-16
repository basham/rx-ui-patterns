import { useValue } from './useValue.js'

export function useBoolean (initValue = false) {
  const source = useValue(initValue, { parseValue })
  return {
    ...source,
    toggle,
    toFalse,
    toTrue
  }

  function toggle () {
    source.set(!source.value)
  }

  function toFalse () {
    source.set(false)
  }

  function toTrue () {
    source.set(true)
  }
}

function parseValue (value) {
  return !!value
}
