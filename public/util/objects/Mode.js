import { isObject, namespace } from './util.js'

const internal = namespace()
const DIRECTION_NEXT = 1
const DIRECTION_PREVIOUS = -1

export function Mode (config) {
  this.config = config
}

Mode.prototype = {
  get config () {
    return internal(this).config
  },
  set config (config = {}) {
    if (!isObject(config)) {
      throw new Error('"config" must be an object.')
    }
    const { modes, value, wrap = false } = config
    this.modes = modes
    this.value = value === undefined ? modes[0] : value
    this.wrap = wrap
    internal(this).config = { modes, value, wrap }
  },
  get modes () {
    return internal(this).modes
  },
  set modes (modes) {
    if (!Array.isArray(modes)) {
      throw new Error('"modes" must be an array.')
    }
    if (modes.length < 2) {
      throw new Error('"modes" must contain at least two modes.')
    }
    internal(this).modes = modes
  },
  get value () {
    return internal(this).value
  },
  set value (value) {
    if (!this.modes.includes(value)) {
      throw new Error(`"${value}" is not a valid mode.`)
    }
    internal(this).value = value
  },
  get wrap () {
    return internal(this).wrap
  },
  set wrap (wrap) {
    internal(this).wrap = !!wrap
  },
  previous (options) {
    return move(this, DIRECTION_PREVIOUS, options)
  },
  next (options) {
    return move(this, DIRECTION_NEXT, options)
  }
}

function move (context, direction, options = {}) {
  if (!isObject(options)) {
    throw new Error('"options" must be an object.')
  }
  const { modes, value, wrap: _wrap } = internal(context)
  const { wrap = _wrap } = options
  const i = modes.indexOf(value)
  const max = modes.length - 1
  const nextIndex = direction === DIRECTION_NEXT
    ? (i === max ? (wrap ? 0 : i) : i + 1)
    : (i === 0 ? (wrap ? max : i) : i - 1)
  const nextValue = modes[nextIndex]
  context.value = nextValue
  return nextValue
}
