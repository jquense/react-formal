// import { BindingContext as BC } from 'topeka'
// import omit from 'lodash/omit'
// import pick from 'lodash/pick'
// import expr from 'property-expr'
// import PropTypes from 'prop-types'
// import useUncontrolled from 'uncontrollable/hook'
// import React from 'react'
// import ReactDOM from 'react-dom'
// import warning from 'warning'
// import elementType from 'prop-types-extra/lib/elementType'
// import reach from 'yup/lib/util/reach'
// import shallowequal from 'shallowequal'

// import errorManager from './errorManager'
// import errToJSON from './utils/errToJSON'
// import * as ErrorUtils from './utils/ErrorUtils'
// import {
//   FormActionsContext,
//   FormErrorsContext,
//   FormSubmitMetaContext,
//   FormDataContext,
// } from './Contexts'

// const batchedUpdates = ReactDOM.unstable_batchedUpdates || (fn => fn())

// let BindingContext = BC.ControlledComponent

// let done = e =>
//   setTimeout(() => {
//     throw e
//   })

// let isValidationError = err => err && err.name === 'ValidationError'

// const YUP_OPTIONS = [
//   'context',
//   'stripUnknown',
//   'recursive',
//   'abortEarly',
//   'strict',
// ]

// const getter = (path, model) =>
//   path ? expr.getter(path, true)(model || {}) : model

// const setter = BindingContext.defaultProps.setter

// const notify = (handler, ...args) => handler && handler(...args)

// const propTypes = {
//   /**
//    * Form value object, can be left [uncontrolled](/controllables);
//    * use the `defaultValue` prop to initialize an uncontrolled form.
//    */
//   value: PropTypes.object,

//   /**
//    * Callback that is called when the `value` prop changes.
//    *
//    * ```js
//    * function(
//    *   value: object,
//    *   updatedPaths: array<string>
//    * )
//    * ```
//    */
//   onChange: PropTypes.func,

//   /**
//    * An object hash of field errors for the form. The object should be keyed with paths
//    * with the values being an array of errors or message objects. Errors can be
//    * left [uncontrolled](/controllables) (use `defaultErrors` to set an initial value)
//    * or managed along with the `onError` callback. You can use any object shape you'd like for
//    * errors, as long as you provide the Form.Message component an `extract` prop that
//    * understands how to pull out the strings message. By default it understands strings and objects
//    * with a `'message'` property.
//    *
//    * ```js
//    * <Form errors={{
//    *  "name.first": [
//    *    'First names are required',
//    *    {
//    *    	message: "Names must be at least 2 characters long",
//    *    	type: 'min'
//    *    }
//    *  ],
//    * }}/>
//    * ```
//    */
//   errors: PropTypes.object,

//   /**
//    * Callback that is called when a validation error occurs. It is called with an `errors` object
//    *
//    * ```jsx { "editable": true }
//    * class Example extends React.Component {
//    *   constructor(props) {
//    *     this.state = { errors: {} }
//    *   }
//    *   render() {
//    *     return (
//    *       <Form
//    *         schema={modelSchema}
//    *         defaultValue={modelSchema.default()}
//    *         errors={this.state.errors}
//    *         onError={errors => {
//    *           if( errors.dateOfBirth )
//    *             errors.dateOfBirth = 'hijacked!'
//    *           this.setState({ errors })
//    *       }}>
//    *
//    *         <Form.Field name='dateOfBirth'/>
//    *         <Form.Message for='dateOfBirth'/>
//    *
//    *         <Form.Submit type='submit'>Submit</Form.Submit>
//    *       </Form>
//    *     )
//    *   }
//    * }
//    *
//    * render(<Example />)
//    * ```
//    */
//   onError: PropTypes.func,

//   /**
//    * Callback that is called whenever a validation is triggered.
//    * It is called _before_ the validation is actually run.
//    * ```js
//    * function onValidate(event){
//    *   let { type, fields, args } = event
//    * }
//    * ```
//    */
//   onValidate: PropTypes.func,

//   /**
//    * Callback that is fired in response to a submit, _before validation runs.
//    *
//    * ```js
//    * function onSubmit(formValue){
//    *   // do something with valid value
//    * }
//    * ```
//    */
//   onBeforeSubmit: PropTypes.func,

