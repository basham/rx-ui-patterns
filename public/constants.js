export const TITLE = 'Reactive UI Patterns'

export const COMPONENTS = 'icon,page'
  .split(',')
  .map(expandComponent)

export const PAGES = [
  ['patterns', 'Patterns', 'Examples of various reactive user interface patterns, with <a href="https://github.com/ReactiveX/rxjs">RxJS</a> and <a href="https://github.com/WebReflection/uce">µce</a>.'],
  ['boolean', 'Boolean', 'Toggle a boolean value.'],
  ['integer', 'Integer', 'Increment and decrement an integer.'],
  ['mode', 'Mode', 'Change a value within a set of options.'],
  ['range', 'Range', 'Step up and down a value within a range.'],
  ['range-grid', 'Range: Grid', 'Move coordinates within a grid.'],
  ['form', 'Form', 'Edit, validate, and submit a form.'],
  ['lights', 'Lights', 'Select items to toggle their value or delete them.']
].map(([id, title, description]) => ({ ...expandComponent(id), description, title }))

function expandComponent (id) {
  const component = `rui-${id}`
  const file = `${component}.js`
  const path = `/components/${file}`
  return { component, file, id, path }
}
