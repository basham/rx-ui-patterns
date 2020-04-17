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
  const nameField = useField({ id: 'name-field', value: 'Chris' })
  const emailField = useField({ id: 'email-field', value: 'me@example.com' })
  const focus = useFocus()
  const methods = {
    submit,
    toIdleMode,
    toEditMode
  }
  const props = {
    mode: mode.value$,
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
    nameField.verify()
    emailField.verify()
  }

  function toIdleMode () {
    mode.set('idle')
    focus.refocus()
  }

  function toEditMode () {
    focus.remember()
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
    props$,
    field,
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
  const { nameField, emailField } = props
  return html`
    <dl .hidden=${mode !== 'idle'}>
      <dt>Profile</dt>
      <dd>${nameField.value}</dd>
      <dd>${emailField.value}</dd>
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
