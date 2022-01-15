import update from '../src/utils/updateIn';

describe('immutable setter', () => {
  it('should create different objects', () => {
    const objA = { foo: [{ bar: { quuz: 10 } }], baz: { quuz: 10 } };
    const objB = update(objA, 'foo[0].bar.quuz', 5);

    expect(objA).not.toBe(objB);
    expect(objA.baz).toBe(objB.baz);
    expect(objA.foo).not.toBe(objB.foo);
    expect(objA.foo[0]).not.toBe(objB.foo[0]);
    expect(objA.foo[0].bar).not.toBe(objB.foo[0].bar);
    expect(objA.foo[0].bar.quuz).not.toBe(objB.foo[0].bar.quuz);

    expect(objB.foo[0].bar.quuz).toBe(5);
  });

  it('should safely set missing branches', () => {
    const objA = { baz: { quuz: 10 } };
    const objB = update(objA, 'foo[0].bar.quuz', 5);

    expect(objA).not.toBe(objB);
    expect(objA.baz).toBe(objB.baz);

    // @ts-expect-error
    expect(objA.foo).toBe(undefined);
    // @ts-expect-error
    expect(objB.foo).toEqual([{ bar: { quuz: 5 } }]);
  });

  it('should not try to copy null', () => {
    expect(() => update({ foo: null }, 'foo.bar', 5)).not.toThrow();
  });

  it('should consider null', () => {
    expect(update({ foo: null }, 'foo.bar', 5)).toEqual({
      foo: { bar: 5 },
    });
  });

  it('should work when input is undefined', () => {
    const obj = update(void 0, 'foo[0].bar.quuz', 5);

    expect(obj).toEqual({ foo: [{ bar: { quuz: 5 } }] });
  });
});
