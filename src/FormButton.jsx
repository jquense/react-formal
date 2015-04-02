var React = require('react')
var warning = require('react/lib/warning')
var Trigger = require('react-input-message/lib/MessageTrigger')

class FormButton extends React.Component {

  render(){
    let { 
        component
      , type
      , ...props } = this.props

    warning(!type, 
      'You have specified a `type` prop on this Form.Button component. ' +
      'This component overrides type so provided `type` will never be used. ' +
      'To create a `submit` button use the Form.Submit component or a plain <button/> tag instead.')

    return <Trigger {...this.props} type='button'/>
  }
}

// for symmetry..
class FormSubmit extends React.Component {

  render(){
    warning(!this.props.type, 
      'You have specified a `type` prop on this Form.Submit component. ' +
      'This component overrides type so provided `type` will never be used ' +
      'To trigger form validaton without submitting use the Form.Button component instead.')

    return <button {...this.props} type='submit'/>
  }
}

module.exports = { FormSubmit, FormButton }