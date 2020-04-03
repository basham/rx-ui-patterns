export function useCallbackStack () {
  const stack = new Set()
  const add = (value) => {
    if (typeof value === 'function') {
      stack.add(value)
    }
  }
  const call = () => {
    stack.forEach((callback) => callback())
    stack.clear()
  }
  return [add, call]
}
