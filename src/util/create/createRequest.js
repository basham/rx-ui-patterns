import { Subject, of } from 'rxjs'
import { ajax } from 'rxjs/ajax'
import { catchError, concatMap, distinctUntilChanged, exhaustMap, filter, map, mergeMap, shareReplay, startWith, switchMap } from 'rxjs/operators'

export const strategies = {
  concat: concatMap,
  exhaust: exhaustMap,
  merge: mergeMap,
  switch: switchMap
}

export function createRequest (options = {}) {
  const { strategy = 'exhaust' } = options
  const strategyOperator = strategies[strategy]
  if (!strategyOperator) {
    throw new Error('"options.strategy" must be "concat", "exhaust" (default), "merge", or "switch".')
  }
  const req$ = new Subject()
  const value$ = req$.pipe(
    strategyOperator((options) =>
      ajax(options).pipe(
        startWith({ mode: 'loading' }),
        catchError((error) => of(error))
      )
    ),
    map((value) => {
      if (value.mode === 'loading') {
        return value
      }
      const { status } = value.response
      const mode = status >= 400 ? 'error' : 'success'
      return { mode, value }
    }),
    startWith({ mode: 'idle' }),
    shareReplay(1)
  )
  const mode$ = value$.pipe(
    map(({ mode }) => mode),
    distinctUntilChanged(),
    shareReplay(1)
  )
  const error$ = value$.pipe(
    filter(({ mode }) => mode === 'error'),
    map(({ value }) => value),
    shareReplay(1)
  )
  const success$ = value$.pipe(
    filter(({ mode }) => mode === 'success'),
    map(({ value }) => value),
    shareReplay(1)
  )
  return {
    error$,
    mode$,
    success$,
    value$,
    get,
    request
  }

  function get (url, options = {}) {
    const { body = {}, responseType = 'json' } = options
    return request({
      ...options,
      body,
      method: 'GET',
      responseType,
      url
    })
  }

  function request (options) {
    req$.next(options)
  }
}
