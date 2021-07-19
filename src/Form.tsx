/* eslint-disable @typescript-eslint/no-use-before-define */
import PropTypes from 'prop-types';
import expr from 'property-expr';
import React, {
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  SyntheticEvent,
  Fragment,
} from 'react';
import shallowequal from 'shallowequal';
import { BindingContext } from 'topeka';
import { useUncontrolledProp } from 'uncontrollable';
import warning from 'warning';
import { reach, isSchema, AnyObjectSchema, AnySchema, InferType } from 'yup';
import useEventCallback from '@restart/hooks/useEventCallback';
import useMergeState from '@restart/hooks/useMergeState';
import useMounted from '@restart/hooks/useMounted';
import useTimeout from '@restart/hooks/useTimeout';
import {
  FormActionsContext,
  FormErrorContext,
  FormSubmitsContext,
  FormTouchedContext,
} from './Contexts';
import createErrorManager, {
  isValidationError,
  ValidationPathSpec,
} from './errorManager';
import { BeforeSubmitData, Errors, Touched, ValidateData } from './types';
import * as ErrorUtils from './Errors';
import errToJSON from './utils/errToJSON';
import notify from './utils/notify';

export interface FormProps<
  TSchema extends AnyObjectSchema,
  TValue = Record<string, any>
> {
  as?: React.ElementType | null | false;
  className?: string;
  children?: React.ReactNode;

  schema?: TSchema;
  value?: TValue;
  defaultValue?: Partial<TValue>;
  errors?: Errors;
  defaultErrors?: Errors;

  touched?: Touched;
  defaultTouched?: Touched;

  noValidate?: boolean;

  onChange?: (input: TValue, changedPaths: string[]) => void;
  onError?: (errors: Errors) => void;
  onTouch?: (touched: Touched, changedPaths: string[]) => void;
  onValidate?: (data: ValidateData) => void;
  onBeforeSubmit?: (data: BeforeSubmitData) => void;
  onSubmit?: (validatedValue: InferType<TSchema>) => void;
  onInvalidSubmit?: (errors: Errors) => void;
  onSubmitFinished?: (error?: Error) => void;

  submitForm?: (input: TValue) => Promise<any> | any;
  getter?: (path: string, value: TValue) => any;
  setter?: (path: string, value: TValue, fieldValue: any) => TValue;
  context?: Record<string, unknown>;

  delay?: number;

  stripUnknown?: boolean;
  /**
   * Controls how errors are dealt with for field level validation. When
   * set, the first validation error a field throws is returned instead of waiting
   * for all validations to finish
   */
  abortEarly?: boolean;

  strict?: boolean;

  /** Adds some additional runtime console warnings */
  debug?: boolean;

  [other: string]: any;
}

let done = (e: Error) =>
  setTimeout(() => {
    throw e;
  });

const formGetter = (path: string, model: any) =>
  path ? expr.getter(path, true)(model || {}) : model;

const formSetter = BindingContext.defaultProps.setter;

function useErrorContext(errors?: Errors) {
  const ref = useRef<Errors | null>(null);
  if (!ref.current) {
    return (ref.current = errors ?? null);
  }
  if (!shallowequal(ref.current.errors, errors)) {
    ref.current = errors ?? null;
  }

  return ref.current;
}

const isEvent = (e): e is SyntheticEvent =>
  typeof e == 'object' && e != null && 'target' in e;

type Setter = (
  path: string,
  formData: unknown,
  fieldValue: any,
  setter: any,
) => unknown;

