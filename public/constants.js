import { html } from 'uce'

export const TITLE = 'Reactive UI Patterns'

export const PAGES = [
  ['examples', 'Examples', html`<rui-examples />`],
  ['boolean', 'Boolean', html`<rui-boolean />`],
  ['integer', 'Integer', html`<rui-integer />`],
  ['mode', 'Mode', html`<rui-mode />`],
  ['range', 'Range', html`<rui-range />`],
  ['range-grid', 'Range: Grid', html`<rui-range-grid />`],
  ['form', 'Form', html`<rui-form />`],
  ['lights', 'Lights', html`<rui-lights />`]
].map(([id, title, content]) => ({ id, title, content }))
