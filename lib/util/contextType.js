'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

exports['default'] = {
  reactFormalContext: _react2['default'].PropTypes.shape({
    noValidate: _react2['default'].PropTypes.bool,
    schema: _react2['default'].PropTypes.func,
    onSubmit: _react2['default'].PropTypes.func,
    onOptions: _react2['default'].PropTypes.func
  }).isRequired
};
module.exports = exports['default'];