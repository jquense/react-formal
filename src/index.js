'use strict';
var types =  require('./util/types')
  , Form = require('./Form')
  , Field = require('./Field')
  , ValidationMessage = require('./ValidationMessage')
  , ValidationSummary = require('./ValidationSummary')
  , FormButton  = require('./FormButton')

Form.Field = Field
Form.Message = ValidationMessage
Form.Summary = ValidationSummary
Form.Button = FormButton

Form.addType = (type, Component) => {
  let compType = typeof Component;

  if ( typeof type !== 'string') 
    throw new TypeError('the `type` parameter must be a string')

  if ( compType !== 'string' || compType !== 'function' ) 
    throw new TypeError('The `Component` parameter must be a valid React Component class or tag name')

  types[type] = Component
}

module.exports = Form