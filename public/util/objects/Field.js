import { namespace } from './util.js'
import { ErrorMessage } from './ErrorMessage.js'
import { isObject } from '../object.js'

const internal = namespace()

export function Field (config) {
  this.config = config
}

Field.prototype = {
  get config () {
    return internal(this).config
  },
  set config (config = {}) {
    if (!isObject(config)) {
      throw new Error('"config" must be an object.')
    }
    const { id, label, required = true, type = 'text', value = '' } = config
    this.id = id
    this.label = label
    this.required = required
    this.type = type
    this.value = value
    internal(this).error = new ErrorMessage({
      label,
      targetId: id,
      type
    })
    internal(this).config = { id, label, required, type, value }
  },
  get error () {
    return internal(this).error
  },
  get id () {
    return internal(this).id
  },
  set id (id) {
    internal(this).id = id
  },
  get label () {
    return internal(this).label
  },
  set label (label) {
    internal(this).label = label
  },
  get required () {
    return internal(this).required
  },
  set required (required) {
    internal(this).required = required
  },
  get type () {
    return internal(this).type
  },
  set type (type) {
    internal(this).type = type
  },
  get value () {
    return internal(this).value
  },
  set value (value) {
    internal(this).value = value
  },
  change (event) {
    this.value = event.target.value
    console.log('# Changed', this.label, this.value)
  },
  checkValidity () {
    return this.error.checkValidity()
  }
}
