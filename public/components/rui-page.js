import { define, html } from 'uce'

const TITLE = 'Reactive UI Patterns'
const DEFAULT_PAGE = 'default'

const pages = {
  default: [null, html`<rui-examples />`],
  boolean: ['useBoolean', html`<rui-boolean />`],
  form: ['Form', html`<rui-form />`],
  int: ['useInt', html`<rui-int />`],
  lights: ['Lights', html`<rui-lights />`]
}

const url = new URL(window.location.href)
const params = new URLSearchParams(url.search)
const name = params.get('p')
const hasPage = Object.keys(pages).includes(name)
const page = hasPage ? name : DEFAULT_PAGE
const [title, content] = pages[page]

document.title = [title, TITLE].filter((v) => v).join(' - ')

define('rui-page', {
  connected () {
    this.html`
      <header role='banner'>
        <div class='content'>
          <a href='/'>${TITLE}</a>
        </div>
      </header>
      <main class='content'>
        ${content}
      </main>
    `
  }
})
