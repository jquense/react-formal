'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

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

var _utilErrToJSON = require('./util/errToJSON');

var _utilErrToJSON2 = _interopRequireDefault(_utilErrToJSON);

var _FormButton = require('./FormButton');

var _FormButton2 = _interopRequireDefault(_FormButton);

var _addInputType = require('./addInputType');

var _addInputType2 = _interopRequireDefault(_addInputType);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

_Form2['default'].Field = _Field2['default'];
_Form2['default'].Message = _ValidationMessage2['default'];
_Form2['default'].Summary = _ValidationSummary2['default'];
_Form2['default'].Button = _FormButton2['default'];
_Form2['default'].Context = _FormContext2['default'];
_Form2['default'].Trigger = _reactInputMessageMessageTrigger2['default'];

_Form2['default'].toErrors = function (err) {
  var _json;

  _invariant2['default'](err && err.name === 'ValidationError', '`toErrors()` only works with ValidationErrors.');

  var json = _utilErrToJSON2['default'](err);

  if (!err.inner.length) json = (_json = {}, _json[err.path || ''] = [json], _json);

  return json;
};

_Form2['default'].addInputTypes = _addInputType2['default'];
_Form2['default'].setDefaults = function () {
  var defaults = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  _extends(_config2['default'], defaults);
};

module.exports = _Form2['default'];