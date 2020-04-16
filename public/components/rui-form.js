import { define, html, renderComponent } from '../util/dom.js'
import { combineLatestObject } from '../util/rx.js'
import { useFocus, useMode, useSubscribe } from '../util/use.js'

define('rui-form', (el) => {
  const [subscribe, unsubscribe] = useSubscribe()
  const form = useForm()
  const props$ = combineLatestObject(form.props)
  const render$ = props$.pipe(
    renderComponent(el, renderForm)
  )
  subscribe(render$)
  return unsubscribe
})

function useForm () {
  const mode = useMode(['idle', 'edit'])
  const focus = useFocus()
  const methods = {
    idleMode,
    editMode
  }
  const props = {
    mode: mode.value$,
    ...methods
  }
  return {
    mode$: mode.value$,
    ...methods,
    props
  }

  function idleMode () {
    mode.set('idle')
    focus.refocus()
  }

  function editMode () {
    focus.remember()
    mode.set('edit')
    focus.focus(document.getElementById('name-input'))
  }
}

function renderForm (props) {
  return html`
    <h1>Form</h1>
    ${renderIdle(props)}
    ${renderEdit(props)}
  `
}

function renderIdle (props) {
  const { editMode, mode } = props
  return html`
    <dl .hidden=${mode !== 'idle'}>
      <dt>Profile</dt>
      <dd>Chris</dd>
      <dd>chris@example.com</dd>
      <dd>
        <button
          class='link'
          id='edit-profile'
          onclick=${editMode}>
          Edit
        </button>
      </dd>
    </dl>
  `
}

function renderEdit (props) {
  const { idleMode, mode, submit } = props
  return html`
    <form
      autocomplete='off'
      .hidden=${mode !== 'edit'}
      onsubmit=${submit}>
      <h2>Edit</h2>
      <div class='m-top-sm'>
        <label for='name-input'>
          Name
        </label>
        <input
          id='name-input'
          type='text' />
      </div>
      <div class='m-top-sm'>
        <label for='email-input'>
          Email
        </label>
        <input
          id='email-input'
          type='email' />
      </div>
      <div class='flex flex--gap-sm m-top-sm'>
        <button type='submit'>Save</button>
        <button
          onclick=${idleMode}
          type='button'>
          Cancel
        </button>
      </div>
    </form>
  `
}
