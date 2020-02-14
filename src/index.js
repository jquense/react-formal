import invariant from 'invariant'
import Field from './Field'
import FieldArray, { useFieldArray } from './FieldArray'
import Form from './Form'
import Submit, { useFormSubmit } from './FormSubmit'
import Message from './Message'
import Summary from './Summary'
import config from './config'
import useField from './useField'
import errToJSON from './utils/errToJSON'
import useEventHandlers, { useMergedHandlers } from './utils/useEventHandlers'
const statics = {
  Field,
  FieldArray,
  Message,
  Summary,
  Submit,
  setDefaults(defaults = {}) {
    Object.assign(config, defaults)
  },
  toErrors(err) {
    invariant(
      err && err.name === 'ValidationError',
      '`toErrors()` only works with ValidationErrors.',
    )
    return errToJSON(err)
  },
}

Object.assign(Form, statics)

Form.statics = statics

export {
  statics,
  useEventHandlers,
  useMergedHandlers,
  useField,
  useFieldArray,
  useFormSubmit,
}
export default Form
