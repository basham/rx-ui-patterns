import { define, html, renderComponent } from '../util/dom.js'
import { combineLatestObject } from '../util/rx.js'
import { useBoolean, useFocus, useMode, useSubscribe, useValue } from '../util/use.js'

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
  const name = useValue('Chris')
  const email = useValue('me@example.com')
  const nameField = useField({ id: 'name-field' })
  const emailField = useField({ id: 'email-field' })
  const focus = useFocus()
  const methods = {
    submit,
    toIdleMode,
    toEditMode
  }
  const props = {
    mode: mode.value$,
    name: name.value$,
    email: email.value$,
    nameField: nameField.props$,
    emailField: emailField.props$,
    ...methods
  }
  return {
    mode$: mode.value$,
    ...methods,
    props
  }

  function submit (event) {
    event.preventDefault()
    name.set(nameField.value())
    email.set(emailField.value())
    toIdleMode()
  }

  function toIdleMode () {
    mode.set('idle')
    focus.refocus()
  }

  function toEditMode () {
    focus.remember()
    nameField.set(name.value())
    emailField.set(email.value())
    mode.set('edit')
    focus.focus(nameField.getElement())
  }
}

function useField (options = {}) {
  const { id, value = '' } = options
  const field = useValue(value)
  const emptyError = useBoolean(false)
  const props = {
    id,
    invalid: emptyError.value$,
    set: field.set,
    change,
    value: field.value$
  }
  const props$ = combineLatestObject(props)
  return {
    ...field,
    props$,
    getElement,
    props,
    verify
  }

  function change (event) {
    field.set(event.target.value)
  }

  function getElement () {
    return document.getElementById(id)
  }

  function verify () {
    const empty = !field.value.length
    emptyError.set(empty)
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
  const { toEditMode, mode } = props
  const { name, email } = props
  return html`
    <dl .hidden=${mode !== 'idle'}>
      <dt>Profile</dt>
      <dd>${name}</dd>
      <dd>${email}</dd>
      <dd>
        <button
          class='link'
          id='edit-profile'
          onclick=${toEditMode}>
          Edit
        </button>
      </dd>
    </dl>
  `
}

function renderEdit (props) {
  const { toIdleMode, mode, submit } = props
  const { nameField, emailField } = props
  return html`
    <form
      autocomplete='off'
      .hidden=${mode !== 'edit'}
      novalidate
      onsubmit=${submit}>
      <h2>Edit</h2>
      <div class='m-top-sm'>
        <label for=${nameField.id}>
          Name (required)
        </label>
        <input
          aria-invalid=${nameField.invalid}
          id=${nameField.id}
          onkeyup=${nameField.change}
          required
          type='text'
          .value=${nameField.value} />
      </div>
      <div class='m-top-sm'>
        <label for=${emailField.id}>
          Email (required)
        </label>
        <input
          aria-invalid=${emailField.invalid}
          id=${emailField.id}
          onkeyup=${emailField.change}
          required
          type='email'
          .value=${emailField.value} />
      </div>
      <div class='flex flex--gap-sm m-top-sm'>
        <button type='submit'>Save</button>
        <button
          onclick=${toIdleMode}
          type='button'>
          Cancel
        </button>
      </div>
    </form>
  `
}
