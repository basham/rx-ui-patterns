import { map } from 'rxjs/operators'
import { define, html, renderComponent } from '../util/dom.js'
import { combineLatestObject } from '../util/rx.js'
import { useFocus, useMode, useSubscribe, useValue } from '../util/use.js'

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

    nameField.checkValidity()
    emailField.checkValidity()

    // name.set(nameField.value())
    // email.set(emailField.value())
    // toIdleMode()
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
  const errorMessage = useValue('', { distinct: true })
  const error$ = combineLatestObject({
    id: `${id}-error-message`,
    message: errorMessage.value$
  }).pipe(
    map((value) => ({ ...value, invalid: !!value.message }))
  )
  const value$ = combineLatestObject({
    change,
    error: error$,
    id,
    label,
    required,
    type,
    value: field.value$
  })
  return {
    ...field,
    value$,
    getElement,
    checkValidity
  }

  function change (event) {
    field.set(event.target.value)
  }

  function checkValidity () {
    errorMessage.set(getErrorMessage())
  }

  function getErrorMessage () {
    const { valueMissing } = getElement().validity
    if (valueMissing) {
      return `Enter ${label}`
    }
    return ''
  }

  function getElement () {
    return document.getElementById(id)
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
      <div class='flex flex--gap-1 m-top-3'>
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
  const { change, error, id, label, required, type, value } = props
  return html`
    <div class='field m-top-3'>
      <label for=${id}>
        ${label} ${renderRequiredFieldIndicator(required)}
      </label>
      <input
        aria-describedby=${error.id}
        aria-invalid=${error.invalid}
        class='field__input'
        id=${id}
        onkeyup=${change}
        .required=${required}
        type=${type}
        .value=${value} />
      <div
        class='field__error flex flex--gap-1 m-top-1'
        .hidden=${!error.message}
        id=${error.id}>
        <rui-icon name='alert-circle' />
        <span>${error.message}</span>
      </div>
    </div>
  `
}

function renderRequiredFieldIndicator (required) {
  if (required) {
    return html`<span class='field__required'>*</span>`
  }
  return html`<span class='field__optional'>(optional)</span>`
}
