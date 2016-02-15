'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

var _reactInputMessageMessageTrigger = require('react-input-message/MessageTrigger');

var _reactInputMessageMessageTrigger2 = _interopRequireDefault(_reactInputMessageMessageTrigger);

var _chainFunction = require('chain-function');

var _chainFunction2 = _interopRequireDefault(_chainFunction);

var _utilContextType = require('./util/contextType');

var _utilContextType2 = _interopRequireDefault(_utilContextType);

/**
 * A Form Button, for triggering validations for specific Field groups
 */

var Button = (function (_React$Component) {
  _inherits(Button, _React$Component);

  function Button() {
    _classCallCheck(this, Button);

    _React$Component.apply(this, arguments);
  }

  Button.prototype.render = function render() {
    var _props = this.props;
    var type = _props.type;
    var group = _props.group;
    var events = _props.events;
    var Component = _props.component;

    var props = _objectWithoutProperties(_props, ['type', 'group', 'events', 'component']);

    var context = this.context.reactFormalContext;

    _warning2['default'](!group || type.toLowerCase() !== 'submit', 'You have specified a `group` prop with type="submit" on this Form.Button component. ' + 'submit type buttons will automatically trigger a form wide validation. ' + 'to trigger validation for just the group: `' + group + '` use type="button" instead.');

    if (type.toLowerCase() === 'submit') return _react2['default'].createElement(
      Component,
      _extends({}, props, { onClick: _chainFunction2['default'](props.onClick, context.onSubmit) }),
      this.props.children
    );

    return _react2['default'].createElement(
      _reactInputMessageMessageTrigger2['default'],
      { group: group, events: events },
      _react2['default'].createElement(
        Component,
        _extends({}, props, { type: type }),
        this.props.children
      )
    );
  };

  _createClass(Button, null, [{
    key: 'propTypes',
    value: {
      /**
       * The `<button/>` type
       */
      type: _react2['default'].PropTypes.oneOf(['button', 'submit']),

      /**
       * Specify a group to validate, if empty the entire form will be validated.
       * If the button type is 'submit' the group will be ignored and the
       * entire form will be validated prior to submission.
       */
      group: _react2['default'].PropTypes.string,

      component: _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.string, _react2['default'].PropTypes.func]),

      /**
       * An array of event names that trigger validation.
       */
      events: _react2['default'].PropTypes.arrayOf(_react2['default'].PropTypes.string)
    },
    enumerable: true
  }, {
    key: 'contextTypes',
    value: _utilContextType2['default'],
    enumerable: true
  }, {
    key: 'defaultProps',
    value: {
      type: 'button',
      component: 'button',
      events: ['onClick']
    },
    enumerable: true
  }]);

  return Button;
})(_react2['default'].Component);

module.exports = Button;