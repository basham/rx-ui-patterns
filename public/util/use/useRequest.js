import { of } from 'rxjs'
import { ajax } from 'rxjs/ajax'
import { catchError, concatMap, exhaustMap, map, mergeMap, shareReplay, switchMap } from 'rxjs/operators'
import { useEvent } from './useEvent.js'
import { useValue } from './useValue.js'

export const CONCURRENT = mergeMap
export const IGNORE = exhaustMap
export const LATEST = switchMap
export const QUEUE = concatMap

export const strategies = {
  CONCURRENT,
  IGNORE,
  LATEST,
  QUEUE
}

export function useRequest (options = {}) {
  const { strategy = IGNORE } = options
  if (!Object.keys(strategies).includes(strategy)) {
    throw new Error('Strategy option must be CONCURRENT, IGNORE, LATEST, or QUEUE.')
  }
  const req = useEvent()
  const res = useValue({ mode: 'idle' })
  const response$ = req.value$.pipe(
    strategy((options) => {
      res.set({ mode: 'loading' })
      return ajax(options).pipe(
        catchError((error) => of(error))
      )
    }),
    map((value) => {
      const { status } = value.response
      const mode = status >= 400 ? 'error' : 'success'
      return { ...value, mode }
    }),
    res.tapSet(),
    shareReplay(1)
  )
  return {
    response$,
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
    req.emit(options)
  }
}

// useParallelRequest?
// useSimultaneousRequest?
export function useConcurrentRequest () {
  return useRequest(CONCURRENT)
}

// useIgnoreUntilDoneRequest?
// useAwaitRequest?
// useDoNotDisturbRequest?
// useSkipRequest?
// useOmitRequest?
export function useIgnoreRequest () {
  return useRequest(IGNORE)
}

export function useLatestRequest () {
  return useRequest(LATEST)
}

// useSeriesRequest?
// useWaitRequest?
export function useQueueRequest () {
  return useRequest(QUEUE)
}
