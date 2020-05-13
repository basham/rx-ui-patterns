import { useValue } from './useValue.js'

const DIRECTION_NEXT = 1
const DIRECTION_PREVIOUS = -1

export function useMode (modes, initValue) {
  if (!Array.isArray(modes)) {
    throw new Error('First argument must be an array.')
  }
  if (modes.length < 2) {
    throw new Error('There must be at least two modes.')
  }
  initValue = initValue === undefined ? modes[0] : initValue
  const source = useValue(initValue, { distinct: true, parseValue })
  return {
    ...source,
    previous,
    next
  }

  function previous (options) {
    _move(source, modes, DIRECTION_PREVIOUS, options)
  }

  function next (options) {
    _move(source, modes, DIRECTION_NEXT, options)
  }

  function parseValue (value) {
    return _parseValue(modes, value)
  }
}

function _move (source, modes, direction, options = {}) {
  if (options !== Object(options) || Array.isArray(options)) {
    throw new Error('"options" must be an object.')
  }
  const { wrap = false } = options
  const i = modes.indexOf(source.value())
  const max = modes.length - 1
  const nextIndex = direction === DIRECTION_NEXT
    ? (i === max ? (wrap ? 0 : i) : i + 1)
    : (i === 0 ? (wrap ? max : i) : i - 1)
  source.set(modes[nextIndex])
}

function _parseValue (modes, value) {
  if (!modes.includes(value)) {
    throw new Error(`"${value}" is not a valid mode.`)
  }
  return value
}
