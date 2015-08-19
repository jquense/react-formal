var React = require('react')
var warning = require('warning')
var Trigger = require('react-input-message/lib/MessageTrigger')

/**
 * A Form Button, for triggering validations for specific Field groups
 */
class Button extends React.Component {

  static propTypes = {
    /**
     * The `<button/>` type
     */
    type:  React.PropTypes.oneOf(['button', 'submit']),

    /**
     * Specify a group to validate, if empty the entire form will be validated.
     * If the button type is 'submit' the group will be ignored and the
     * entire form will be validated prior to submission.
     */
    group: React.PropTypes.string,

    /**
     * An array of event names that trigger validation.
     */
    events: React.PropTypes.arrayOf(
              React.PropTypes.string),
  }

  static contextTypes = {
    onSubmit: React.PropTypes.func
  }

  static defaultProps = {
    type: 'button',
    events: ['onClick']
  }

  render(){
    let {
        type
      , group
      , events
      , ...props } = this.props

    warning(!group || type.toLowerCase() !== 'submit',
      'You have specified a `group` prop with type="submit" on this Form.Button component. ' +
      'submit type buttons will automatically trigger a form wide validation. ' +
      'to trigger validation for just the group: `' + group + '` use type="button" instead.')

    if (type.toLowerCase() === 'submit')
      return <button {...props} onClick={this.context.onSubmit}>{ this.props.children }</button>

    return (
      <Trigger group={group} events={events}>
        <button {...props} type={type}>{ this.props.children }</button>
      </Trigger>
    )
  }
}

module.exports = Button