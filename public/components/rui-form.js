import { define, html, renderComponent } from '../util/dom.js'
import { combineLatestObject } from '../util/rx.js'
import { useBoolean, useFocus, useMode, useSubscribe, useValue } from '../util/use.js'

define('rui-form', (el) => {
  const [subscribe, unsubscribe] = useSubscribe()
  const form = useForm()
  const render$ = form.value$.pipe(
    renderComponent(el, renderForm)
  )
  subscribe(render$)
  return unsubscribe
})

function useForm () {
  const mode = useMode(['idle', 'edit'])
  const name = useValue('Chris')
  const email = useValue('me@example.com')
  const nameField = useField({
    id: 'name-field',
    label: 'Name'
  })
  const emailField = useField({
    id: 'email-field',
    label: 'Email',
    type: 'email'
  })
  const focus = useFocus()
  const value$ = combineLatestObject({
    mode: mode.value$,
    name: name.value$,
    email: email.value$,
    nameField: nameField.value$,
    emailField: emailField.value$,
    cancel,
    edit,
    submit
  })
  return {
    value$
  }

  function cancel () {
    toIdleMode()
  }

  function edit () {
    toEditMode()
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
  const { id, label = '', required = true, type = 'text', value = '' } = options
  const field = useValue(value)
  const emptyError = useBoolean(false)
  const value$ = combineLatestObject({
    change,
    id,
    invalid: emptyError.value$,
    label,
    required,
    type,
    value: field.value$
  })
  return {
    ...field,
    value$,
    getElement,
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
  const { edit, mode } = props
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
          onclick=${edit}>
          Edit
        </button>
      </dd>
    </dl>
  `
}

function renderEdit (props) {
  const { cancel, mode, submit } = props
  const { nameField, emailField } = props
  return html`
    <form
      autocomplete='off'
      .hidden=${mode !== 'edit'}
      novalidate
      onsubmit=${submit}>
      <h2>Edit</h2>
      ${renderField(nameField)}
      ${renderField(emailField)}
      <div class='flex flex--gap-sm m-top-md'>
        <button type='submit'>Save</button>
        <button
          onclick=${cancel}
          type='button'>
          Cancel
        </button>
      </div>
    </form>
  `
}

function renderField (props) {
  const { change, id, invalid, label, required, type, value } = props
  return html`
    <div class='field'>
      <label for=${id}>
        ${label} ${renderRequiredFieldIndicator(required)}
      </label>
      <input
        aria-invalid=${invalid}
        id=${id}
        onkeyup=${change}
        .required=${required}
        type=${type}
        .value=${value} />
    </div>
  `
}

function renderRequiredFieldIndicator (required) {
  if (required) {
    return html`<span class='field__required'>*</span>`
  }
  return html`<span class='field__optional'>(optional)</span>`
}
