var React = require('react')
var connectToMessageContainer = require('react-input-message/lib/connectToMessageContainer')
var cn = require('classnames');

let values = obj => Object.keys(obj).map( k => obj[k] )

class ValidationSummary {

  static defaultProps = {
    component: 'span',
    formatMessage: msg => <li>{msg}</li>
  }

  constructor(props, context){
    this.props = props;
    this.context = context
  }

  render() {
    var { 
        component: Component
      , messages
      , active
      , for: fieldFor
      , ...props } = this.props;

    if (!active)
      return null

    return (
      <Component 
        {...props} 
        className={cn(props.className, props.errorClass || 'validation-error')}>
      { 
        Object.keys(obj).map( k => props.formatMessage(obj[k]))
      }
      </Component>
    )
  }
}

module.exports = connectToMessageContainer(ValidationSummary)