'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  reactFormalContext: _react2.default.PropTypes.shape({
    noValidate: _react2.default.PropTypes.bool,
    schema: _react2.default.PropTypes.func,
    onFieldError: _react2.default.PropTypes.func,
    onSubmit: _react2.default.PropTypes.func,
    onOptions: _react2.default.PropTypes.func
  })
};
module.exports = exports['default'];