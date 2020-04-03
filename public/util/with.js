export function withProperties (target, properties = {}) {
  if (!Object.keys(properties).length) {
    return target
  }
  return new Proxy(target, {
    get: (target, name) => {
      const fn = typeof properties[name] === 'function'
        ? properties[name]
        : Reflect.get
      return fn(target, name)
    }
  })
}
