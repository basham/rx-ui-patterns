import { distinctUntilChanged } from '/web_modules/rxjs/operators.js'

export const distinctUntilObjectChanged = () =>
  distinctUntilChanged(null, (value) => JSON.stringify(value))
