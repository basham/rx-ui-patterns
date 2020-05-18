import { isNumber, isObject, namespace } from './util.js'

const internal = namespace()
const STEP_UP = 1
const STEP_DOWN = -1

export function Range (config) {
  this.config = config
}

Range.prototype = {
  get config () {
    return internal(this).config
  },
  set config (config = {}) {
    if (!isObject(config)) {
      throw new Error('"config" must be an object.')
    }
    const { max, min, step = 1, value = 0, wrap = false } = config
    this.max = max
    this.min = min
    this.step = step
    this.wrap = wrap
    this.value = value
    internal(this).stepBase = min || value || 0
    internal(this).config = { max, min, step, value, wrap }
  },
  get max () {
    return internal(this).max
  },
  set max (max) {
    if (max !== undefined && !isNumber(max)) {
      throw new Error('"max" must be a number or undefined.')
    }
    internal(this).max = max
    validateMinMax(this)
  },
  get min () {
    return internal(this).min
  },
  set min (min) {
    if (min !== undefined && !isNumber(min)) {
      throw new Error('"min" must be a number or undefined.')
    }
    internal(this).min = min
    validateMinMax(this)
  },
  get step () {
    return internal(this).step
  },
  set step (step) {
    internal(this).step = step
  },
  get value () {
    return internal(this).value
  },
  set value (value) {
    if (!isNumber(value)) {
      throw new Error(`"${value}" must be a number.`)
    }
    internal(this).value = value
  },
  get wrap () {
    return internal(this).wrap
  },
  set wrap (wrap) {
    internal(this).wrap = !!wrap
  },
  stepDown (options) {
    return step(this, STEP_DOWN, options)
  },
  stepUp (options) {
    return step(this, STEP_UP, options)
  }
}

function step (context, direction, options = {}) {
  if (!isObject(options)) {
    throw new Error('"options" must be an object.')
  }
  const { max, min, step: _step, stepBase, value: v, wrap: _wrap } = internal(context)
  const { step = _step, wrap = _wrap } = options
  if (!isNumber(step)) {
    throw new Error('"step" must be a number.')
  }
  if (step <= 0) {
    throw new Error('"step" must be greater than zero.')
  }
  if (max !== undefined && min !== undefined) {
    const range = max - min
    if (step > range) {
      throw new Error(`"step" must be less than or equal to the difference of "min" and "max" (${range})`)
    }
  }
  if (wrap && max === undefined) {
    throw new Error('"max" is required when wrapping.')
  }
  if (wrap && min === undefined) {
    throw new Error('"min" is required when wrapping.')
  }
  const stepMax = max ? (max - ((max - stepBase) % step)) : Infinity
  const nextValue = direction === STEP_UP
    ? (max !== undefined && (v + step > max) ? (wrap ? stepBase : v) : v + step)
    : (min !== undefined && (v - step < min) ? (wrap ? stepMax : v) : v - step)
  context.value = nextValue
  return nextValue
}

function validateMinMax (context) {
  const { max, min } = context
  if (max === undefined || min === undefined) {
    return
  }
  if (min > max) {
    throw new Error('"min" must be less than or equal to "max".')
  }
}
