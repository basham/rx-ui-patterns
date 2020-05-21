import { combineLatest } from 'rxjs'
import { map, shareReplay, tap } from 'rxjs/operators'
import { focus } from '../dom.js'

export function useErrorSummary (options = {}) {
  const { fields, id } = options
  const fieldValues = fields.map(({ value$ }) => value$)
  const value$ = combineLatest(fieldValues).pipe(
    map((fields) => {
      const errors = fields
        .map(({ error }) => error)
        .filter(({ invalid }) => invalid)
      const count = errors.length
      return { count, errors, id }
    }),
    tap(({ count, errors, id }) => {
      if (count === 0) {
        return
      }
      const targetId = count === 1 ? errors[0].targetId : id
      focus(targetId)
    }),
    shareReplay(1)
  )
  return {
    value$,
    checkValidity
  }

  function checkValidity () {
    const validCount = fields
      .filter((field) => field.checkValidity())
      .length
    const isValid = validCount === fields.length
    return isValid
  }
}
