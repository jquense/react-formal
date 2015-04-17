var React = require('react')
var warning = require('react/lib/warning')
var Trigger = require('react-input-message/lib/MessageTrigger')


class FormButton extends React.Component {

  render(){
    let { 
        type = 'button'
      , group
      , ...props } = this.props

    warning(!group || type.toLowerCase() !== 'submit', 
      '[yup-forms] You have specified a `group` prop with type="submit" on this Form.Button component. ' +
      'submit type buttons will automatically trigger a form wide validation. ' +
      'to trigger validation for jsut the group: `' + group+'` use type="button" instead.')

    if (type.toLowerCase() === 'submit')
      return <button {...props} type='submit'>{ this.props.children }</button>

    return (
      <Trigger group={group} events={['onClick']}>
        <button {...props}>{ this.props.children }</button>
      </Trigger>
    )
  }
}

module.exports = FormButton