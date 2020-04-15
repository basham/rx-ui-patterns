import { define } from 'uce'

define('rui-examples', {
  connected () {
    this.html`
      <h1>Examples</h1>
      <ul>
        <li><a href='?p=form'>Form</a></li>
        <li><a href='?p=lights'>Lights</a></li>
      </ul>
    `
  }
})
