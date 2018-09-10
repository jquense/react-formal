import config from '../config'

export default function resolveFieldComponent(type, schema) {
  if (!type && schema) type = schema._type
  const Component = typeof type === 'string' ? config.defaultInput : type
  return [Component, type]
}
