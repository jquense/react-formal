export type Errors = Record<string, any[]>

export type Touched = Record<string, boolean>

export type ValidateData = {
  fields: string[]
  type: string
  args?: any[]
}

export type BeforeSubmitData<T> = {
  value: T | undefined
  errors: Errors
}
