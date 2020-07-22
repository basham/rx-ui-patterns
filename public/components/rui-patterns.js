import { define, html } from 'uce'
import { PAGES } from '../constants.js'

const [, ...pages] = PAGES

define('rui-patterns', {
  connected () {
    this.html`
      <hr />
      <dl>
        ${pages.map(renderLinkItem)}
      </dl>
    `
  }
})

function renderLinkItem (page) {
  const { description, id, title } = page
  const href = `?p=${id}`
  return html`
    <dt><a href=${href}>${title}</a></dt>
    <dd>${description}</dd>
  `
}
