import { tap } from 'rxjs/operators'

export const debug = (message = '', type = 'log') =>
  tap((value) => {
    console.group(message)
    console[type](value)
    console.groupEnd()
  })
