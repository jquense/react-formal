'use strict';
var Form = require('./Form')
  , Field = require('./Field')
  , ValidationMessage = require('./ValidationMessage')
  , ValidationSummary = require('./ValidationSummary')
  , FormButton  = require('./FormButton')
  , addType  = require('./addInputType')

Form.Field = Field
Form.Message = ValidationMessage
Form.Summary = ValidationSummary
Form.Button = FormButton

Form.addInputType = addType

module.exports = Form