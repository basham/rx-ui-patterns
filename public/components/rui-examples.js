import { define, html } from 'uce'
import { PAGES } from '../constants.js'

const [, ...pages] = PAGES

define('rui-examples', {
  connected () {
    this.html`
      <h1>Examples</h1>
      <ul>
        ${pages.map(renderLinkItem)}
      </ul>
    `
  }
})

function renderLinkItem (page) {
  const { id, title } = page
  const href = `?p=${id}`
  return html`
    <li><a href=${href}>${title}</a></li>
  `
}
