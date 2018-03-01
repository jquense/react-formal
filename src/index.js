import Form from './Form'
import Field from './Field'
import FieldArray from './FieldArray'
import Context from './FormContext'
import Trigger from './FormTrigger'
import Message from './Message'
import Summary from './Summary'
import errToJSON from './utils/errToJSON'
import FormButton from './FormButton'
import addType from './addInputType'
import config from './config'
import invariant from 'invariant'

Form.Field = Field
Form.FieldArray = FieldArray
Form.Message = Message
Form.Summary = Summary
Form.Button = FormButton
Form.Context = Context
Form.Trigger = Trigger

Form.toErrors = err => {
  invariant(
    err && err.name === 'ValidationError',
    '`toErrors()` only works with ValidationErrors.'
  )

  return errToJSON(err)
}

Form.addInputTypes = addType
Form.setDefaults = (defaults = {}) => {
  Object.assign(config, defaults)
}

module.exports = Form
export default Form
