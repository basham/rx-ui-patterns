import { BehaviorSubject } from '/web_modules/rxjs.js'

export function useAttribute (target, name) {
  const getValue = () => target.getAttribute(name)
  const value$ = new BehaviorSubject(getValue())
  const mutationObserver = new window.MutationObserver((mutationsList) =>
    mutationsList
      .filter(({ type }) => type === 'attributes')
      .filter((mutation) => mutation.attributeName === name)
      .forEach(() => {
        value$.next(getValue())
      })
  )
  mutationObserver.observe(target, { attributes: true })
  return value$
}
