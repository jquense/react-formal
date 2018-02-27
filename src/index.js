import Form from './Form'
import Field from './Field'
import Context from './FormContext'
import Trigger from './MessageTrigger'
import ValidationMessage from './ValidationMessage'
import ValidationSummary from './ValidationSummary'
import errToJSON from './utils/errToJSON'
import FormButton from './FormButton'
import addType from './addInputType'
import config from './config'
import invariant from 'invariant'

Form.Field = Field
Form.Message = ValidationMessage
Form.Summary = ValidationSummary
Form.Button = FormButton
Form.Context = Context
Form.Trigger = Trigger


Form.toErrors = err => {
  invariant(err && err.name === 'ValidationError', '`toErrors()` only works with ValidationErrors.')

  return errToJSON(err)
}

Form.addInputTypes = addType
Form.setDefaults = (defaults = {}) => {
  Object.assign(config, defaults)
}

module.exports = Form
export default Form