const createFormSetter = (
  setter: Setter,
  schema?: AnySchema,
  context?: any,
) => {
  function parseValueFromEvent(
    target: HTMLInputElement & HTMLSelectElement,
    fieldValue: any,
    fieldSchema?: any,
  ) {
    const { type, value, checked, options, multiple, files } = target;

    if (type === 'file') return multiple ? files : files && files[0];
    if (multiple) {
      // @ts-ignore
      const innerType = fieldSchema?._subType?._type;

      return Array.from(options)
        .filter((opt) => opt.selected)
        .map(({ value: option }) =>
          innerType == 'number' ? parseFloat(option) : option,
        );
    }

    if (/number|range/.test(type)) {
      let parsed = parseFloat(value);
      return isNaN(parsed) ? null : parsed;
    }
    if (type === 'checkbox') {
      const isArray = Array.isArray(fieldValue);

      const isBool = !isArray && (fieldSchema as any)?._type === 'boolean';

      if (isBool) return checked;

      const nextValue = isArray ? [...fieldValue] : [];
      const idx = nextValue.indexOf(value);

      if (checked) {
        if (idx === -1) nextValue.push(value);
      } else nextValue.splice(idx, 1);

      return nextValue;
    }

    return value;
  }

  return (
    path: string,
    formData: any,
    fieldValue: any,
    defaultSetter: any,
  ): any => {
    if (isEvent(fieldValue))
      fieldValue = parseValueFromEvent(
        fieldValue.target as any,
        formGetter(path, formData),
        schema && path && reach(schema, path, formData, context),
      );

    return setter(path, formData, fieldValue, defaultSetter);
  };
};

function validatePath(
  { path }: ValidationPathSpec,
  { value, schema, ...rest },
): Promise<Error | void> {
  return schema
    .validateAt(path, value, rest)
    .then(() => null)
    .catch((err) => err);
}

const EMPTY_TOUCHED = {};

export interface FormHandle {
  submit: () => Promise<false | void>;
  validate(fields: string[]): void;
}

export declare interface Form {
  <T extends AnyObjectSchema, TValue = Record<string, any>>(
    props: FormProps<T, TValue> & React.RefAttributes<FormHandle>,
  ): React.ReactElement | null;

  displayName?: string;
  propTypes?: any;

  // getter: typeof formGetter
  // setter: typeof formSetter
}

