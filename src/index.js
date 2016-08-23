import Trigger from 'react-input-message/MessageTrigger';
import Form from './Form';
import Field from './Field';
import Context from './FormContext';
import ValidationMessage from './ValidationMessage';
import ValidationSummary from './ValidationSummary';
import errToJSON from './util/errToJSON';
import FormButton  from './FormButton';
import addType  from './addInputType';
import config from './config';
import invariant from 'invariant';

Form.Field = Field
Form.Message = ValidationMessage
Form.Summary = ValidationSummary
Form.Button = FormButton
Form.Context = Context;
Form.Trigger = Trigger;

Form.setter = Form.ControlledComponent.defaultProps.setter;
Form.getter = Form.ControlledComponent.defaultProps.getter;

Form.toErrors = (err) => {
  invariant(err && err.name === 'ValidationError',
    '`toErrors()` only works with ValidationErrors.')

  return errToJSON(err)
}

Form.addInputTypes = addType
Form.setDefaults = (defaults = {}) => {
  Object.assign(config, defaults)
}

module.exports = Form
export default Form
