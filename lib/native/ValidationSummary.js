'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactNative = require('react-native');

var _setDefaults = require('./setDefaults');

var _setDefaults2 = _interopRequireDefault(_setDefaults);

var _ValidationSummary = require('../ValidationSummary');

var _ValidationSummary2 = _interopRequireDefault(_ValidationSummary);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// eslint-disable-line import/no-unresolved

_ValidationSummary2.default.defaultProps.formatMessage = function (message, idx) {
  return _react2.default.createElement(
    _reactNative.Text,
    { key: idx },
    message
  );
};

exports.default = (0, _setDefaults2.default)(_ValidationSummary2.default, {
  component: _reactNative.View,
  formatMessage: function formatMessage(message, idx) {
    return _react2.default.createElement(
      _reactNative.Text,
      { key: idx },
      message
    );
  }
});
module.exports = exports['default'];