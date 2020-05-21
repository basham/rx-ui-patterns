export function isObject (value) {
  return value === Object(value) && !Array.isArray(value)
}
