import { define, html } from 'uce'
import { PAGES, TITLE } from '../constants.js'

const url = new URL(window.location.href)
const params = new URLSearchParams(url.search)
const pageId = params.get('p')
const page = PAGES.find(({ id }) => id === pageId) || PAGES[0]
const { component, description, file, title, path } = page

document.title = [title, TITLE].filter((v) => v).join(' - ')

define('rui-page', {
  async connected () {
    await import(path)
    this.html`
      <header role='banner'>
        <div class='content flex flex--gap-4 flex--wrap'>
          <a href='/'>${TITLE}</a>
          <a href='https://github.com/basham/rx-ui-patterns'>GitHub repo</a>
        </div>
      </header>
      <main class='content'>
        <h1>${title}</h1>
        <p>
          <a href=${path}><code>${file}</code></a>
        </p>
        <p>${html([description])}</p>
        ${html([`<${component} />`])}
      </main>
    `
  }
})