//   /**
//    * Callback that is fired in response to a submit, after validation runs for the entire form.
//    *
//    * ```js
//    * function onSubmit(formValue){
//    *   // do something with valid value
//    * }
//    * ```
//    */
//   onSubmit: PropTypes.func,

//   onSubmitFinished: PropTypes.func,

//   /* */
//   submitForm: PropTypes.func,

//   /**
//    * Callback that is fired when the native onSubmit event is triggered. Only relevant when
//    * the `component` prop renders a `<form/>` tag. onInvalidSubmit will trigger only if the form is invalid.
//    *
//    * ```js
//    * function onInvalidSubmit(errors){
//    *   // do something with errors
//    * }
//    * ```
//    */
//   onInvalidSubmit: PropTypes.func,

//   /**
//    * A value getter function. `getter` is called with `path` and `value` and
//    * should return the plain **javascript** value at the path.
//    *
//    * ```ts
//    * function(
//    *  path: string,
//    *  value: any,
//    * ): Object
//    * ```
//    */
//   getter: PropTypes.func,

//   /**
//    * A value setter function. `setter` is called with `path`, the form `value` and the path `value`.
//    * The `setter` must return updated form `value`, which allows you to leave the original value unmutated.
//    *
//    * The default implementation uses the [react immutability helpers](http://facebook.github.io/react/docs/update.html),
//    * letting you treat the form `value` as immutable.
//    * ```js
//    * function(
//    *  path: string,
//    *  formValue: object,
//    *  pathValue: any
//    * ) -> object
//    * ```
//    */
//   setter: PropTypes.func,

//   /**
//    * Time in milliseconds that validations should be debounced. Reduces the amount of validation calls
//    * made at the expense of a slight delay. Helpful for performance.
//    */
//   delay: PropTypes.number,

//   /**
//    * Validations will be strict, making no attempt to coarce input values to the appropriate type.
//    */
//   strict: PropTypes.bool,

//   /**
//    * Turns off input validation for the Form, value updates will continue to work.
//    */
//   noValidate: PropTypes.bool,

//   /**
//    * A tag name or Component class the Form should render.
//    *
//    * If `null` are `false` the form will simply render it's child. In
//    * this instance there must only be one child.
//    */
//   as: PropTypes.oneOfType([elementType, PropTypes.oneOf([null, false])]),

//   /**
//    * A Yup schema  that validates the Form `value` prop. Used to validate the form input values
//    * For more information about the yup api check out: https://github.com/jquense/yup/blob/master/README.md
//    * @type {YupSchema}
//    */
//   schema(props, name, componentName, ...args) {
//     var err =
//       !props.noValidate &&
//       PropTypes.any.isRequired(props, name, componentName, ...args)

//     if (props[name]) {
//       let schema = props[name]
//       if (!schema.__isYupSchema__ && !(schema.resolve && schema.validate))
//         err = new Error(
//           '`schema` must be a proper yup schema: (' + componentName + ')'
//         )
//     }

//     return err
//   },

//   /**
//    * yup schema context
//    */
//   context: PropTypes.object,

//   /**
//    * toggle debug mode, which `console.warn`s validation errors
//    */
//   debug: PropTypes.bool,
// }

// const defaultProps = {
//   ...BindingContext.defaultProps,
//   as: 'form',
//   strict: false,
//   delay: 300,
//   errors: ErrorUtils.EMPTY_ERRORS,
//   touched: {},
//   getter,
//   setter,
// }

// function useTimeout(delay) {
//   const handle = useRef(null)
//   const timeout = {
//     clear() {
//       clearTimeout(handle)
//     },
//     set(fn) {
//       handle = setTimeout(fn, delay)
//     },
//   }
//   useEffect(() => timeout.clear, [])
//   return timeout
// }

// function useValidationQueue(errorManager, props) {
//   const { schema, errors, delay, onError } = props
//   const timeout = useTimeout()

//   const queue = useRef([])

//   const flush = () => {
//     timeout.clear()
//     timeout.set(() => {
//       let fields = queue.current

//       if (!fields.length) return

//       queue.current = []

//       errorManager
//         .collectErrors(fields, props)
//         .then(errors => {
//           if (errors !== props.errors) {
//             maybeWarn(props.debug, errors, 'field validation')
//             notify(onError, errors)
//           }
//         })
//         .catch(done)
//     }, delay)
//   }

