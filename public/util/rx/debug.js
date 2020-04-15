import { tap } from '/web_modules/rxjs/operators.js'

export const debug = (message = '', type = 'log') =>
  tap((value) => {
    console.group(message)
    console[type](value)
    console.groupEnd()
  })
