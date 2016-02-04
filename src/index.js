import Form from './Form';
import Field from './Field';
import Context from './FormContext';
import Trigger from 'react-input-message/MessageTrigger';
import ValidationMessage from './ValidationMessage';
import ValidationSummary from './ValidationSummary';
import FormButton  from './FormButton';
import addType  from './addInputType';

Form.Field = Field
Form.Message = ValidationMessage
Form.Summary = ValidationSummary
Form.Button = FormButton
Form.Context = Context;
Form.Trigger = Trigger;
Form.addInputTypes = addType

module.exports = Form