//   useEffect(() => {
//     flush(delay)
//   })

//   useEffect(() => {
//     queue.current = queue.current.concat(Object.keys(errors))
//   }, [schema, !!errors])
// }

// function useFormActions({
//   schema,
//   value,
//   errors,
//   context,
//   onValidate,
//   onError,
//   noValidate,
//   delay,
// }) {
//   const getSchemaForPath = useCallback(
//     path => schema && path && reach(schema, path, value, context),
//     [schema, value, context]
//   )

//   const handleValidationRequest = (fields, type, args) => {
//     // let { noValidate, delay } = this.props
//     // fields = [].concat(fields)
//     // if (noValidate) return
//     // notify('onValidate', { type, fields, args })
//     // this.enqueue(fields)
//     // if (type !== 'onChange') this.flush(delay)
//   }

//   const handleFieldError = (name, fieldErrors) => {
//     notify(onError, Object.assign(ErrorUtils.remove(errors, name), fieldErrors))
//   }

//   const handleSubmitSuccess = validatedValue => {
//     const { submitForm } = this.props
//     this.notify('onSubmit', validatedValue)

//     return Promise.resolve(submitForm && submitForm(validatedValue)).then(
//       () => {
//         this.setSubmitting(false)

//         this.updateFormState(s => ({
//           submits: {
//             ...s.submits,
//             submitCount: s.submits.submitCount + 1,
//             submitAttempts: s.submits.submitAttempts + 1,
//           },
//         }))
//         this.notify('onSubmitFinished')
//       },
//       err => {
//         this.setSubmitting(false)
//         this.notify('onSubmitFinished', err)
//         throw err
//       }
//     )
//   }

//   const handleSubmitError = err => {
//     if (!isValidationError(err)) throw err

//     var errors = errToJSON(err)

//     maybeWarn(this.props.debug, errors, 'onSubmit')

//     this.updateFormState(s => ({
//       submits: {
//         ...s.submits,
//         submitAttempts: s.submits.submitAttempts + 1,
//       },
//     }))

//     this.notify('onError', errors)
//     this.notify('onInvalidSubmit', errors)
//     this.setSubmitting(false)
//   }

//   const handleSubmit = e => {
//     if (e && e.preventDefault) e.preventDefault()

//     clearTimeout(this.submitTimer)
//     this.submitTimer = setTimeout(() => this.submit().catch(done), 0)
//   }

//   return {
//     onSubmit: this.handleSubmit,
//     onValidate: this.handleValidationRequest,
//     onFieldError: this.handleFieldError,
//     getSchemaForPath: this.getSchemaForPath,
//   }
// }

// function useErrorManager() {
//   return useMemo(
//     () =>
//       errorManager((path, { props }) => {
//         let options = pick(props, YUP_OPTIONS)
//         let abortEarly = options.abortEarly == null ? false : options.abortEarly

//         let { value, schema } = props

//         return schema
//           .validateAt(path, value, { ...options, abortEarly })
//           .then(() => null)
//           .catch(err => err)
//       }),
//     []
//   )
// }

