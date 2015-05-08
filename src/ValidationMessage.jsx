var React = require('react')
var pureRender = require('react-purerender')
var Message = require('react-input-message/lib/Message')
var cn = require('classnames');

/**
 * Represents a Form validation error message. Only renders when the 
 * value that it is `for` is invalid.
 */
@pureRender
class ValidationMessage {

  static propTypes = {
    /**
     * Specify what Field or Fields the Message is in charge of displaying. 
     * `for` should correspond to a field `name`.
     */
    component: React.PropTypes.oneOfType([
      React.PropTypes.func,
      React.PropTypes.string,
    ]).isRequired, 

    /**
     * A css class that should be always be applied to the Message container.
     */
    errorClass: React.PropTypes.string,
  }

  static defaultProps = {
    component: 'span',
    errorClass: 'validation-error'
  }

  constructor(props, context){
    this.props = props;
    this.context = context
  }

  render(){
    let props = this.props;

    return <Message 
      {...props}
      className={cn(props.className, props.errorClass)}
    />
  }
}

module.exports = ValidationMessage