import { shareReplay } from 'rxjs/operators'
import { combineLatestObject } from '../rx/combineLatestObject.js'
import { useErrorMessage } from './useErrorMessage.js'
import { useValue } from './useValue.js'

export function useField (options = {}) {
  const { id, label = '', required = true, type = 'text', value = '' } = options
  const field = useValue(value)
  const errorMessage = useErrorMessage({ id, label, type })
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
    checkValidity: errorMessage.checkValidity,
    errorMessage,
    focus,
    value: latest.value
  }

  function change (event) {
    field.set(event.target.value)
  }

  function focus () {
    window.requestAnimationFrame(() => {
      document.getElementById(id).focus()
    })
  }
}
