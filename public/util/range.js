import { isNumber, isObject } from './objects/util.js'

const STEP_UP = 1
const STEP_DOWN = -1

export const range = {
  parseOptions,
  parseValue,
  stepDown,
  stepUp
}

export function stepDown (value, options) {
  return step(value, options, STEP_DOWN)
}

export function stepUp (value, options) {
  return step(value, options, STEP_UP)
}

function step (value, options, direction) {
  const v = parseValue(value)
  const { max, min, step, stepBase, stepMax, wrap } = parseOptions(options)
  return direction === STEP_UP
    ? (max !== undefined && (v + step > max) ? (wrap ? stepBase : v) : v + step)
    : (min !== undefined && (v - step < min) ? (wrap ? stepMax : v) : v - step)
}

export function parseOptions (options = {}) {
  if (!isObject(options)) {
    throw new Error('"options" must be an object.')
  }
  const { defaultValue = 0, max, min, step = 1, wrap = false } = options
  if (max !== undefined && !isNumber(max)) {
    throw new Error('"max" must be a number or undefined.')
  }
  if (min !== undefined && !isNumber(min)) {
    throw new Error('"min" must be a number or undefined.')
  }
  if (max !== undefined && min !== undefined && min > max) {
    throw new Error('"min" must be less than or equal to "max".')
  }
  if (max !== undefined && min !== undefined) {
    const range = max - min
    if (step > range) {
      throw new Error(`"step" must be less than or equal to the difference of "min" and "max" (${range})`)
    }
  }
  if (!isNumber(step)) {
    throw new Error('"step" must be a number.')
  }
  if (step <= 0) {
    throw new Error('"step" must be greater than zero.')
  }
  const _wrap = !!wrap
  if (_wrap && max === undefined) {
    throw new Error('"max" is required when wrapping.')
  }
  if (_wrap && min === undefined) {
    throw new Error('"min" is required when wrapping.')
  }
  parseValue(defaultValue)
  const stepBase = min || defaultValue || 0
  const stepMax = max === undefined ? Infinity : (max - ((max - stepBase) % step))
  return { defaultValue, max, min, step, stepBase, stepMax, wrap: _wrap }
}

export function parseValue (value) {
  if (!isNumber(value)) {
    throw new Error(`"${value}" must be a number.`)
  }
  return value
}
