import { map } from 'rxjs/operators'
import { define, html } from 'uce'
import { createSubscribe, createValue } from '../util/create.js'
import { connect, render } from '../util/dom.js'
import { combineLatestObject } from '../util/rx.js'

const COLORS = 'Red,Orange,Yellow,Green,Blue,Indigo,Violet'
  .split(',')

define('rui-delete-item', connect(init))

function init (el) {
  const [subscribe, unsubscribe] = createSubscribe()
  const colors = createColors()
  const props$ = combineLatestObject(colors.props)
  const render$ = props$.pipe(
    render(el, renderTable)
  )
  subscribe(render$)
  return unsubscribe
}

function createColors () {
  const colors = COLORS
    .map((color, index) => {
      const id = index + 1
      const key = {}
      const del = () => deleteItem(id)
      return [id, { color, del, id, key }]
    })
  const colorsMap = createValue(new Map(colors))
  const colors$ = colorsMap.get$.pipe(
    map((colorsMap) => [...colorsMap.values()])
  )
  const props = {
    colors: colors$
  }
  return {
    props
  }

  function deleteItem (id) {
    colorsMap.get().delete(id)
    colorsMap.update()
  }
}

function renderTable (props) {
  const { colors } = props
  return html`
    <hr />
    <table>
      <thead>
        <th>ID</th>
        <th>Color</th>
        <th>Actions</th>
      </thead>
      <tbody>
        ${colors.map(renderRow)}
      </tbody>
    </table>
  `
}

function renderRow (props) {
  const { color, del, id, key } = props
  return html.for(key)`
    <tr>
      <td>${id}</td>
      <td>${color}</td>
      <td>
        <button onclick=${del}>Delete</button>
      </td>
    </tr>
  `
}
