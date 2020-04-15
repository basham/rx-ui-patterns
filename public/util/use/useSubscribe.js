import { Subscription, isObservable } from '/web_modules/rxjs.js'
import { useCallbackStack } from './useCallbackStack.js'

export function useSubscribe () {
  const [add, unsubscribe] = useCallbackStack()
  const subscribe = (source) => {
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
    }
  }
  return [subscribe, unsubscribe]
}
