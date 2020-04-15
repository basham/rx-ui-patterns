import { tap } from 'rxjs/operators'

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
