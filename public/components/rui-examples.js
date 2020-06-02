import { define, html } from 'uce'
import { PAGES } from '../constants.js'
import '../util/rx/auditMap.test.js'

const [, ...pages] = PAGES

define('rui-examples', {
  connected () {
    this.html`
      <hr />
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
