import React from 'react';
import warning from 'warning';
import Trigger from 'react-input-message/MessageTrigger';

import contextTypes from './util/contextType';
import mergeWithEvents from './util/chainEvents';

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

    /**
     * The key of `Form` that "owns" this button. Validation will be triggered
     * only for that `Form`.
     */
    formKey: React.PropTypes.string,

    component: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.func
    ]),

    /**
     * An array of event names that trigger validation.
     */
    events: React.PropTypes.arrayOf(React.PropTypes.string),

    onClick: React.PropTypes.func,
  }

  static contextTypes = contextTypes

  static defaultProps = {
    type: 'button',
    component: 'button',
    events: ['onClick']
  }

  handleSubmit = (...args) => {
    let { formKey, onClick } = this.props;
    let context = this.context.reactFormalContext

    if (onClick) onClick(...args)
    if (context) context.submitForm(formKey || '@@parent')
  }

  render(){
    let {
        type
      , group
      , events
      , component: Component
      , ...props } = this.props

    warning(!group || type.toLowerCase() !== 'submit',
      'You have specified a `group` prop with type="submit" on this Form.Button component. ' +
      'submit type buttons will automatically trigger a form wide validation. ' +
      'to trigger validation for just the group: `' + group + '` use type="button" instead.')

    delete props.formKey;

    if (type.toLowerCase() === 'submit')
      return (
        <Component {...props} onClick={this.handleSubmit}>
          {this.props.children}
        </Component>
      )

    return (
      <Trigger group={group || '@all'} events={events}>
        {({ messages: _, ...triggerProps }) =>
          <Component
            {...mergeWithEvents(events, [
              props,
              triggerProps
            ])}
            type={type}
          >
            {this.props.children}
          </Component>
        }
      </Trigger>
    )
  }
}

export default Button
