'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Input = require('../inputs/Input');

var _Input2 = _interopRequireDefault(_Input);

var _Date = require('../inputs/Date');

var _Date2 = _interopRequireDefault(_Date);

var _Number = require('../inputs/Number');

var _Number2 = _interopRequireDefault(_Number);

var _Bool = require('../inputs/Bool');

var _Bool2 = _interopRequireDefault(_Bool);

var _File = require('../inputs/File');

var _File2 = _interopRequireDefault(_File);

var _Select = require('../inputs/Select');

var _Select2 = _interopRequireDefault(_Select);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var localDt = 'datetime-local';

var wrapWithDefaults = function wrapWithDefaults(Component, defaults) {
  var _class, _temp;

  return _temp = _class = function (_React$Component) {
    _inherits(_class, _React$Component);

    function _class() {
      _classCallCheck(this, _class);

      return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
    }

    _class.prototype.render = function render() {
      return _react2.default.createElement(Component, _extends({}, defaults, this.props, {
        type: defaults.type || this.props.type
      }));
    };

    return _class;
  }(_react2.default.Component), _class.propTypes = {
    type: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.func])
  }, _temp;
};

var types = Object.create(null);

types.string = wrapWithDefaults(_Input2.default, { type: 'text' });
types.number = _Number2.default;

types.date = types.time = types.datetime = types[localDt] = _Date2.default;

types.array = types.listbox = wrapWithDefaults(_Select2.default, { multiple: true });

types.bool = types.boolean = _Bool2.default;

types.textarea = wrapWithDefaults(_Input2.default, { tagName: 'textarea' });

types.select = _Select2.default;
types.file = _File2.default;

exports.default = types;
module.exports = exports['default'];