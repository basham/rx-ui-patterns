import { define } from '/web_modules/uce.js'

define('rui-icon', {
  observedAttributes: ['name'],
  attributeChanged () {
    this.connected()
  },
  connected () {
    const name = this.getAttribute('name')
    const href = `/icons.svg#${name}`
    this.html`
      <svg aria-hidden='true'>
        <use href=${href}></use>
      </svg>
    `
  }
})
