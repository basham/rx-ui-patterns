import { Subscription, isObservable } from 'rxjs'

export function useSubscribe () {
  const stack = new Set()
  return [
    subscribe.bind(null, stack),
    unsubscribe.bind(null, stack)
  ]
}

function subscribe (stack, source) {
  if (isObservable(source)) {
    const sub = source.subscribe()
    stack.add(() => sub.unsubscribe())
    return
  }
  if (source instanceof Subscription) {
    stack.add(() => source.unsubscribe())
    return
  }
  if (typeof source === 'function') {
    stack.add(source)
    return
  }
  throw new Error('Argument must be an Observable, Subscription, or function.')
}

function unsubscribe (stack) {
  stack.forEach((callback) => callback())
  stack.clear()
}
