const { processData } = require('../src/utils');

describe('processData', () => {
  test('returns true', () => {
    expect(processData('example-message')).toBe(true);
  });
});
