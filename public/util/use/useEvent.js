import { Subject } from 'rxjs'

export function useEvent () {
  const subject$ = new Subject()
  return {
    value$: subject$.asObservable(),
    emit
  }

  function emit (newValue) {
    subject$.next(newValue)
  }
}
