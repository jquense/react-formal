'use strict';

exports.__esModule = true;

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  reactFormalContext: _propTypes2.default.shape({
    noValidate: _propTypes2.default.bool,
    schema: _propTypes2.default.func,
    onFieldError: _propTypes2.default.func,
    onSubmit: _propTypes2.default.func,
    onOptions: _propTypes2.default.func
  })
};
module.exports = exports['default'];