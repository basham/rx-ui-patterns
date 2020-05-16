export function isNumber (value) {
  return Number(value) === value
}

export function isObject (value) {
  return value === Object(value) && !Array.isArray(value)
}

export function namespace () {
  const map = new WeakMap()
  return (obj) => {
    if (!map.has(obj)) {
      map.set(obj, {})
    }
    return map.get(obj)
  }
}
