import Form from './Form'
import Field from './Field'
import FieldArray from './FieldArray'
import Context from './FormContext'
import Trigger from './FormTrigger'
import Message from './Message'
import Summary from './Summary'
import errToJSON from './utils/errToJSON'
import Button from './FormButton'
import addInputTypes from './addInputType'
import config from './config'
import invariant from 'invariant'

const statics = {
  Field,
  FieldArray,
  Message,
  Summary,
  Button,
  Context,
  Trigger,
  addInputTypes,
  setDefaults(defaults = {}) {
    Object.assign(config, defaults)
  },
  toErrors(err) {
    invariant(
      err && err.name === 'ValidationError',
      '`toErrors()` only works with ValidationErrors.'
    )
    return errToJSON(err)
  },
}

Object.assign(Form, statics)

Form.statics = statics

export { statics }
export default Form
