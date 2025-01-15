export default function notify<T extends (...a: any[]) => any>(
  handler: T | undefined,
  args?: Parameters<T>,
) {
  // FIXME: seems to be a babel bug here...
  // eslint-disable-next-line prefer-spread
  if (handler) handler.apply(null, args as any);
}
