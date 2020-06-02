import { Subject, interval } from 'rxjs'
import { mapTo, take } from 'rxjs/operators'
import { auditMap } from './auditMap.js'
import { debug } from './debug.js'

const MS = 100
const DURATION = 3 * MS
const TICKS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9
]
const TIMES = TICKS.map((n) => n * MS)

const e$ = new Subject()
e$.pipe(
  debug('In'),
  auditMap((v) =>
    interval(DURATION).pipe(
      take(1),
      mapTo(v)
    )
  ),
  debug('Out')
).subscribe()

TIMES.forEach((n) => {
  setTimeout(() => e$.next(n), n)
})
