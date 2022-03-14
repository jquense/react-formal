import React, { ElementType, useCallback } from 'react';
import useFormReset from './useFormReset';
import notify from './utils/notify';

export interface FormResetProps<TAs extends ElementType = any> {
  as?: TAs;
  onClick?: (...args: any[]) => any;
}
/**
 * A Form reset button
 *
 * @memberof Form
 */
function Reset<TAs extends ElementType = 'button'>(
  props: FormResetProps<TAs> &
    Omit<React.ComponentPropsWithoutRef<TAs>, 'as' | 'triggers'>,
) {
  const { onClick, as: Component = 'button', ...rest } = props;
  const [reset] = useFormReset();

  const handleClick = useCallback(() => {
    notify(onClick);
    reset();
  }, [onClick, reset]);

  return <Component {...rest} onClick={handleClick} type="reset" />;
}

export default Reset;
