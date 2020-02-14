import PropTypes from 'prop-types'
import elementType from 'prop-types-extra/lib/elementType'
import expr from 'property-expr'
import React, { useEffect, useImperativeHandle, useMemo, useRef } from 'react'
import shallowequal from 'shallowequal'
import { BindingContext } from 'topeka'
import { useUncontrolled } from 'uncontrollable'
import warning from 'warning'
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
import * as ErrorUtils from './utils/ErrorUtils'
import errToJSON from './utils/errToJSON'
import { notify } from './utils/useEventHandlers'

let done = e =>
  setTimeout(() => {
    throw e
  })

let isValidationError = err => err && err.name === 'ValidationError'

const getter = (path, model) =>
  path ? expr.getter(path, true)(model || {}) : model

const setter = BindingContext.defaultProps.setter

function useErrorContext(errors) {
  const ref = useRef(null)
  if (!ref.current) {
    return (ref.current = errors)
  }
  if (!shallowequal(ref.current.errors, errors)) {
    ref.current = errors
  }

  return ref.current
}

function validatePath(path, { value, schema, ...rest }) {
  return schema
    .validateAt(path, value, rest)
    .then(() => null)
    .catch(err => err)
}

/**
 * @alias Form
 */
const Form = React.forwardRef((uncontrolledProps, ref) => {
  const {
    children,
    value,
    errors,
    schema,
    submitForm,
    getter,
    setter,
    delay,
    debug,
    noValidate,
    onChange,
    onTouch,
    onValidate,
    onError,
    onBeforeSubmit,
    onSubmit,
    onSubmitFinished,
    onInvalidSubmit,
    touched,
    context,
    stripUnknown,
    abortEarly,
    strict,
    as: Element,
    ...elementProps
  } = useUncontrolled(uncontrolledProps, {
    value: 'onChange',
    errors: 'onError',
    touched: 'onTouch',
  })
  const flushTimeout = useTimeout()
  const submitTimeout = useTimeout()
  const isMounted = useMounted()

  const queueRef = useRef([])

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

  function enqueue(fields) {
    queueRef.current.push(...fields)
  }

  const getSchemaForPath = path => {
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

    if (nextTouched !== touched) onTouch(nextTouched, paths)
  })

  const handleValidationRequest = (fields, type, args) => {
    if (noValidate) return

    fields = [].concat(fields)

    notify(onValidate, [{ type, fields, args }])
    enqueue(fields)
    if (type !== 'onChange') flush(delay)
  }

  const handleFieldError = (name, fieldErrors) => {
    handleError(Object.assign(ErrorUtils.remove(errors, name), fieldErrors))
  }

  const handleError = errors => {
    notify(onError, [errors])
  }

  const handleSubmitSuccess = validatedValue => {
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

  const handleSubmitError = err => {
    if (!isValidationError(err)) throw err

    const errors = errToJSON(err)

    maybeWarn(debug, errors, 'onSubmit')

    setSubmitState(s => ({
      submitAttempts: s.submitAttempts + 1,
    }))

    notify(onError, [errors])
    notify(onInvalidSubmit, [errors])
    setSubmitting(false)
  }

  const handleSubmit = e => {
    if (e && e.preventDefault) e.preventDefault()
    submitTimeout.set(() => submit().catch(done))
  }

  const submit = () => {
    if (isSubmittingRef.current) {
      return Promise.resolve(false)
    }
    notify(onBeforeSubmit, [{ value, errors }])

    setSubmitting(true)

    return (
      (noValidate
        ? Promise.resolve(true)
        : schema.validate(value, {
            ...yupOptions,
            abortEarly: false,
            strict: false,
          })
      )
        // no catch, we aren't interested in errors from onSubmit handlers
        .then(handleSubmitSuccess, handleSubmitError)
        .then(onSubmitFinished)
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

  if (Element === 'form') elementProps.noValidate = true // disable html5 validation

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
            <FormErrorContext.Provider value={errorContext}>
              {Element === null || Element === false ? (
                React.cloneElement(React.Children.only(children), elementProps)
              ) : (
                <Element {...elementProps}>{children}</Element>
              )}
            </FormErrorContext.Provider>
          </FormSubmitsContext.Provider>
        </FormTouchedContext.Provider>
      </FormActionsContext.Provider>
    </BindingContext>
  )
})

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

Form.propTypes = {
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
  schema(props, name, componentName, ...args) {
    var err =
      !props.noValidate &&
      PropTypes.any.isRequired(props, name, componentName, ...args)

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

Form.defaultProps = {
  ...BindingContext.defaultProps,
  as: 'form',
  strict: false,
  delay: 300,
  defaultErrors: ErrorUtils.EMPTY_ERRORS,
  defaultTouched: {},
  getter,
  setter,
}

Form.displayName = 'Form'
Form.getter = getter
Form.setter = setter

export default Form
