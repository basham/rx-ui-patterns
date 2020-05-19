import { combineLatest } from 'rxjs'
import { map, shareReplay, tap } from 'rxjs/operators'
import { focus } from '../dom.js'

export function useErrorSummary (options = {}) {
  const { errorMessages, id } = options
  const errorMessagesValues = errorMessages.map(({ value$ }) => value$)
  const value$ = combineLatest(errorMessagesValues).pipe(
    map((allErrors) => {
      const errors = allErrors
        .filter(({ invalid }) => invalid)
      const count = errors.length
      return { count, errors, id }
    }),
    tap(({ count, errors, id }) => {
      if (count === 0) {
        return
      }
      const target = count === 1 ? errors[0].target : id
      focus(target)
    }),
    shareReplay(1)
  )
  return {
    value$,
    checkValidity
  }

  function checkValidity () {
    const validCount = errorMessages
      .filter((errorMessage) => {
        const valid = errorMessage.get().checkValidity()
        errorMessage.update()
        return valid
      })
      .length
    const isValid = validCount === errorMessages.length
    return isValid
  }
}
