import React from 'react';
import warning from 'warning';
import Trigger from 'react-input-message/MessageTrigger';
import chain from 'chain-function';
import contextTypes from './util/contextType';

/**
 * A Form Button, for triggering validations for specific Field groups
 */
class Button extends React.Component {

  static propTypes = {
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

    component: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.func
    ]),

    /**
     * An array of event names that trigger validation.
     */
    events: React.PropTypes.arrayOf(React.PropTypes.string)
  }

  static contextTypes = contextTypes

  static defaultProps = {
    type: 'button',
    component: 'button',
    events: ['onClick']
  }

  render(){
    let {
        type
      , group
      , events
      , component: Component
      , ...props } = this.props

    let context = this.context.reactFormalContext;

    warning(!group || type.toLowerCase() !== 'submit',
      'You have specified a `group` prop with type="submit" on this Form.Button component. ' +
      'submit type buttons will automatically trigger a form wide validation. ' +
      'to trigger validation for just the group: `' + group + '` use type="button" instead.')

    if (type.toLowerCase() === 'submit')
      return (
        <Component {...props} onClick={chain(props.onClick, context.onSubmit)}>
          { this.props.children }
        </Component>
      )

    return (
      <Trigger group={group} events={events}>
        <Component {...props} type={type}>{ this.props.children }</Component>
      </Trigger>
    )
  }
}

module.exports = Button
