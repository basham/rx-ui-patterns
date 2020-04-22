import { combineLatest, of } from 'rxjs'
import { map, shareReplay, tap } from 'rxjs/operators'
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
  const fields = [nameField, emailField]
  const errorMessages = fields.map(({ errorMessage }) => errorMessage)
  const errorSummary = useErrorSummary({
    errorMessages,
    id: 'error-summary'
  })
  const focus = useFocus()
  const value$ = combineLatestObject({
    mode: mode.value$,
    name: name.value$,
    email: email.value$,
    nameField: nameField.value$,
    emailField: emailField.value$,
    errorSummary: errorSummary.value$,
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
    const isValid = errorSummary.checkValidity()
    if (!isValid) {
      return
    }
    name.set(nameField.value().value)
    email.set(emailField.value().value)
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
    nameField.focus()
  }
}

function useField (options = {}) {
  const { id, label = '', required = true, type = 'text', value = '' } = options
  const field = useValue(value)
  const errorMessage = useErrorMessage({ id, label, type })
  const latest = useValue()
  const value$ = combineLatestObject({
    change,
    error: errorMessage.value$,
    id,
    label,
    required,
    type,
    value: field.value$
  }).pipe(
    latest.tapSet(),
    shareReplay(1)
  )
  return {
    ...field,
    error$: errorMessage.value$,
    value$,
    checkValidity: errorMessage.checkValidity,
    errorMessage,
    focus,
    value: latest.value
  }

  function change (event) {
    field.set(event.target.value)
  }

  function focus () {
    window.requestAnimationFrame(() => {
      document.getElementById(id).focus()
    })
  }
}

function useErrorSummary (options = {}) {
  const { errorMessages, id } = options
  const errorMessagesValues = errorMessages.map(({ value$ }) => value$)
  const value$ = combineLatest(errorMessagesValues).pipe(
    map((allErrors) => {
      const errors = allErrors
        .filter(({ invalid }) => invalid)
      const count = errors.length
      return { count, errors, id }
    }),
    tap(({ count, errors, id }) => {
      if (count === 0) {
        return
      }
      const focusTarget = count === 1 ? errors[0].target : id
      window.requestAnimationFrame(() => {
        const el = document.getElementById(focusTarget)
        if (el) {
          el.focus()
        }
      })
    }),
    shareReplay(1)
  )
  return {
    value$,
    checkValidity
  }

  function checkValidity () {
    const validCount = errorMessages
      .filter((errorMessage) => errorMessage.checkValidity())
      .length
    const isValid = validCount === errorMessages.length
    return isValid
  }
}

function useErrorMessage (options = {}) {
  const { id, label, type } = options
  const message = useValue('', { distinct: true })
  const value$ = combineLatestObject({
    id: `${id}-error-message`,
    message: message.value$,
    target: id
  }).pipe(
    map((value) => ({ ...value, invalid: !!value.message })),
    shareReplay(1)
  )
  return {
    value$,
    checkValidity
  }

  function checkValidity () {
    const { validity } = document.getElementById(id)
    const text = getMessage(validity)
    message.set(text)
    return validity.valid
  }

  function getMessage (validity) {
    if (validity.valueMissing) {
      return `Enter ${label}`
    }
    if (validity.typeMismatch && type === 'email') {
      return `${label} must be a valid address`
    }
    return ''
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
  const { nameField, emailField, errorSummary } = props
  return html`
    <form
      autocomplete='off'
      .hidden=${mode !== 'edit'}
      novalidate
      onsubmit=${submit}>
      ${renderErrorSummary(errorSummary)}
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

function renderErrorSummary (props) {
  const { count, errors, id } = props
  const titleId = `${id}-title`
  return html`
    <div
      aria-labelledby=${titleId}
      class='error-summary m-top-4'
      id='error-summary'
      .hidden=${count < 2}
      role='alert'
      tabindex='-1'>
      <h2
        class='m-none'
        id=${titleId}>
        There is a problem
      </h2>
      <ol class='plain-list m-top-1'>
        ${errors.map(renderErrorSummaryItem)}
      </ol>
    </div>
  `
}

function renderErrorSummaryItem (error) {
  const { message, target } = error
  return html`
    <li class='m-none'>
      <a
        class='link'
        href=${`#${target}`}>
        ${message}
      </a>
    </li>
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
        <span class='sr-only'>Error: </span>
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
