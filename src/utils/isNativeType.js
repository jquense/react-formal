const types = /^(button|checkbox|color|date|datetime|datetime-local|email|file|month|number|password|radio|range|reset|search|submit|tel|text|time|url|w)$/

export default function isNativeType(type) {
  return typeof type === 'string' && type.match(types)
}
