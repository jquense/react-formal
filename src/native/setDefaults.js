
export default function setDefaults(Component, defaults) {
  Object.assign(Component.defaultProps, defaults)
  return Component;
}
