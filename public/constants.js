export const TITLE = 'Reactive UI Patterns'

export const COMPONENTS = 'icon,page'
  .split(',')
  .map(expandComponent)

export const PAGES = [
  ['examples', 'Examples'],
  ['boolean', 'Boolean'],
  ['integer', 'Integer'],
  ['mode', 'Mode'],
  ['range', 'Range'],
  ['range-grid', 'Range: Grid'],
  ['form', 'Form'],
  ['lights', 'Lights']
].map(([id, title]) => ({ ...expandComponent(id), title }))

function expandComponent (id) {
  const component = `rui-${id}`
  const file = `${component}.js`
  const path = `/components/${file}`
  return { component, file, id, path }
}
