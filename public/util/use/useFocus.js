export function useFocus () {
  let activeElement = null
  return {
    focus,
    refocus,
    remember
  }

  function focus (element) {
    if (!(element instanceof window.HTMLElement)) {
      return
    }
    window.requestAnimationFrame(() => {
      element.focus()
    })
  }

  // Pop?
  function refocus () {
    focus(activeElement)
  }

  // Push?
  function remember () {
    activeElement = document.activeElement
  }
}
