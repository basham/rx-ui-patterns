import { pipe } from 'rxjs'
import { tap } from 'rxjs/operators'
import { animationFrame } from './animationFrame.js'

export const renderComponentFactory = (adapter) => (element, renderer) => pipe(
  animationFrame(),
  tap((props) => adapter({ element, props, renderer }))
)
