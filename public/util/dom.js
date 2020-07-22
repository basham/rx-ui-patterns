import { renderComponentFactory } from './rx/renderComponentFactory.js'

const noop = () => {}

export function connect (fn) {
  let teardown = null
  return {
    connected () {
      const result = fn.call(this, this)
      teardown = typeof result === 'function' ? result : noop
    },
    disconnected () {
      teardown()
    }
  }
}

export function focus (elementOrId) {
  window.requestAnimationFrame(() => {
    const element = typeof elementOrId === 'string'
      ? document.getElementById(elementOrId)
      : elementOrId
    if (!(element instanceof window.HTMLElement)) {
      return
    }
    element.focus()
  })
}

export const render = renderComponentFactory(
  ({ element, props, renderer }) => element.html`${renderer(props)}`
)
