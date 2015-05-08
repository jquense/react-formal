var React = require('react')
var pureRender = require('react-purerender')
var connectToMessageContainer = require('react-input-message/lib/connectToMessageContainer')
var cn = require('classnames');

let splat  = obj => obj == null ? [] : [].concat(obj)

module.exports = 
  connectToMessageContainer(
    pureRender(
      /**
       * Display all Form validation `errors` in a single summary list.
       */
      class ValidationSummary extends React.Component {

        static propTypes = {

          /**
           * An error message renderer, Should return a `ReactElement`
           * ```
           * function(
           *   message: string, 
           *   idx: number, 
           *   messages: array
           * ) -> ReactElement
           * ```
           */
          formatMessage: React.PropTypes.func.isRequired,

          /**
           * A DOM node tag name or Component class the Message should render as.
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
          component: 'ul',
          errorClass: 'validation-error',
          formatMessage: (message, idx) => <li key={idx}>{message}</li>
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

