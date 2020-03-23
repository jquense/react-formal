import * as Utils from '../src/Errors';

describe('PATH utils', () => {
  describe('shift', () => {
    it('should shift', () => {
      expect(
        Utils.shift(
          {
            'foo[0].bar': 0,
            'foo[1].bar': 1,
            'foo[2].bar': 2,
            'foo[3].bar': 3,
          },
          'foo',
        ),
      ).toEqual({
        'foo[0].bar': 1,
        'foo[1].bar': 2,
        'foo[2].bar': 3,
      });
    });

    it('should shift at index', () => {
      expect(
        Utils.shift(
          {
            'foo[0].bar': 0,
            'foo[1].bar': 1,
            'foo[2].bar': 2,
            'foo[3].bar': 3,
          },
          'foo',
          2,
        ),
      ).toEqual({
        'foo[0].bar': 0,
        'foo[1].bar': 1,
        'foo[2].bar': 3,
      });
    });
  });

  describe('unshift', () => {
    it('should unshift', () => {
      expect(
        Utils.unshift(
          {
            'foo[0].bar': 0,
            'foo[1].bar': 1,
            'foo[2].bar': 2,
            'foo[3].bar': 3,
          },
          'foo',
        ),
      ).toEqual({
        'foo[1].bar': 0,
        'foo[2].bar': 1,
        'foo[3].bar': 2,
        'foo[4].bar': 3,
      });
    });

    it('should unshift at index', () => {
      expect(
        Utils.unshift(
          {
            'foo[0].bar': 0,
            'foo[1].bar': 1,
            'foo[2].bar': 2,
            'foo[3].bar': 3,
          },
          'foo',
          2,
        ),
      ).toEqual({
        'foo[0].bar': 0,
        'foo[1].bar': 1,
        'foo[3].bar': 2,
        'foo[4].bar': 3,
      });
    });
  });
});
