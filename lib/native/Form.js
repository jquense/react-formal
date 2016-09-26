'use strict';

exports.__esModule = true;

var _reactNative = require('react-native');

var _setDefaults = require('./setDefaults');

var _setDefaults2 = _interopRequireDefault(_setDefaults);

var _Form = require('../Form');

var _Form2 = _interopRequireDefault(_Form);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// eslint-disable-line import/no-unresolved

exports.default = (0, _setDefaults2.default)(_Form2.default, {
  component: _reactNative.View
});
module.exports = exports['default'];