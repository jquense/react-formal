import React from 'react';
import shouldComponentUpdate from 'react-pure-render/function';
import ValidationMessage from './ValidationMessage';


/**
 * Display all Form validation `errors` in a single summary list.
 *
 * ```editable
 * <Form
 *   schema={modelSchema}
 *   defaultValue={modelSchema.default()}
 * >
 *   <Form.Summary/>
 *
 *   <Form.Field name='name.first' placeholder='first'/>
 *   <Form.Field name='name.last' placeholder='surname'/>
 *   <Form.Field name='dateOfBirth' placeholder='dob'/>
 *
 *   <Form.Button>Validate</Form.Button>
 * </Form>
 * ```
 * @alias Summary
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
      React.PropTypes.string
    ]).isRequired,

    /**
     * A css class that should be always be applied to the Summary container.
     */
    errorClass: React.PropTypes.string,

    /**
     * Specify a group to show erros for, if empty all form errors will be shown in the Summary.
     */
    group: React.PropTypes.string
  }

  static defaultProps = {
    component: 'ul',
    formatMessage: (message, idx) => <li key={idx}>{message}</li>
  }

  shouldComponentUpdate(p, s, c){
    return shouldComponentUpdate.call(this, p, s, c)
  }

  render() {
    let {
        formatMessage
      , ...props } = this.props;

    return (
      <ValidationMessage {...props}>
        {messages => messages.map(formatMessage)}
      </ValidationMessage>
    )
  }
}

export default ValidationSummary;
