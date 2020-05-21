import { isObject } from './objects/util.js'

const DIRECTION_NEXT = 1
const DIRECTION_PREVIOUS = -1

export const mode = {
  next: nextMode,
  parseOptions,
  previous: previousMode,
  set: setMode
}

export function nextMode (value, options) {
  return move(value, options, DIRECTION_NEXT)
}

export function previousMode (value, options) {
  return move(value, options, DIRECTION_PREVIOUS)
}

export function setMode (value, options) {
  const { defaultValue, modes } = parseOptions(options)
  const _value = value || defaultValue
  if (!modes.includes(_value)) {
    throw new Error(`"${_value}" is not a valid mode.`)
  }
  return _value
}

function move (value, options, direction) {
  const { modes, wrap } = parseOptions(options)
  const i = modes.indexOf(value)
  const max = modes.length - 1
  const nextIndex = direction === DIRECTION_NEXT
    ? (i === max ? (wrap ? 0 : i) : i + 1)
    : (i === 0 ? (wrap ? max : i) : i - 1)
  return modes[nextIndex]
}

export function parseOptions (options = {}) {
  if (!isObject(options)) {
    throw new Error('"options" must be an object.')
  }
  const { defaultValue, modes, wrap = false } = options
  if (!Array.isArray(modes)) {
    throw new Error('"modes" must be an array.')
  }
  if (modes.length < 2) {
    throw new Error('"modes" must contain at least two modes.')
  }
  return {
    defaultValue: defaultValue || modes[0],
    modes,
    wrap: !!wrap
  }
}