// /**
//  * Form component renders a `value` to be updated and validated by child Fields.
//  * Forms can be thought of as `<input/>`s for complex values, or models. A Form aggregates
//  * a bunch of smaller inputs, each in charge of updating a small part of the overall model.
//  * The Form will integrate and validate each change and fire a single unified `onChange` with the new `value`.
//  *
//  * Validation errors can be displayed anywhere inside a Form with Message Components.
//  *
//  * ```jsx { "editable": true }
//  * var defaultStr = yup.string().default('')
//  *
//  * var customerSchema = yup
//  *   .object({
//  *     name: yup.object({
//  *       first: defaultStr
//  *         .required('please enter a first name'),
//  *
//  *       last: defaultStr
//  *         .required('please enter a surname'),
//  *     }),
//  *
//  *     dateOfBirth: yup.date()
//  *       .max(new Date(), "Are you a time traveler?!"),
//  *
//  *     colorId: yup.number()
//  *       .nullable()
//  *       .required('Please select a dank color')
//  *   });
//  *
//  * render(
//  *   <Form
//  *     schema={customerSchema}
//  *     defaultValue={customerSchema.default()}
//  *   >
//  *     <div>
//  *       {\/\*'grandchildren' are no problem \*\/}
//  *       <label>Name</label>
//  *
//  *       <Form.Field
//  *         name='name.first'
//  *         placeholder='First name'
//  *       />
//  *       <Form.Field
//  *         name='name.last'
//  *         placeholder='Surname'
//  *       />
//  *
//  *       <Form.Message for={['name.first', 'name.last']} className="validation-error"/>
//  *     </div>
//  *
//  *     <label>Date of Birth</label>
//  *     <Form.Field name='dateOfBirth'/>
//  *     <Form.Message for='dateOfBirth' className="validation-error"/>
//  *
//  *     <label>Favorite Color</label>
//  *     <Form.Field name='colorId' as='select'>
//  *       <option value={null}>Select a color...</option>
//  *       <option value={0}>Red</option>
//  *       <option value={1}>Yellow</option>
//  *       <option value={2}>Blue</option>
//  *       <option value={3}>other</option>
//  *     </Form.Field>
//  *     <Form.Message for='colorId' className="validation-error"/>
//  *
//  *   <Form.Submit type='submit'>
//  *     Submit
//  *   </Form.Submit>
//  * </Form>)
//  * ```
//  */
// function Form(uncontrolledProps) {
//   const props = useUncontrolled(uncontrolledProps, {
//     value: 'onChange',
//     errors: 'onError',
//     touched: 'onTouch',
//   })

//   const errorManager = useErrorManager()

//   const formActions = useFormActions(props)

//   // getDerivedStateFromProps({ value, touched, errors }, { formState }) {
//   //   if (
//   //     value !== formState.value ||
//   //     touched !== formState.touched ||
//   //     !shallowequal(formState.errors, errors)
//   //   )
//   //     return { formState: { ...formState, errors: errors, touched, value } }

//   //   return null
//   // }

//   // componentDidUpdate(prevProps) {
//   //   const { errors, delay, schema } = this.props
//   //   const schemaChanged = schema !== prevProps.schema

//   //   if (schemaChanged && errors) {
//   //     this.enqueue(Object.keys(errors))
//   //   }

//   //   this.flush(delay)
//   // }

//   // handleChange = (model, paths) => {
//   //   let { onChange, onTouch, touched } = this.props
//   //   let nextTouched = touched

//   //   onChange(model, paths)

//   //   paths.forEach(path => {
//   //     if (touched && touched[path]) return
//   //     if (nextTouched === touched) nextTouched = { ...touched, [path]: true }
//   //     else nextTouched[path] = true
//   //   })

//   //   if (nextTouched !== touched) onTouch(nextTouched, paths)
//   // }

//   // handleError = errors => {
//   //   this.notify('onError', errors)
//   // }

//   // handleSubmitSuccess = validatedValue => {
//   //   const { submitForm } = this.props
//   //   this.notify('onSubmit', validatedValue)

//   //   return Promise.resolve(submitForm && submitForm(validatedValue)).then(
//   //     () => {
//   //       this.setSubmitting(false)

//   //       this.updateFormState(s => ({
//   //         submits: {
//   //           ...s.submits,
//   //           submitCount: s.submits.submitCount + 1,
//   //           submitAttempts: s.submits.submitAttempts + 1,
//   //         },
//   //       }))
//   //       this.notify('onSubmitFinished')
//   //     },
//   //     err => {
//   //       this.setSubmitting(false)
//   //       this.notify('onSubmitFinished', err)
//   //       throw err
//   //     }
//   //   )
//   // }

//   // handleSubmitError = err => {
//   //   if (!isValidationError(err)) throw err

//   //   var errors = errToJSON(err)

//   //   maybeWarn(this.props.debug, errors, 'onSubmit')

//   //   this.updateFormState(s => ({
//   //     submits: {
//   //       ...s.submits,
//   //       submitAttempts: s.submits.submitAttempts + 1,
//   //     },
//   //   }))

//   //   this.notify('onError', errors)
//   //   this.notify('onInvalidSubmit', errors)
//   //   this.setSubmitting(false)
//   // }

//   // handleSubmit = e => {
//   //   if (e && e.preventDefault) e.preventDefault()

//   //   clearTimeout(this.submitTimer)
//   //   this.submitTimer = setTimeout(() => this.submit().catch(done), 0)
//   // }

//   // updateFormState = fn => {
//   //   batchedUpdates(() => {
//   //     if (this.unmounted) return

