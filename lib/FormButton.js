'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');
var warning = require('warning');
var Trigger = require('react-input-message/lib/MessageTrigger');

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

    warning(!group || type.toLowerCase() !== 'submit', 'You have specified a `group` prop with type="submit" on this Form.Button component. ' + 'submit type buttons will automatically trigger a form wide validation. ' + 'to trigger validation for just the group: `' + group + '` use type="button" instead.');

    if (type.toLowerCase() === 'submit') return React.createElement(
      Component,
      _extends({}, props, { onClick: this.context.onFormSubmit }),
      this.props.children
    );

    return React.createElement(
      Trigger,
      { group: group, events: events },
      React.createElement(
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
      type: React.PropTypes.oneOf(['button', 'submit']),

      /**
       * Specify a group to validate, if empty the entire form will be validated.
       * If the button type is 'submit' the group will be ignored and the
       * entire form will be validated prior to submission.
       */
      group: React.PropTypes.string,

      component: React.PropTypes.string,

      /**
       * An array of event names that trigger validation.
       */
      events: React.PropTypes.arrayOf(React.PropTypes.string)
    },
    enumerable: true
  }, {
    key: 'contextTypes',
    value: {
      onFormSubmit: React.PropTypes.func
    },
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
})(React.Component);

module.exports = Button;