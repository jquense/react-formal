import { ObjectSchema, Schema } from 'yup'
import { ReactElement, ReactNode, SyntheticEvent, ReactType } from 'react'
import { RenderedAsComponent } from './helpers'

type Errors = Record<string, any[]>
type Touched = Record<string, boolean>

export type SchemaValue<T extends ObjectSchema<unknown>> = ReturnType<T['cast']>

type ValidateData = {
  fields: string[]
  type: SyntheticEvent
  args?: any[]
}

type BeforeSubmitData<T> = {
  value: T
  errors: Errors
}

type Mapper<TOut, TIn = any> = (input: TIn) => TOut

type Meta<TValue = any, TSchema extends Schema = Schema<TValue>> = {
  schema: TSchema | undefined
  errors: Errors
  touched: Touched
  errorClass: string
  context?: {}
  invalid: boolean
  valid: boolean
  value: TValue
  onError(Errors): void
}

interface FieldRenderProps<TValue = any> {
  type: string
  meta: Meta<TValue>
}

interface FieldProps<TValue = any> {
  name: string
  events?: string | string[] | ((meta: Meta<TValue>) => string | string[])
  mapToValue?: Mapper<any, TValue>
  mapFromValue?:
    | Mapper<TValue>
    | keyof Value
    | { [P in keyof TValue]: string | Mapper<TValue> }
  exclusive?: boolean
  noValidate?: boolean
  errorClass?: string
  validates?: string | string[]
  noMeta?: boolean

  children?: ReactNode | ((opts: FieldRenderProps<TValue>) => ReactNode)
}

class FormField<
  TValue,
  As extends ReactType = 'input'
> extends RenderedAsComponent<As, FieldProps<TValue>> {}

interface SubmitProps {
  triggers?: string[]
  children:
    | ReactNode
    | ((data: {
        errors: Errors
        props: any
        submitCount: number
        submitAttempts: number
        submitting: boolean
      }) => ReactNode)
}

class FormSubmit<As extends ReactType = 'button'> extends RenderedAsComponent<
  As,
  SubmitProps
> {}

interface FormProps<
  TSchema extends ObjectSchema<{}>,
  T = SchemaValue<TSchema>
> {
  schema?: TSchema
  value?: T
  defaultValue?: T
  errors?: Errors
  defaultErrors?: Errors
  touched?: Touched
  defaultTouched?: Touched
  noValidate?: boolean
  onChange?: (input: T, changedPaths: string[]) => void
  onError?: (errors: Errors) => void
  onTouch?: (touched: Touched, changedPaths: string[]) => void
  onValidate?: (data: ValidateData) => void
  onBeforeSubmit?: (data: BeforeSubmitData<T>) => void
  onSubmit?: (validatedValue: T) => void
  onInvalidSubmit?: (errors: Errors) => void
  onSubmitFinished?: (error?: Error) => void

  submitForm?: (input: T) => Promise<any>
  getter?: (path: string, value: T) => any
  setter?: (path: string, value: T, fieldValue: any) => T
  context?: object

  /** Adds some additional runtime console warnings */
  debug?: boolean
}

export default class Form<
  TSchema,
  As extends ReactType = 'form'
> extends RenderedAsComponent<As, FormProps<TSchema>> {
  static Field: typeof FormField
  static Submit: typeof FormSubmit
}
