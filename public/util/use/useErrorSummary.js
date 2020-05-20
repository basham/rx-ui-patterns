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
    const validCount = fields
      .filter((field) => {
        const valid = field.get().checkValidity()
        field.update()
        return valid
      })
      .length
    const isValid = validCount === fields.length
    return isValid
  }
}
