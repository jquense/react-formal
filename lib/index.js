var Form = require("./Form"),
    Field = require("./Field"),
    ValidationMessage = require("./ValidationMessage"),
    ValidationSummary = require("./ValidationSummary"),
    FormButton = require("./FormButton");

Form.Field = Field;
Form.Message = ValidationMessage;
Form.Summary = ValidationSummary;
Form.Button = FormButton;

module.exports = Form;