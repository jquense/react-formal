import PropTypes from 'prop-types';
import React, { useCallback, ElementType } from 'react';

import notify from './utils/notify';
import useFormSubmit from './useFormSubmit';

export interface FormSubmitProps<TAs extends ElementType = any> {
  as?: TAs;
  onClick?: (...args: any[]) => any;
  triggers?: string[];
}

/**
 * A Form submit button, for triggering validations for the entire form or specific fields.
 *
 * @alias Submit
 */
function Submit<TAs extends ElementType = 'button'>(
  props: FormSubmitProps<TAs> &
    Omit<React.ComponentPropsWithoutRef<TAs>, 'triggers' | 'as'>,
) {
  const { onClick, triggers, as: Component = 'button', ...rest } = props;
  const [submit] = useFormSubmit({ triggers });

  const handleClick = useCallback(
    (...args: any[]) => {
      notify(onClick, args);
      submit(args);
    },
    [onClick, submit],
  );

  return (
    <Component
      {...rest}
      onClick={handleClick}
      type={triggers && triggers.length ? 'button' : 'submit'}
    />
  );
}

Submit.propTypes = {
  /**
   * Specify particular fields to validate in the related form. If empty the entire form will be validated.
   */
  triggers: PropTypes.arrayOf(PropTypes.string.isRequired),

  /**
   * Control the rendering of the Form Submit component when not using
   * the render prop form of `children`.
   *
   * ```jsx static
   * <Form.Submit as={MyButton}>
   *   Submit
   * </Form.Submit>
   * ```
   */
  as: PropTypes.elementType,

  /**
   * A string or array of event names that trigger validation.
   *
   * @default 'onClick'
   */
  onClick: PropTypes.func,
};

export default Submit;
