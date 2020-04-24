import { combineLatest } from 'rxjs'
import { map, shareReplay, tap } from 'rxjs/operators'

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
      const focusTarget = count === 1 ? errors[0].target : id
      window.requestAnimationFrame(() => {
        const el = document.getElementById(focusTarget)
        if (el) {
          el.focus()
        }
      })
    }),
    shareReplay(1)
  )
  return {
    value$,
    checkValidity
  }

  function checkValidity () {
    const validCount = errorMessages
      .filter((errorMessage) => errorMessage.checkValidity())
      .length
    const isValid = validCount === errorMessages.length
    return isValid
  }
}
