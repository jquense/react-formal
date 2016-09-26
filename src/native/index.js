import Trigger from 'react-input-message/MessageTrigger';
import Form from './Form';
import Field from './Field';
import Context from './FormContext';
import ValidationMessage from './ValidationMessage';
import ValidationSummary from './ValidationSummary';
import FormButton  from './FormButton';

Form.Field = Field
Form.Message = ValidationMessage
Form.Summary = ValidationSummary
Form.Button = FormButton
Form.Context = Context
Form.Trigger = Trigger

module.exports = Form
export default Form
