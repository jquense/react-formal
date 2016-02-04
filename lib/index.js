'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _Form = require('./Form');

var _Form2 = _interopRequireDefault(_Form);

var _Field = require('./Field');

var _Field2 = _interopRequireDefault(_Field);

var _FormContext = require('./FormContext');

var _FormContext2 = _interopRequireDefault(_FormContext);

var _reactInputMessageMessageTrigger = require('react-input-message/MessageTrigger');

var _reactInputMessageMessageTrigger2 = _interopRequireDefault(_reactInputMessageMessageTrigger);

var _ValidationMessage = require('./ValidationMessage');

var _ValidationMessage2 = _interopRequireDefault(_ValidationMessage);

var _ValidationSummary = require('./ValidationSummary');

var _ValidationSummary2 = _interopRequireDefault(_ValidationSummary);

var _FormButton = require('./FormButton');

var _FormButton2 = _interopRequireDefault(_FormButton);

var _addInputType = require('./addInputType');

var _addInputType2 = _interopRequireDefault(_addInputType);

_Form2['default'].Field = _Field2['default'];
_Form2['default'].Message = _ValidationMessage2['default'];
_Form2['default'].Summary = _ValidationSummary2['default'];
_Form2['default'].Button = _FormButton2['default'];
_Form2['default'].Context = _FormContext2['default'];
_Form2['default'].Trigger = _reactInputMessageMessageTrigger2['default'];
_Form2['default'].addInputTypes = _addInputType2['default'];

module.exports = _Form2['default'];