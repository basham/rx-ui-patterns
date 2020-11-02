import { shareReplay } from 'rxjs/operators'
import { combineLatestObject } from '../rx/combineLatestObject.js'
import { createErrorMessage } from './createErrorMessage.js'
import { createValue } from './createValue.js'

export function createField (options = {}) {
  const { id, label = '', required = true, type = 'text', value = '' } = options
  const field = createValue(value)
  const errorMessage = createErrorMessage({ id, label, type })
  const latest = createValue()
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
    value: latest.value
  }

  function change (event) {
    field.set(event.target.value)
  }
}
