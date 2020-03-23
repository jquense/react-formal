var paths = require('../src/utils/paths');

describe('PATH utils', () => {
  it('should clean part', () => {
    expect(paths.clean("'hi'")).toBe('hi');
    expect(paths.clean('hi')).toBe('hi');
    expect(paths.clean('"hi"')).toBe('hi');
    expect(paths.clean('hi')).toBe('hi');
  });

  it('should check if paths contains', () => {
    expect(paths.inPath('a', 'a.b')).toBe(true);
    expect(paths.inPath('a', 'b.a')).toBe(false);

    expect(paths.inPath('a[0]', 'a[0].b')).toBe(true);
    expect(paths.inPath('a.b', 'a.c')).toBe(false);
    expect(paths.inPath('a.b.c', 'a.b.c.d')).toBe(true);
    expect(paths.inPath('a.b.c.d', 'a.b.c')).toBe(false);

    expect(paths.inPath('a["b"].c', 'a.b["c"].d')).toBe(true);
  });

  it('should reduce array of paths', () => {
    expect(paths.reduce(['a', 'a.b'])).toEqual(['a']);
    expect(paths.reduce(['a.b', 'a'])).toEqual(['a']);

    expect(paths.reduce(['a.b.c', 'a.b', 'a.c'])).toEqual(['a.b', 'a.c']);
  });

  it('should trim paths', () => {
    let errors = {
      'name': ['invalid'],
      'name.first': ['invalid'],
      'id': ['invalid'],
    };

    expect(paths.trim('name', errors)).not.toBe(errors);
    expect(paths.trim('name', errors)).toEqual({
      id: ['invalid'],
    });
  });

  it('should trim paths exactly', () => {
    let errors = {
      'name': ['invalid'],
      'name.first': ['invalid'],
      'id': ['invalid'],
    };

    expect(paths.trim('name', errors, true)).not.toBe(errors);
    expect(paths.trim('name', errors, true)).toEqual({
      'name.first': ['invalid'],
      'id': ['invalid'],
    });
  });

  it('should return same object when unchanged', () => {
    let errors = {
      'name': ['invalid'],
      'name.first': ['invalid'],
      'id': ['invalid'],
    };
    expect(paths.trim('foo', errors)).toBe(errors);
  });
});
