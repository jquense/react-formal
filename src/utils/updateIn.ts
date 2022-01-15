import prop from 'property-expr'

const IS_ARRAY = /^\d+$/

function isQuoted(str: string): boolean {
  return !!(
    typeof str === 'string' &&
    str &&
    (str[0] === '"' || str[0] === "'")
  )
}

function copy<T>(value: T): T {
  return Array.isArray(value)
    ? value.concat()
    : value !== null && typeof value === 'object'
    ? //
      // @ts-ignore
      Object.assign(new value.constructor(), value)
    : value
}

function clean(part: string) {
  return isQuoted(part) ? part.substr(1, part.length - 2) : part
}

export default function update<T>(
  model: T | undefined,
  path: string,
  value: any,
): T {
  let parts = prop.split(path)
  let newModel: any = copy(model)
  let part: string
  let islast: boolean

  if (newModel == null) newModel = IS_ARRAY.test(parts[0]) ? [] : {}

  let current = newModel

  for (let idx = 0; idx < parts.length; idx++) {
    islast = idx === parts.length - 1
    part = clean(parts[idx])

    if (islast) current[part] = value
    else {
      current = current[part] =
        current[part] == null
          ? IS_ARRAY.test(parts[idx + 1])
            ? []
            : {}
          : copy(current[part])
    }
  }

  return newModel as T
}
