var React = require('react')
var Message = require('react-input-message/lib/Message')
var cn = require('classnames');

module.exports = class ValidationMessage {

  constructor(props, context){
    this.props = props;
    this.context = context
  }

  render(){
    let props = this.props;

    return <Message 
      {...props}
      className={cn(props.className, props.errorClass || 'validation-error')}
    />
  }
}