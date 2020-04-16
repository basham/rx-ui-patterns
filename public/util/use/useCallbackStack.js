export function useCallbackStack () {
  const stack = new Set()
  return [add, call]

  function add (value) {
    if (typeof value !== 'function') {
      throw new Error('Argument must be a function.')
    }
    stack.add(value)
  }

  function call () {
    stack.forEach((callback) => callback())
    stack.clear()
  }
}
