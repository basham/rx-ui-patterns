import { tap } from '/web_modules/rxjs/operators.js'

export function useLatest () {
  let latest = null
  return {
    get value () {
      return latest
    },
    update: () => tap((value) => {
      latest = value
    })
  }
}
