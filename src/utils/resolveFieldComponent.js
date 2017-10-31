import Input from '../inputs/Input';
import config from '../config';
import types from './types';

export default function resolveFieldComponent(type, schema) {
  if (!type && schema) {
    let meta = (schema.meta && schema.meta()) || {};
    type = meta[config.metadataField] || schema._type
  }

  let Component = type

  if (typeof type === 'string') {
    Component = types[type.toLowerCase()] || Input
  }

  return [Component, type]
}
