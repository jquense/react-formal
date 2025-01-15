import PropTypes from 'prop-types';
import { AnyObjectSchema } from 'yup';
import Form, { FormProps } from './Form.js';
import useField from './useField.js';
import { prefix, unprefix } from './Errors.js';

const propTypes = {
  name: PropTypes.string.isRequired,
  schema: PropTypes.object,
  errors: PropTypes.object,
  context: PropTypes.object,
  meta: PropTypes.shape({
    errors: PropTypes.object.isRequired,
    onError: PropTypes.func.isRequired,
  }),
};

export interface NestedFormProps<TSchema extends AnyObjectSchema>
  extends Omit<
    FormProps<TSchema>,
    'onError' | 'onChange' | 'value' | 'defaultValue' | 'defaultErrors'
  > {
  name: string;
}

/**
 * A `Form` component that takes a `name` prop. Functions exactly like a normal
 * Form, except that when a `name` is present it will defer errors up to the parent `<Form>`,
 * functioning like a `<Form.Field>`.
 *
 * This is useful for encapsulating complex input groups into self-contained
 * forms without having to worry about `"very.long[1].paths[4].to.fields"` for names.
 */
function NestedForm<T extends AnyObjectSchema>({
  name,
  schema,
  errors,
  ...props
}: NestedFormProps<T>) {
  const [_, meta] = useField({
    name,
    noValidate: true,
    validateOn: null,
  });

  return (
    <Form
      as="div"
      {...props}
      value={meta.value}
      onChange={meta.onChange}
      onError={(nextErrors) => meta.onError(prefix(nextErrors, name))}
      errors={unprefix(name ? meta.errors : errors!, name)}
      schema={schema || (meta.schema as T)}
      context={name ? { ...meta.context, ...props.context } : props.context}
    />
  );
}

NestedForm.propTypes = propTypes;

export default NestedForm;
