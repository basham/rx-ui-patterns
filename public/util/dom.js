import { define as _define } from 'uce'
import { renderComponentFactory } from './rx/renderComponentFactory.js'

export * from 'uce'

export function define (name, def, other = {}) {
  _define(name, {
    ...other,
    init () {
      const unsubscribe = def.call(this, this)
      this._unsubscribe = typeof unsubscribe === 'function' ? unsubscribe : () => {}
    },
    disconnected () {
      this._unsubscribe()
    }
  })
}

export const renderComponent = renderComponentFactory(
  ({ element, props, renderer }) => element.html`${renderer(props)}`
)
