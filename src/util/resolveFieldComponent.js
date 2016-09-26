import config from '../config';

export default function resolveFieldComponent(type, schema) {
  if (!type && schema) {
    let meta = (schema.meta && schema.meta()) || {};
    type = meta[config.metadataField] || schema._type
  }

  let Component = type

  if (typeof type === 'string') {
    Component = config.types[type.toLowerCase()] || config.types['']
  }

  return [Component, type]
}
