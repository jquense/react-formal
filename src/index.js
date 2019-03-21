import Form from './Form'
import Field, { useField, useMergedHandlers } from './Field'
import FieldArray, { useFieldArray } from './FieldArray'
import Message from './Message'
import Summary from './Summary'
import errToJSON from './utils/errToJSON'
import Submit from './FormSubmit'
import config from './config'
import invariant from 'invariant'

const statics = {
  Field,
  FieldArray,
  Message,
  Summary,
  Submit,
  useField,
  useMergedHandlers,
  useFieldArray,
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
