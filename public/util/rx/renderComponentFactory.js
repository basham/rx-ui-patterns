import { pipe } from '/web_modules/rxjs.js'
import { tap } from '/web_modules/rxjs/operators.js'
import { animationFrame } from './animationFrame.js'

export const renderComponentFactory = (adapter) => (element, renderer) => pipe(
  animationFrame(),
  tap((props) => adapter({ element, props, renderer }))
)
