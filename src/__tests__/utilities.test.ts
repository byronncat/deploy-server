import {
  logger,
  escapeRegExp,
  generateRandomString,
  isEmptyObject,
} from '@utilities';

describe('logger', () => {
  it('should log a message', () => {
    expect(logger.success('Hello, World!', 'Test')).toBeUndefined();
    expect(logger.info('Hello, World!', 'Test')).toBeUndefined();
    expect(logger.warn('Hello, World!', 'Test')).toBeUndefined();
    expect(logger.error('Hello, World!', 'Test')).toBeUndefined();
    expect(logger.debug('Hello, World!', 'Test')).toBeUndefined();
  });
});

describe('escapeRegExp', () => {
  it('should escape special characters', () => {
    expect(escapeRegExp(String.raw`Hello "World"`)).toBe(
      String.raw`Hello \"World\"`,
    );
  });
});

describe('generateRandomString', () => {
  it('should generate a random string, defaulting to hex', () => {
    expect(generateRandomString(16)).toMatch(/^[a-f0-9]{32}$/);
  });

  it('should generate a random base64 string', () => {
    expect(generateRandomString(16, 'base64')).toMatch(
      /^[a-zA-Z0-9+/]{22}={2}$/,
    );
  });
});

describe('isEmptyObject', () => {
  it('should return true if the object is empty', () => {
    expect(isEmptyObject({})).toBe(true);
  });

  it('should return false if the object is not empty', () => {
    expect(isEmptyObject({ key: 'value' })).toBe(false);
  });
});
