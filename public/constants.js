import { html } from 'uce'

export const TITLE = 'Reactive UI Patterns'

export const PAGES = [
  ['default', null, html`<rui-examples />`],
  ['boolean', 'useBoolean', html`<rui-boolean />`],
  ['int', 'useInt', html`<rui-int />`],
  ['mode', 'useMode', html`<rui-mode />`],
  ['range', 'useRange', html`<rui-range />`],
  ['form', 'Form', html`<rui-form />`],
  ['lights', 'Lights', html`<rui-lights />`]
].map(([id, title, content]) => ({ id, title, content }))
