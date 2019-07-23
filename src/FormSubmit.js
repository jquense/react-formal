import PropTypes from 'prop-types'
import React, { useCallback, useContext, useMemo } from 'react'
import warning from 'warning'
import memoize from 'memoize-one'
import elementType from 'prop-types-extra/lib/elementType'
import useCommittedRef from '@restart/hooks/useCommittedRef'

import { filterAndMapErrors } from './utils/ErrorUtils'
import {
  withState,
  FORM_DATA,
  FormActionsContext,
  FormErrorContext,
  FormSubmitsContext,
} from './Contexts'
import useEventHandlers, { notify } from './utils/useEventHandlers'

function useFormSubmit(props) {
  const propsRef = useCommittedRef(props)

  const { triggers, events } = props

  const actions = useContext(FormActionsContext)
  const submits = useContext(FormSubmitsContext)
  let errors = useContext(FormErrorContext)

  const handleSubmit = useCallback(
    (event, args) => {
      if (!actions) {
        return warning(
          false,
          'A Form submit event ' +
            'was triggered from a component outside the context of a Form. ' +
            'The Button should be wrapped in a Form component'
        )
      }

      if (triggers && triggers.length) {
        actions.onValidate(triggers, event, args)
      } else actions.onSubmit()
    },
    [actions, triggers && triggers.join(',')]
  )

  const eventHandlers = useEventHandlers(
    events,
    useCallback(
      (event, args) => {
        notify(propsRef.current[event], args)
        handleSubmit(event, args)
      },
      [propsRef, handleSubmit]
    )
  )

  const memoFilterAndMapErrors = useMemo(() =>
    memoize(
      filterAndMapErrors,
      ([a], [b]) =>
        a.errors === b.errors &&
        a.names === b.names &&
        a.maperrors === b.maperrors
    )
  )

  const partial = triggers && triggers.length
  if (partial) errors = memoFilterAndMapErrors({ errors, names: triggers })

  return [
    eventHandlers,
    useMemo(() => ({ errors, ...submits }), [errors, submits]),
  ]
}
/**
 * A Form submit button, for triggering validations for the entire form or specific fields.
 */
function FormSubmit(props) {
  const { events: _, triggers, children, as: Component, ...rest } = props
  const [eventHandlers] = useFormSubmit(props)

  return (
    <Component
      {...rest}
      {...eventHandlers}
      type={triggers && triggers.length ? 'button' : 'submit'}
    >
      {children}
    </Component>
  )
}

FormSubmit.propTypes = {
  /**
   * The `<button/>` type
   */
  type: PropTypes.oneOf(['button', 'submit']),

  /**
   * Specify particular fields to validate in the related form. If empty the entire form will be validated.
   */
  triggers: PropTypes.arrayOf(PropTypes.string.isRequired),

  /**
   * Provide a render function to completely override the rendering behavior
   * of FormSubmit (`as` will be ignored). In addition to passing through props some
   * additional form submission metadata is injected to handle loading and disabled behaviors.
   *
   * ```js
   * <Form.Submit>
   *   {({ errors, props, submitting, submitCount, submitAttempts }) =>
   *     <button {...props} disabled={submitCount > 1}>
   *       submitting ? 'Saving…' : 'Submit'}
   *     </button>
   * </Form.Submit>
   * ```
   */
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),

  /**
   * Control the rendering of the Form Submit component when not using
   * the render prop form of `children`.
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

  /** @private */
  errors: PropTypes.object,
  /** @private */
  actions: PropTypes.object,
  /** @private */
  submits: PropTypes.object,
}

FormSubmit.defaultProps = {
  as: 'button',
  events: ['onClick'],
}

export default withState(
  (ctx, props, ref) => (
    <FormActionsContext.Consumer>
      {actions => (
        <FormSubmit
          {...props}
          ref={ref}
          actions={actions}
          submits={ctx.submits}
          errors={ctx.errors}
        />
      )}
    </FormActionsContext.Consumer>
  ),
  FORM_DATA.errors | FORM_DATA.SUBMITS
)
