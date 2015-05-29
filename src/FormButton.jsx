var React = require('react')
var warning = require('scoped-warning')('react-formal')
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
  }

  static defaultProps = {
    type: 'button',
  }

  render(){
    let { 
        type
      , group
      , ...props } = this.props

    warning(!group || type.toLowerCase() !== 'submit', 
      'You have specified a `group` prop with type="submit" on this Form.Button component. ' +
      'submit type buttons will automatically trigger a form wide validation. ' +
      'to trigger validation for jsut the group: `' + group + '` use type="button" instead.')

    if (type.toLowerCase() === 'submit')
      return <button {...props} type='submit'>{ this.props.children }</button>

    return (
      <Trigger group={group} events={['onClick']}>
        <button {...props} type={type}>{ this.props.children }</button>
      </Trigger>
    )
  }
}

module.exports = Button