/** @alias Form */
const _Form: Form = React.forwardRef(
  <T extends AnyObjectSchema>(
    {
      children,

      defaultValue,
      value: propValue,
      onChange: propOnChange,

      errors: propErrors,
      onError: propOnError,
      defaultErrors = ErrorUtils.EMPTY_ERRORS,

      defaultTouched = EMPTY_TOUCHED,
      touched: propTouched,
      onTouch: propOnTouch,

      schema,
      submitForm,
      getter = formGetter,
      setter = formSetter,
      delay = 300,
      debug,
      noValidate,
      onValidate,
      onBeforeSubmit,
      onSubmit,
      onSubmitFinished,
      onInvalidSubmit,
      context,
      stripUnknown,
      abortEarly,
      strict = false,
      as: Element = 'form',
      ...elementProps
    }: FormProps<T>,
    ref: React.Ref<FormHandle>,
  ) => {
    const [value, onChange] = useUncontrolledProp(
      propValue,
      defaultValue,
      propOnChange,
    );
    const [errors, onError] = useUncontrolledProp(
      propErrors,
      defaultErrors,
      propOnError,
    );
    const [touched, onTouch] = useUncontrolledProp(
      propTouched,
      defaultTouched,
      propOnTouch,
    );

    const shouldValidate = !!schema && !noValidate;
    const flushTimeout = useTimeout();
    const submitTimeout = useTimeout();
    const isMounted = useMounted();

    const queueRef = useRef<string[]>([]);

    const errorManager = useMemo(() => createErrorManager(validatePath), []);

    const updateFormValue = useMemo(
      () => createFormSetter(setter, schema, context),
      [context, schema, setter],
    );

    const yupOptions = {
      strict,
      context,
      stripUnknown,
      abortEarly: abortEarly == null ? false : abortEarly,
    };

    const isSubmittingRef = useRef(false);
    const [submits, setSubmitState] = useMergeState(() => ({
      submitCount: 0,
      submitAttempts: 0,
      submitting: false,
    }));

    function setSubmitting(submitting) {
      if (!isMounted()) return;

      isSubmittingRef.current = submitting;
      setSubmitState({ submitting });
    }

    const errorContext = useErrorContext(errors);

    const isUpdateRef = useRef(false);
    useEffect(() => {
      // don't do this on mount
      if (!isUpdateRef.current) {
        isUpdateRef.current = true;
        return;
      }

      if (errors) {
        enqueue(Object.keys(errors));
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [schema]);

    const flush = () => {
      flushTimeout.set(() => {
        let fields = queueRef.current;

        if (!fields.length) return;

        queueRef.current = [];
        errorManager
          .collect(fields, errors, {
            schema,
            value,
            ...yupOptions,
          })
          .then((nextErrors) => {
            if (nextErrors !== errors) {
              maybeWarn(debug, errors, 'field validation');

              notify(onError, [nextErrors]);
            }
          })
          .catch(done);
      }, delay);
    };

    useEffect(() => {
      flush();
    });

    function enqueue(fields: string[]) {
      queueRef.current.push(...fields);
    }

    const getSchemaForPath = (path: string): AnySchema | undefined => {
      if (schema && path) return reach(schema, path, value, context);
    };

    const handleChange = useEventCallback((model, paths) => {
      let nextTouched = touched;

      onChange(model, paths);
      paths.forEach((path) => {
        if (touched && touched[path]) return;
        if (nextTouched === touched) nextTouched = { ...touched, [path]: true };
        else nextTouched[path] = true;
      });

      if (nextTouched !== touched) onTouch(nextTouched!, paths);
    });

    const handleValidationRequest = (
      fields: string[],
      type: string,
      args?: any[],
    ) => {
      if (!shouldValidate) return;

      notify(onValidate, [{ type, fields, args }]);
      enqueue(fields);
      if (type !== 'onChange') flush();
    };

    const handleFieldError = (name: string, fieldErrors: Errors) => {
      handleError(Object.assign(ErrorUtils.remove(errors, name), fieldErrors));
    };

    const handleError = (nextErrors: Errors) => {
      notify(onError, [nextErrors]);
    };

    const handleSubmitSuccess = (validatedValue: InferType<T>) => {
      notify(onError, [] as any);
      notify(onSubmit, [validatedValue]);

      return Promise.resolve(submitForm && submitForm(validatedValue)).then(
        () => {
          setSubmitting(false);
          setSubmitState((s) => ({
            submitCount: s.submitCount + 1,
            submitAttempts: s.submitAttempts + 1,
          }));
          notify(onSubmitFinished);
        },
        (err) => {
          setSubmitting(false);
          notify(onSubmitFinished, [err]);
          throw err;
        },
      );
    };

    const handleSubmitError = (err: any) => {
      if (!isValidationError(err)) throw err;

      const nextErrors = errToJSON(err);

      maybeWarn(debug, nextErrors, 'onSubmit');

      setSubmitState((s) => ({
        submitAttempts: s.submitAttempts + 1,
      }));

      notify(onError, [nextErrors]);
      notify(onInvalidSubmit, [nextErrors]);
      setSubmitting(false);

      notify(onSubmitFinished, [err]);
    };

    const clearPendingValidations = () => {
      flushTimeout.clear();
      queueRef.current.length = 0;
    };

    const handleSubmit = (e?: React.SyntheticEvent) => {
      if (e && e.preventDefault && e.stopPropagation) {
        e.preventDefault();
        e.stopPropagation();
      }
      clearPendingValidations();
      submitTimeout.set(() => submit().catch(done));
    };

    const submit = (): Promise<false | void> => {
      if (isSubmittingRef.current) {
        return Promise.resolve(false);
      }

      clearPendingValidations();
      notify(onBeforeSubmit, [
        {
          value,
          errors,
        },
      ]);

      setSubmitting(true);

      return (
        (!shouldValidate
          ? Promise.resolve(value as any)
          : schema!.validate(value, {
              ...yupOptions,
              abortEarly: false,
              strict: false,
            })
        )
          // no catch, we aren't interested in errors from onSubmit handlers
          .then(handleSubmitSuccess, handleSubmitError)
      );
    };

    useImperativeHandle(ref, () => ({
      submit,
      validate(fields) {
        errorManager.collect(fields, errors, { schema, value, ...yupOptions });
      },
    }));

    const formActions = Object.assign(useRef({}).current, {
      getSchemaForPath,
      yupContext: context,
      onSubmit: handleSubmit,
      onValidate: handleValidationRequest,
      onFieldError: handleFieldError,
      formHasValidation: () => shouldValidate,
    });

    if (Element === 'form') {
      elementProps.noValidate = true; // disable html5 validation
    }

    elementProps.onSubmit = handleSubmit;

    let useChildren = Element == null || Element === false;
    // if it's a fragment no props
    if (
      Element === Fragment ||
      (useChildren &&
        React.Children.only(children as React.ReactElement).type === Fragment)
    ) {
      elementProps = {};
    }

    return (
      <BindingContext
        value={value}
        getter={getter}
        setter={updateFormValue}
        onChange={handleChange}
      >
        <FormActionsContext.Provider value={formActions}>
          <FormTouchedContext.Provider value={touched}>
            <FormSubmitsContext.Provider value={submits}>
              <FormErrorContext.Provider value={errorContext!}>
                {Element == null || Element === false ? (
                  React.cloneElement(
                    React.Children.only(children as React.ReactElement),
                    elementProps,
                  )
                ) : (
                  <Element {...elementProps}>{children}</Element>
                )}
              </FormErrorContext.Provider>
            </FormSubmitsContext.Provider>
          </FormTouchedContext.Provider>
        </FormActionsContext.Provider>
      </BindingContext>
    );
  },
);

function maybeWarn(debug, errors, target) {
  if (!debug) return;

  if (process.env.NODE_ENV !== 'production') {
    let keys = Object.keys(errors);
    warning(
      !keys.length,
      `[react-formal] (${target}) invalid fields: ${keys.join(', ')}`,
    );
  }
}

_Form.propTypes = {
  /**
   * Form value object, can be left [uncontrolled](/controllables);
   * use the `defaultValue` prop to initialize an uncontrolled form.
   */
  value: PropTypes.object,

  /**
   * Callback that is called when the `value` prop changes.
   *
   * ```ts static
   * function (
   *   value: any,
   *   updatedPaths: string[]
   * )
   * ```
   */
  onChange: PropTypes.func,

  /**
   * An object hash of field errors for the form. The object should be keyed with paths
   * with the values being an array of errors or message objects. Errors can be
   * left [uncontrolled](/controllables) (use `defaultErrors` to set an initial value)
   * or managed along with the `onError` callback. You can use any object shape you'd like for
   * errors, as long as you provide the Form.Message component an `extract` prop that
   * understands how to pull out the strings message. By default it understands strings and objects
   * with a `'message'` property.
   *
   * ```jsx static
   * <Form errors={{
   *  "name.first": [
   *    'First names are required',
   *    {
   *    	message: "Names must be at least 2 characters long",
   *    	type: 'min'
   *    }
   *  ],
   * }}/>
   * ```
   */
  errors: PropTypes.object,

  /**
   * Callback that is called when a validation error occurs. It is called with an `errors` object
   *
   * ```jsx renderAsComponent
   * import Form from '@docs/components/FormWithResult';
   * import * as yup from 'yup'
   *
   * const schema = yup.object({
   *   name: yup.string().required().min(15)
   * })
   *
   * const [errors, setErrors] = useState({});
   *
   * <Form
   *   schema={schema}
   *   errors={errors}
   *   onError={errors => {
   *     if (errors.name) {
   *       errors.name = 'hijacked!'
   *     }
   *
   *     setErrors(errors)
   * }}>
   *    <label>
   *      Name
   *      <Form.Field name='name'/>
   *    </label>
   *   <Form.Message for='name' className="error" />
   *
   *   <Form.Submit type='submit'>Submit</Form.Submit>
   * </Form>
   * ```
   */
  onError: PropTypes.func,

  /** An object hash of field paths and whether they have been "touched" yet */
  touched: PropTypes.object,

  /**
   * Callback that is called when a field is touched. It is called with an `touched` object
   */
  onTouch: PropTypes.func,

  /**
   * Callback that is called whenever a validation is triggered.
   * It is called _before_ the validation is actually run.
   *
   * ```js static
   * function onValidate(event) {
   *   let { type, fields, args } = event
   * }
   * ```
   */
  onValidate: PropTypes.func,

  /**
   * Callback that is fired in response to a submit, _before_ validation runs.
   *
   * ```js static
   * function onSubmit(formValue) {
   *   // do something with valid value
   * }
   * ```
   */
  onBeforeSubmit: PropTypes.func,

  /**
   * Callback that is fired in response to a submit, after validation runs for the entire form.
   *
   * ```js static
   * function onSubmit(formValue) {
   *   // do something with valid value
   * }
   * ```
   */
  onSubmit: PropTypes.func,

  onSubmitFinished: PropTypes.func,

  /* */
  submitForm: PropTypes.func,

  /**
   * Callback that is fired when the native onSubmit event is triggered. Only relevant when
   * the `component` prop renders a `<form/>` tag. onInvalidSubmit will trigger only if the form is invalid.
   *
   * ```js static
   * function onInvalidSubmit(errors){
   *   // do something with errors
   * }
   * ```
   */
  onInvalidSubmit: PropTypes.func,

  /**
   * A value getter function. `getter` is called with `path` and `value` and
   * should return the plain **javascript** value at the path.
   *
   * ```ts static
   * function(
   *  path: string,
   *  value: any,
   * ): Object
   * ```
   */
  getter: PropTypes.func,

  /**
   * A value setter function. `setter` is called with `path`, the form `value` and the path `value`.
   * The `setter` must return updated form `value`, which allows you to leave the original value unmutated.
   *
   * The default implementation uses the [react immutability helpers](http://facebook.github.io/react/docs/update.html),
   * letting you treat the form `value` as immutable.
   *
   * ```ts static
   * function(
   *  path: string,
   *  formValue: any,
   *  pathValue: any
   * ): Object
   * ```
   */
  setter: PropTypes.func,

  /**
   * Time in milliseconds that validations should be debounced. Reduces the amount of validation calls
   * made at the expense of a slight delay. Helpful for performance.
   */
  delay: PropTypes.number,

  /**
   * Validations will be strict, making no attempt to coarce input values to the appropriate type.
   */
  strict: PropTypes.bool,

  /**
   * Turns off input validation for the Form, value updates will continue to work.
   */
  noValidate: PropTypes.bool,

  /**
   * A tag name or Component class the Form should render.
   *
   * If `null` are `false` the form will simply render it's child. In
   * this instance there must only be one child.
   */
  as: PropTypes.oneOfType([
    PropTypes.elementType,
    PropTypes.oneOf([null, false]),
  ]),

  /**
   * A Yup schema  that validates the Form `value` prop. Used to validate the form input values
   * For more information about the yup api check out: https://github.com/jquense/yup/blob/master/README.md
   * @type {Schema}
   */
  schema(props, name, componentName) {
    let err: null | Error = null;

    if (props[name]) {
      if (!isSchema(props[name]))
        err = new Error(
          '`schema` must be a proper yup schema: (' + componentName + ')',
        );
    }

    return err;
  },

  /**
   * yup schema context
   */
  context: PropTypes.object,

  /**
   * toggle debug mode, which `console.warn`s validation errors
   */
  debug: PropTypes.bool,
};

_Form.displayName = 'Form';

export default _Form;

export { formGetter as getter, formSetter as setter };
