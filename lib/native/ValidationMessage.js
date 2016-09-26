'use strict';

exports.__esModule = true;

var _reactNative = require('react-native');

var _setDefaults = require('./setDefaults');

var _setDefaults2 = _interopRequireDefault(_setDefaults);

var _ValidationMessage = require('../ValidationMessage');

var _ValidationMessage2 = _interopRequireDefault(_ValidationMessage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// eslint-disable-line import/no-unresolved

exports.default = (0, _setDefaults2.default)(_ValidationMessage2.default, {
  component: _reactNative.Text,
  errorClass: undefined
});
module.exports = exports['default'];