import { EMPTY } from 'rxjs'
import { audit, shareReplay, switchMap } from 'rxjs/operators'

export function auditMap (project) {
  return (source) => {
    let latest$ = EMPTY
    return source.pipe(
      audit(() => latest$),
      switchMap((...args) => {
        latest$ = project(...args).pipe(
          shareReplay(1)
        )
        return latest$
      })
    )
  }
}
