/* eslint-disable @typescript-eslint/no-use-before-define */
import PropTypes from 'prop-types'
import elementType from 'prop-types-extra/lib/elementType'
import expr from 'property-expr'
import React, {
  SyntheticEvent,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react'
import shallowequal from 'shallowequal'
import { BindingContext } from 'topeka'
import { useUncontrolledProp } from 'uncontrollable'
import warning from 'warning'
import * as Yup from 'yup'
import reach from 'yup/lib/util/reach'
import useEventCallback from '@restart/hooks/useEventCallback'
import useMergeState from '@restart/hooks/useMergeState'
import useMounted from '@restart/hooks/useMounted'
import useTimeout from '@restart/hooks/useTimeout'
import {
  FormActionsContext,
  FormErrorContext,
  FormSubmitsContext,
  FormTouchedContext,
} from './Contexts'
import createErrorManager from './errorManager'
import { BeforeSubmitData, Errors, Touched, ValidateData } from './types'
import * as ErrorUtils from './utils/ErrorUtils'
import errToJSON from './utils/errToJSON'
import { toArray } from './utils/paths'
import { notify } from './utils/useEventHandlers'

export interface FormProps<
  TSchema extends Yup.ObjectSchema,
  TValue = Yup.InferType<TSchema>
> {
  as?: React.ElementType | null | false
  className?: string
  children?: React.ReactElement | React.ReactElement[]

  schema?: TSchema
  value?: TValue
  defaultValue?: TValue
  errors?: Errors
  defaultErrors?: Errors

  touched?: Touched
  defaultTouched?: Touched

  noValidate?: boolean
  onChange?: (input: TValue, changedPaths: string[]) => void
  onError?: (errors: Errors) => void
  onTouch?: (touched: Touched, changedPaths: string[]) => void
  onValidate?: (data: ValidateData) => void
  onBeforeSubmit?: (data: BeforeSubmitData<TValue>) => void
  onSubmit?: (validatedValue: TValue) => void
  onInvalidSubmit?: (errors: Errors) => void
  onSubmitFinished?: (error?: Error) => void

  submitForm?: (input: TValue) => Promise<any>
  getter?: (path: string, value: TValue) => any
  setter?: (path: string, value: TValue, fieldValue: any) => TValue
  context?: object

  delay?: number

  stripUnknown?: boolean
  abortEarly?: boolean
  strict?: boolean

  /** Adds some additional runtime console warnings */
  debug?: boolean

  [other: string]: any
}

let done = (e: Error) =>
  setTimeout(() => {
    throw e
  })

let isValidationError = (err: any): err is Yup.ValidationError =>
  err && err.name === 'ValidationError'

const formGetter = (path: string, model: any) =>
  path ? expr.getter(path, true)(model || {}) : model

const formSetter = BindingContext.defaultProps.setter

function useErrorContext(errors?: Errors) {
  const ref = useRef<Errors | null>(null)
  if (!ref.current) {
    return (ref.current = errors ?? null)
  }
  if (!shallowequal(ref.current.errors, errors)) {
    ref.current = errors ?? null
  }

  return ref.current
}

function validatePath(path: string, { value, schema, ...rest }): Promise<void> {
  return schema
    .validateAt(path, value, rest)
    .then(() => null)
    .catch(err => err)
}

const EMPTY_TOUCHED = {}

export interface FormHandle {
  submit: () => Promise<false | void>
  validate(fields: string[]): void
}

export declare interface Form {
  <T extends Yup.ObjectSchema>(
    props: FormProps<T> & React.RefAttributes<FormHandle>,
  ): React.ReactElement | null

  displayName?: string
  propTypes?: any

  // getter: typeof formGetter
  // setter: typeof formSetter
}

/** @alias Form */
const _Form: Form = React.forwardRef(
  <T extends Yup.ObjectSchema>(
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
    )
    const [errors, onError] = useUncontrolledProp(
      propErrors,
      defaultErrors,
      propOnError,
    )
    const [touched, onTouch] = useUncontrolledProp(
      propTouched,
      defaultTouched,
      propOnTouch,
    )

    const flushTimeout = useTimeout()
    const submitTimeout = useTimeout()
    const isMounted = useMounted()

    const queueRef = useRef<string[]>([])

    const errorManager = useMemo(() => createErrorManager(validatePath), [])

    const yupOptions = {
      strict,
      context,
      stripUnknown,
      abortEarly: abortEarly == null ? false : abortEarly,
    }

    const isSubmittingRef = useRef(false)
    const [submits, setSubmitState] = useMergeState(() => ({
      submitCount: 0,
      submitAttempts: 0,
      submitting: false,
    }))

    function setSubmitting(submitting) {
      if (!isMounted()) return

      isSubmittingRef.current = submitting
      setSubmitState({ submitting })
    }

    const errorContext = useErrorContext(errors)

    const isUpdateRef = useRef(false)
    useEffect(() => {
      // don't do this on mount
      if (!isUpdateRef.current) {
        isUpdateRef.current = true
        return
      }

      if (errors) {
        enqueue(Object.keys(errors))
      }
    }, [schema])

    const flush = () => {
      flushTimeout.set(() => {
        let fields = queueRef.current

        if (!fields.length) return

        queueRef.current = []
        errorManager
          .collect(fields, errors, {
            schema,
            value,
            ...yupOptions,
          })
          .then(nextErrors => {
            if (nextErrors !== errors) {
              maybeWarn(debug, errors, 'field validation')

              notify(onError, [nextErrors])
            }
          })
          .catch(done)
      }, delay)
    }

    useEffect(() => {
      flush()
    })

    function enqueue(fields: string[]) {
      queueRef.current.push(...fields)
    }

    const getSchemaForPath = (path: string): Yup.Schema<any> | undefined => {
      return schema && path && reach(schema, path, value, context)
    }

    const handleChange = useEventCallback((model, paths) => {
      let nextTouched = touched

      onChange(model, paths)
      paths.forEach(path => {
        if (touched && touched[path]) return
        if (nextTouched === touched) nextTouched = { ...touched, [path]: true }
        else nextTouched[path] = true
      })

      if (nextTouched !== touched) onTouch(nextTouched!, paths)
    })

    const handleValidationRequest = (
      fields: string | string[],
      type: string,
      args: any[],
    ) => {
      if (noValidate) return

      fields = toArray(fields)

      notify(onValidate, [{ type, fields, args }])
      enqueue(fields)
      if (type !== 'onChange') flush()
    }

    const handleFieldError = (name: string, fieldErrors: Errors) => {
      handleError(Object.assign(ErrorUtils.remove(errors, name), fieldErrors))
    }

    const handleError = (errors: Errors) => {
      notify(onError, [errors])
    }

    const handleSubmitSuccess = (validatedValue: Yup.InferType<T>) => {
      notify(onSubmit, [validatedValue])

      return Promise.resolve(submitForm && submitForm(validatedValue)).then(
        () => {
          setSubmitting(false)
          setSubmitState(s => ({
            submitCount: s.submitCount + 1,
            submitAttempts: s.submitAttempts + 1,
          }))
          notify(onSubmitFinished)
        },
        err => {
          setSubmitting(false)
          notify(onSubmitFinished, [err])
          throw err
        },
      )
    }

    const handleSubmitError = (err: any) => {
      if (!isValidationError(err)) throw err

      const errors = errToJSON(err)

      maybeWarn(debug, errors, 'onSubmit')

      setSubmitState(s => ({
        submitAttempts: s.submitAttempts + 1,
      }))

      notify(onError, [errors])
      notify(onInvalidSubmit, [errors])
      setSubmitting(false)

      notify(onSubmitFinished, [err])
    }

    const handleSubmit = (e?: React.SyntheticEvent) => {
      if (e && e.preventDefault) e.preventDefault()
      submitTimeout.set(() => submit().catch(done))
    }

    const submit = (): Promise<false | void> => {
      if (isSubmittingRef.current) {
        return Promise.resolve(false)
      }
      notify(onBeforeSubmit, [{ value: value!, errors }])

      setSubmitting(true)

      return (
        (noValidate
          ? Promise.resolve(value as object)
          : schema!.validate(value, {
              ...yupOptions,
              abortEarly: false,
              strict: false,
            })
        )
          // no catch, we aren't interested in errors from onSubmit handlers
          .then(handleSubmitSuccess, handleSubmitError)
      )
    }

    useImperativeHandle(ref, () => ({
      submit,
      validate(fields) {
        errorManager.collect(fields, errors, { schema, value, ...yupOptions })
      },
    }))

    const formActions = Object.assign(useRef({}).current, {
      getSchemaForPath,
      yupContext: context,
      onSubmit: handleSubmit,
      onValidate: handleValidationRequest,
      onFieldError: handleFieldError,
    })

    if (Element === 'form') {
      elementProps.noValidate = true // disable html5 validation
    }

    elementProps.onSubmit = handleSubmit

    return (
      <BindingContext
        value={value}
        getter={getter}
        setter={setter}
        onChange={handleChange}
      >
        <FormActionsContext.Provider value={formActions}>
          <FormTouchedContext.Provider value={touched}>
            <FormSubmitsContext.Provider value={submits}>
              <FormErrorContext.Provider value={errorContext!}>
                {Element == null || Element === false ? (
                  React.cloneElement(
                    React.Children.only(children!),
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
    )
  },
)

function maybeWarn(debug, errors, target) {
  if (!debug) return

  if (process.env.NODE_ENV !== 'production') {
    let keys = Object.keys(errors)
    warning(
      !keys.length,
      `[react-formal] (${target}) invalid fields: ${keys.join(', ')}`,
    )
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
   * function(
   *   value: object,
   *   updatedPaths: array<string>
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
   * ```jsx
   * class Example extends React.Component {
   *   constructor(props) {
   *     this.state = { errors: {} }
   *   }
   *   render() {
   *     return (
   *       <Form
   *         schema={modelSchema}
   *         defaultValue={modelSchema.default()}
   *         errors={this.state.errors}
   *         onError={errors => {
   *           if( errors.dateOfBirth )
   *             errors.dateOfBirth = 'hijacked!'
   *           this.setState({ errors })
   *       }}>
   *
   *         <Form.Field name='dateOfBirth'/>
   *         <Form.Message for='dateOfBirth'/>
   *
   *         <Form.Submit type='submit'>Submit</Form.Submit>
   *       </Form>
   *     )
   *   }
   * }
   *
   * render(<Example />)
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
   * function onValidate(event){
   *   let { type, fields, args } = event
   * }
   * ```
   */
  onValidate: PropTypes.func,

  /**
   * Callback that is fired in response to a submit, _before validation runs.
   *
   * ```js static
   * function onSubmit(formValue){
   *   // do something with valid value
   * }
   * ```
   */
  onBeforeSubmit: PropTypes.func,

  /**
   * Callback that is fired in response to a submit, after validation runs for the entire form.
   *
   * ```js static
   * function onSubmit(formValue){
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
   *  formValue: object,
   *  pathValue: any
   * ) -> object
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
  as: PropTypes.oneOfType([elementType, PropTypes.oneOf([null, false])]),

  /**
   * A Yup schema  that validates the Form `value` prop. Used to validate the form input values
   * For more information about the yup api check out: https://github.com/jquense/yup/blob/master/README.md
   * @type {YupSchema}
   */
  schema(props, name, componentName, loc, secret) {
    let err = !props.noValidate
      ? PropTypes.any.isRequired(props, name, componentName, loc, secret)
      : null

    if (props[name]) {
      let schema = props[name]
      if (!schema.__isYupSchema__ && !(schema.resolve && schema.validate))
        err = new Error(
          '`schema` must be a proper yup schema: (' + componentName + ')',
        )
    }

    return err
  },

  /**
   * yup schema context
   */
  context: PropTypes.object,

  /**
   * toggle debug mode, which `console.warn`s validation errors
   */
  debug: PropTypes.bool,
}

_Form.displayName = 'Form'

// _Form.setter = formGetter
// _Form.getter = formSetter
//

export default Object.assign(_Form, {
  getter: formGetter,
  setter: formGetter,
})
