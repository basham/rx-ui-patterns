import { distinctUntilChanged } from 'rxjs/operators'

export const distinctUntilObjectChanged = () =>
  distinctUntilChanged(null, (value) => JSON.stringify(value))
