import PropTypes from 'prop-types';
import elementType from 'prop-types-extra/lib/elementType';
import React, { useCallback, ElementType } from 'react';
import useCommittedRef from '@restart/hooks/useCommittedRef';

import useEventHandlers, { notify } from './utils/useEventHandlers';
import useFormSubmit from './useFormSubmit';

export interface FormSubmitProps<TAs extends ElementType = any> {
  as?: TAs;
  events?: string[] | string | null;
  triggers?: string[];
}

const defaultEvents = ['onClick'];
/**
 * A Form submit button, for triggering validations for the entire form or specific fields.
 *
 * @alias Submit
 */
function Submit<TAs extends ElementType = 'button'>(
  props: FormSubmitProps<TAs> &
    Omit<React.ComponentPropsWithoutRef<TAs>, 'triggers' | 'events' | 'as'>,
) {
  const propsRef = useCommittedRef<any>(props);
  const {
    triggers,
    events = defaultEvents,
    as: Component = 'button',
    ...rest
  } = props;
  const [submit] = useFormSubmit({ triggers });

  const eventHandlers = useEventHandlers(
    events,
    useCallback(
      (event, args) => {
        notify(propsRef.current[event], args);
        submit(args);
      },
      [propsRef, submit],
    ),
  );

  return (
    <Component
      {...rest}
      {...eventHandlers}
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
  as: elementType,

  /**
   * A string or array of event names that trigger validation.
   *
   * @default 'onClick'
   */
  events: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
};

export default Submit;
