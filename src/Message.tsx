import PropTypes from 'prop-types';
import React, { useContext, useMemo } from 'react';
import { FormContext } from './Contexts';
import { Errors } from './types';
import { filterAndMapErrors } from './Errors';
import uniq from './utils/uniqMessage';

let flatten = (arr, next) => arr.concat(next);

export interface MessageProps {
  errors?: Errors;
  for: string | string[];
  className?: string;
  filter?: (item: any, i?: number, list?: any[]) => boolean;
  extract?: (errors: any, props: any) => any;
  children?: (errors: any[], props: any) => React.ReactNode;
}
/**
 * Represents a Form validation error message. Only renders when the
 * value that it is `for` is invalid.
 *
 * @alias FormMessage
 * @memberof Form
 */
function Message({
  errors: propsErrors,
  for: names,
  className,
  filter = uniq,
  extract = (error: any) => error.message || error,
  children = (errors: any[], msgProps: any) => (
    <span {...msgProps}>{errors.join(', ')}</span>
  ),
  ...props
}: MessageProps) {
  const { errors: formErrors } = useContext(FormContext);
  const inputErrors = propsErrors || formErrors;
  const errors = useMemo(
    () =>
      filterAndMapErrors({
        errors: inputErrors,
        names,
      }),
    [names, inputErrors],
  );

  if (!errors || !Object.keys(errors).length) return null;

  return (
    <>
      {children(
        Object.values(errors).reduce(flatten, []).filter(filter).map(extract),
        {
          ...props,
          className,
        },
      )}
    </>
  );
}

Message.propTypes = {
  for: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),

  /**
   * A function that maps an array of message strings
   * and returns a renderable string or ReactElement.
   *
   * ```jsx static
   * <Message>
   *  {errors => errors.join(', ')}
   * </Message>
   * ```
   */
  children: PropTypes.func,

  /**
   * Map the passed in message object for the field to a string to display
   */
  extract: PropTypes.func,

  filter: PropTypes.func,
};

export default Message;
