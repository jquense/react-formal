var React = require('react')
var connectToMessageContainer = require('react-input-message/lib/connectToMessageContainer')
var cn = require('classnames');

let values = obj => Object.keys(obj).map( k => obj[k] )

module.exports = 
  connectToMessageContainer(
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
            Object.keys(messages).reduce( (list, k) => {
              let values = messages[k] == null ? [] : [].concat(messages[k])
              return list.concat(values.map(props.formatMessage))
            }, [])
          }
          </Component>
        )
      }
    })

