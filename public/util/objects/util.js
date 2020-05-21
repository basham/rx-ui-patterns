export function namespace () {
  const map = new WeakMap()
  return (obj) => {
    if (!map.has(obj)) {
      map.set(obj, {})
    }
    return map.get(obj)
  }
}
