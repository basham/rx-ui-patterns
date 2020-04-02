import { pipe } from 'rxjs'
import { tap } from 'rxjs/operators'
import { animationFrame } from './animationFrame.js'

export const renderComponent = (element, renderer) => pipe(
  animationFrame(),
  tap((props) => element.html`${renderer(props)}`)
)
