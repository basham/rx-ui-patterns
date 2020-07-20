import { define, html } from 'uce'
import { PAGES, TITLE } from '../constants.js'

const url = new URL(window.location.href)
const params = new URLSearchParams(url.search)
const pageId = params.get('p')
const page = PAGES.find(({ id }) => id === pageId) || PAGES[0]
const { component, title, path } = page

document.title = [title, TITLE].filter((v) => v).join(' - ')

define('rui-page', {
  async init () {
    await import(path)
  },
  connected () {
    this.html`
      <header role='banner'>
        <div class='content'>
          <a href='/'>${TITLE}</a>
        </div>
      </header>
      <main class='content'>
        <h1>${title}</h1>
        <p><a href=${path}>Source code</a></p>
        ${html([`<${component} />`])}
      </main>
    `
  }
})
