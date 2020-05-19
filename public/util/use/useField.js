import { shareReplay } from 'rxjs/operators'
import { focus } from '../dom.js'
import { ErrorMessage } from '../objects.js'
import { combineLatestObject } from '../rx/combineLatestObject.js'
import { useValue } from './useValue.js'

export function useField (options = {}) {
  const { id, label = '', required = true, type = 'text', value = '' } = options
  const field = useValue(value)
  const errorMessage = useValue(new ErrorMessage({
    label,
    targetId: id,
    type
  }))
  const latest = useValue()
  const value$ = combineLatestObject({
    change,
    error: errorMessage.value$,
    id,
    label,
    required,
    type,
    value: field.value$
  }).pipe(
    latest.tapSet(),
    shareReplay(1)
  )
  return {
    ...field,
    error$: errorMessage.value$,
    value$,
    checkValidity: () => {
      errorMessage.get().checkValidity()
      errorMessage.update()
    },
    errorMessage,
    focus: () => focus(id),
    value: latest.value
  }

  function change (event) {
    field.set(event.target.value)
  }
}
