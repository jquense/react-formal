var Form = require('./Form')
  , Field = require('./Field')
  , ValidationMessage = require('./ValidationMessage')
  , { FormButton, FormSubmit } = require('./FormButton')

Form.Field = Field
Form.ValidationMessage = ValidationMessage
Form.Button = FormButton
Form.Submit = FormSubmit

module.exports = Form