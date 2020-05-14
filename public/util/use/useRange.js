import { useValue } from './useValue.js'

const STEP_UP = 1
const STEP_DOWN = -1

export function useRange (initValue = 0, options = {}) {
  if (options !== Object(options) || Array.isArray(options)) {
    throw new Error('"options" must be an object.')
  }
  const { max, min, step = 1 } = options
  if (max !== undefined && !validateNumber(max)) {
    throw new Error('"options.max" must be a number or undefined.')
  }
  if (min !== undefined && !validateNumber(min)) {
    throw new Error('"options.min" must be a number or undefined.')
  }
  if (!validateNumber(step)) {
    throw new Error('"options.step" must be a number.')
  }
  if (step <= 0) {
    throw new Error('"options.step" must be greater than zero.')
  }
  if (min > max) {
    throw new Error('"options.min" must be less than or equal to "options.max".')
  }
  const range = max - min
  if (step > range) {
    throw new Error(`"options.step" must be less than or equal to the difference of "min" and "max" (${range})`)
  }
  const stepBase = min || initValue || 0
  const source = useValue(initValue, { distinct: true, parseValue })
  return {
    ...source,
    stepDown,
    stepUp
  }

  function stepDown (options) {
    return _stepUpDown(STEP_DOWN, options)
  }

  function stepUp (options) {
    return _stepUpDown(STEP_UP, options)
  }

  function _stepUpDown (direction, options = {}) {
    const value = _step({
      ...options,
      direction,
      max,
      min,
      step,
      stepBase,
      source,
      value: source.value()
    })
    source.set(value)
    return value
  }
}

function _step (options) {
  const { direction, max, min, step, stepBase, value: v, wrap = false } = options
  if (wrap && max === undefined) {
    throw new Error('"options.max" is required when wrapping.')
  }
  if (wrap && min === undefined) {
    throw new Error('"options.min" is required when wrapping.')
  }
  const stepMax = max ? (max - ((max - stepBase) % step)) : Infinity
  const nextValue = direction === STEP_UP
    ? (max !== undefined && (v + step > max) ? (wrap ? stepBase : v) : v + step)
    : (min !== undefined && (v - step < min) ? (wrap ? stepMax : v) : v - step)
  return nextValue
}

function parseValue (value) {
  if (!validateNumber(value)) {
    throw new Error(`"${value}" must be a number.`)
  }
  return value
}

function validateNumber (value) {
  return Number(value) === value
}
