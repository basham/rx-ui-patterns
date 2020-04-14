import { BehaviorSubject } from 'rxjs'
import { distinctUntilChanged, map, shareReplay, switchMap } from 'rxjs/operators'
import { define, html, renderComponent } from '../util/dom.js'
import { combineLatestObject } from '../util/rx.js'
import { useBoolean, useMode, useSubscribe } from '../util/use.js'

define('rui-form', (el) => {
  const [subscribe, unsubscribe] = useSubscribe()
  const field = useField()
  const props$ = combineLatestObject({
    mode: field.mode$,
    idleMode: field.idleMode,
    editMode: field.editMode
  })
  const render$ = props$.pipe(
    renderComponent(el, renderForm)
  )
  subscribe(render$)
  return unsubscribe
})

function useField () {
  const mode = useMode(['idle', 'edit'])
  const idleMode = () => mode.set('idle')
  const editMode = () => mode.set('edit')
  return {
    mode$: mode.value$,
    idleMode,
    editMode
  }
}

const renderMap = {
  idle: renderIdle,
  edit: renderEdit
}

function renderForm (props) {
  const { mode } = props
  return renderMap[mode](props)
}

function renderIdle (props) {
  const { editMode } = props
  return html`
    <h2>Form</h2>
    <dl>
      <dt>Name</dt>
      <dd>Chris</dd>
      <dd>
        <button
          class='link'
          onclick=${editMode}>
          Edit
        </button>
      </dd>
    </dl>
  `
}

function renderEdit (props) {
  const { idleMode, submit } = props
  return html`
    <form
      autocomplete='off'
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
