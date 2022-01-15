import { useBindingContext } from './BindingContext';

/**
 * Returns the current form value and onChange handler for the Form
 */
function useForm() {
  const ctx = useBindingContext();
  return [ctx.formValue, ctx.updateFormValue] as const;
}

export default useForm;
