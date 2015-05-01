var React = require('react')
var pureRender = require('react-purerender')
var connectToMessageContainer = require('react-input-message/lib/connectToMessageContainer')
var cn = require('classnames');

let values = obj => Object.keys(obj).map( k => obj[k] )
let splat  = obj => obj == null ? [] : [].concat(obj)

module.exports = 
  connectToMessageContainer(
    pureRender(
      class ValidationSummary {

        static defaultProps = {
          component: 'ul',
          formatMessage: (msg, idx) => <li key={idx}>{msg}</li>
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
              Object.keys(messages)
                .reduce((list, k) => list.concat(splat(messages[k])), [])
                .map(props.formatMessage)
            }
            </Component>
          )
        }
      }))

