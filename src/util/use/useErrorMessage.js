import { map, shareReplay } from 'rxjs/operators'
import { combineLatestObject } from '../rx/combineLatestObject.js'
import { useValue } from './useValue.js'

export function useErrorMessage (options = {}) {
  const { id, label, type } = options
  const message = useValue('', { distinct: true })
  const value$ = combineLatestObject({
    id: `${id}-error-message`,
    message: message.value$,
    targetId: id
  }).pipe(
    map((value) => ({ ...value, invalid: !!value.message })),
    shareReplay(1)
  )
  return {
    value$,
    checkValidity
  }

  function checkValidity () {
    const { validity } = document.getElementById(id)
    const text = getMessage(validity)
    message.set(text)
    return validity.valid
  }

  function getMessage (validity) {
    if (validity.valueMissing) {
      return `Enter ${label}`
    }
    if (validity.typeMismatch && type === 'email') {
      return `${label} must be a valid address`
    }
    return ''
  }
}
