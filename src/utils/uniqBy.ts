export function uniqBy<T>(array: T[], predicate: (item: T) => any): T[] {
  const keys = new Set();
  const result: T[] = [];

  for (const item of array) {
    const key = predicate(item);

    if (!keys.has(key)) {
      keys.add(key);
      result.push(item);
    }
  }

  return result;
}
