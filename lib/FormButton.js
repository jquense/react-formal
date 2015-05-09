'use strict';

var babelHelpers = require('./util/babelHelpers.js');

var React = require('react');
var warning = require('scoped-warning')('formal-yup');
var Trigger = require('react-input-message/lib/MessageTrigger');

/**
 * A Form Button, for triggering validations for specific Field groups
 */

var Button = (function (_React$Component) {
  function Button() {
    babelHelpers.classCallCheck(this, Button);

    if (_React$Component != null) {
      _React$Component.apply(this, arguments);
    }
  }

  babelHelpers.inherits(Button, _React$Component);

  Button.prototype.render = function render() {
    var _props = this.props;
    var type = _props.type;
    var group = _props.group;
    var props = babelHelpers.objectWithoutProperties(_props, ['type', 'group']);

    warning(!group || type.toLowerCase() !== 'submit', 'You have specified a `group` prop with type="submit" on this Form.Button component. ' + 'submit type buttons will automatically trigger a form wide validation. ' + 'to trigger validation for jsut the group: `' + group + '` use type="button" instead.');

    if (type.toLowerCase() === 'submit') return React.createElement(
      'button',
      babelHelpers._extends({}, props, { type: 'submit' }),
      this.props.children
    );

    return React.createElement(
      Trigger,
      { group: group, events: ['onClick'] },
      React.createElement(
        'button',
        babelHelpers._extends({}, props, { type: type }),
        this.props.children
      )
    );
  };

  babelHelpers.createClass(Button, null, [{
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
      group: React.PropTypes.string },
    enumerable: true
  }, {
    key: 'defaultProps',
    value: {
      type: 'button' },
    enumerable: true
  }]);
  return Button;
})(React.Component);

module.exports = Button;