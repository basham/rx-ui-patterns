import { useValue } from './useValue.js'

export function useFocus () {
  const source = useValue()
  return {
    value$: source.value$,
    focus,
    refocus,
    remember
  }

  // Pop?
  function refocus () {
    focus(source.value())
  }

  // Push?
  function remember () {
    source.set(document.activeElement)
  }
}

function focus (element) {
  if (!(element instanceof window.HTMLElement)) {
    return
  }
  window.requestAnimationFrame(() => {
    element.focus()
  })
}
