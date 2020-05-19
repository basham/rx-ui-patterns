import { isObject, namespace } from './util.js'

const internal = namespace()

export function ErrorMessage (config) {
  this.config = config
}

ErrorMessage.prototype = {
  get config () {
    return internal(this).config
  },
  set config (config = {}) {
    if (!isObject(config)) {
      throw new Error('"config" must be an object.')
    }
    const { id, label, targetId, type } = config
    this.id = id
    this.label = label
    this.message = ''
    this.targetId = targetId
    this.type = type
    internal(this).config = { id, label, targetId, type }
  },
  get id () {
    return internal(this).id
  },
  set id (id) {
    internal(this).id = id
  },
  get invalid () {
    return !!internal(this).message
  },
  get label () {
    return internal(this).label
  },
  set label (label) {
    internal(this).label = label
  },
  get message () {
    return internal(this).message
  },
  set message (message) {
    internal(this).message = message
  },
  get target () {
    return document.getElementById(this.targetId)
  },
  get targetId () {
    return internal(this).targetId
  },
  set targetId (targetId) {
    internal(this).targetId = targetId
  },
  get type () {
    return internal(this).type
  },
  set type (type) {
    internal(this).type = type
  },
  checkValidity () {
    const { validity } = this.target
    this.message = getMessage(this, validity)
    return validity.valid
  }
}

function getMessage (context, validity) {
  const { label, type } = context
  if (validity.valueMissing) {
    return `Enter ${label}`
  }
  if (validity.typeMismatch && type === 'email') {
    return `${label} must be a valid address`
  }
  return ''
}