//   //     this.setState(({ formState }) => {
//   //       const nextFormState = fn(formState)

//   //       // TODO: optimize the nullish case
//   //       return nextFormState !== formState && nextFormState !== null
//   //         ? { formState: { ...formState, ...nextFormState } }
//   //         : null
//   //     })
//   //   })
//   // }

//   // collectErrors(fields, props = this.props) {
//   //   return this.errors.collect(fields, props.errors, { props })
//   // }

//   // enqueue(fields) {
//   //   this.queue = this.queue.concat(fields)
//   // }

//   // flush(delay) {
//   //   clearTimeout(this.validationTimer)
//   //   this.validationTimer = setTimeout(() => {
//   //     let fields = this.queue
//   //     let props = this.props

//   //     if (!fields.length) return

//   //     this.queue = []
//   //     this.collectErrors(fields, this.props)
//   //       .then(errors => {
//   //         if (errors !== this.props.errors) {
//   //           maybeWarn(props.debug, errors, 'field validation')

//   //           this.notify('onError', errors)
//   //         }
//   //       })
//   //       .catch(done)
//   //   }, delay)
//   // }

//   // submit = () => {
//   //   let {
//   //     schema,
//   //     noValidate,
//   //     value,
//   //     onSubmitFinished,
//   //     errors,
//   //     ...options
//   //   } = this.props

//   //   if (this._submitting) {
//   //     return Promise.resolve(false)
//   //   }

//   //   options.abortEarly = false
//   //   options.strict = false

//   //   this.notify('onBeforeSubmit', { value, errors })

//   //   this.setSubmitting(true)

//   //   return (
//   //     (noValidate ? Promise.resolve(true) : schema.validate(value, options))
//   //       // no catch, we aren't interested in errors from onSubmit handlers
//   //       .then(this.handleSubmitSuccess, this.handleSubmitError)
//   //       .then(onSubmitFinished)
//   //   )
//   // }

//   // setSubmitting(submitting) {
//   //   if (this.unmounted) return
//   //   // this state is duplicated locally because it can take longer for the
//   //   // submit state to flush than a user can re-submit which we don't want
//   //   this._submitting = submitting
//   //   this.updateFormState(s =>
//   //     s.submits.submitting !== submitting
//   //       ? { submits: { ...s.submits, submitting } }
//   //       : null
//   //   )
//   // }

//   // notify(event, ...args) {
//   //   if (this.props[event]) this.props[event](...args)
//   // }

//   // debug = (...args) => {
//   //   if (!this.props.__debugName) return
//   //   console.log('Form:', this.props.__debugName, ...args) // eslint-disable-line
//   // }

//   // validate(fields) {
//   //   return this.collectErrors(fields)
//   // }

//   var {
//     children,
//     value,
//     getter,
//     setter,
//     as: Element,
//     onChange: _,
//     onTouch: _1,
//     touched: _2,
//   } = this.props

//   let props = omit(this.props, [
//     ...YUP_OPTIONS,
//     ...Object.keys(Form.propTypes),
//     'onTouch',
//   ])

//   delete props.__debugName

//   if (Element === 'form') props.noValidate = true // disable html5 validation

//   props.onSubmit = this.handleSubmit

//   if (Element === null || Element === false) {
//     children = React.cloneElement(React.Children.only(children), props)
//   } else {
//     children = <Element {...props}>{children}</Element>
//   }

//   return (
//     <BindingContext
//       value={value}
//       getter={getter}
//       setter={setter}
//       onChange={this.handleChange}
//     >
//       <FormActionsContext.Provider value={this.formActions}>
//         <FormDataContext.Provider value={this.state.formState}>
//           {children}
//         </FormDataContext.Provider>
//       </FormActionsContext.Provider>
//     </BindingContext>
//   )
// }

// function maybeWarn(debug, errors, target) {
//   if (!debug) return

//   if (process.env.NODE_ENV !== 'production') {
//     let keys = Object.keys(errors)
//     warning(
//       !keys.length,
//       `[react-formal] (${target}) invalid fields: ${keys.join(', ')}`
//     )
//   }
// }

// const ControlledForm = uncontrollable(Form, {
//   value: 'onChange',
//   errors: 'onError',
//   touched: 'onTouch',
// })

// ControlledForm.getter = getter
// ControlledForm.setter = setter

// export default ControlledForm
