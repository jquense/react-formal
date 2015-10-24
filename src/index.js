import Form from './Form';
import Field from './Field';
import ValidationMessage from './ValidationMessage';
import ValidationSummary from './ValidationSummary';
import FormButton  from './FormButton';
import addType  from './addInputType';

Form.Field = Field
Form.Message = ValidationMessage
Form.Summary = ValidationSummary
Form.Button = FormButton

Form.addInputTypes = addType

module.exports = Form
