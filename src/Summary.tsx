import PropTypes from 'prop-types';

import React from 'react';
import Message, { MessageProps } from './Message.js';

/**
 * Display all Form validation `errors` in a single summary list.
 *
 * ```jsx static
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
 *   <Form.Submit>Validate</Form.Submit>
 * </Form>
 * ```
 *
 * @memberof Form
 */
class Summary extends React.PureComponent<
  MessageProps & {
    formatMessage: (err: any, idx: number, errors: any[]) => React.ReactNode;
  },
  any
> {
  static propTypes = {
    /**
     * An error message renderer, Should return a `ReactElement`
     * ```ts static
     * function(
     *   message: string,
     *   idx: number,
     *   errors: array
     * ): ReactElement
     * ```
     */
    formatMessage: PropTypes.func.isRequired,

    /**
     * A DOM node tag name or Component class the Message should render as.
     */
    as: PropTypes.elementType.isRequired,

    /**
     * A css class that should be always be applied to the Summary container.
     */
    errorClass: PropTypes.string,

    /**
     * Specify a group to show errors for, if empty all form errors will be shown in the Summary.
     */
    group: PropTypes.string,
  };

  static defaultProps = {
    as: 'ul',
    formatMessage: (message: any, idx: any) => <li key={idx}>{message}</li>,
  };

  render() {
    let { formatMessage, ...props } = this.props;

    return (
      <Message {...props}>{(errors) => errors.map(formatMessage)}</Message>
    );
  }
}

export default Summary;
