import { Subscription, isObservable } from 'rxjs'
import { useCallbackStack } from './useCallbackStack.js'

export function useSubscribe () {
  const [add, unsubscribe] = useCallbackStack()
  return [subscribe, unsubscribe]

  function subscribe (source) {
    if (isObservable(source)) {
      const sub = source.subscribe()
      add(() => sub.unsubscribe())
      return sub
    }
    if (source instanceof Subscription) {
      add(() => source.unsubscribe())
      return source
    }
    if (typeof source === 'function') {
      add(source)
      return
    }
    throw new Error('Argument must be an Observable, Subscription, or function.')
  }
}
