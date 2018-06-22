import config from '../config'

export let types = Object.create(null)

export default function resolveFieldComponent(type, schema) {
  if (!type && schema) {
    let meta = (schema.meta && schema.meta()) || {}
    type = meta[config.metadataField] || schema._type
  }

  let Component = type

  if (typeof type === 'string') {
    Component = types[type.toLowerCase()] || config.defaultInput
  }

  return [Component, type]
}
