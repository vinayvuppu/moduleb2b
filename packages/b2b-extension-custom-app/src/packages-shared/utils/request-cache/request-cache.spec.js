import RequestCache, { NoOptionsRequestCache } from './request-cache';

jest.useFakeTimers();

describe('RequestCache', () => {
  let cache;
  const key = { foo: true };
  const value = { bar: true };
  beforeEach(() => {
    cache = new RequestCache();
  });

  describe('storing and retrieving values', () => {
    describe('when there is an entry', () => {
      beforeEach(() => {
        cache.set(key, value);
      });
      describe('when calling `get` with the key of the entry', () => {
        describe('when calling `get` within the expiry duration', () => {
          it('should return the value', () => {
            expect(cache.get(key)).toBe(value);
          });
        });
        describe('when calling `get` after the expiry duration', () => {
          beforeEach(() => {
            // cache is never valid
            cache.setExpiryDurationInSeconds(-1);
          });
          it('should return `null`', () => {
            expect(cache.get(key)).toBe(null);
          });
        });
      });
      describe('when calling `get` with another key', () => {
        let result;
        beforeEach(() => {
          result = cache.get({ baz: true });
        });
        it('should return `null`', () => {
          expect(result).toBe(null);
        });
        describe('when then calling `get` with the original key', () => {
          it('should have removed the cached value', () => {
            expect(cache.get(key)).toBe(null);
          });
        });
      });
    });
    describe('when there is no entry', () => {
      it('should return `null`', () => {
        expect(cache.get()).toBe(null);
      });
    });

    describe('when storing multiple values of same key sequentially', () => {
      describe('when calling `get`', () => {
        beforeEach(() => {
          cache.set(key, { something: true });
          cache.set(key, { somethingElse: true });
          cache.set(key, value);
        });
        it('should return the latest value', () => {
          expect(cache.get(key)).toBe(value);
        });
      });
    });
  });
});

describe('NoOptionsRequestCache', () => {
  let cache;
  const value = { bar: true };
  beforeEach(() => {
    cache = new NoOptionsRequestCache();
  });

  describe('storing and retrieving values', () => {
    describe('when there is an entry', () => {
      beforeEach(() => {
        cache.set(value);
      });
      describe('when calling `get`', () => {
        describe('when calling `get` within the expiry duration', () => {
          it('should return the value', () => {
            expect(cache.get()).toBe(value);
          });
        });
        describe('when calling `get` after the expiry duration', () => {
          beforeEach(() => {
            // cache is never valid
            cache.setExpiryDurationInSeconds(-1);
          });
          it('should return `null`', () => {
            expect(cache.get()).toBe(null);
          });
        });
      });
    });
    describe('when there is no entry', () => {
      it('should return `null`', () => {
        expect(cache.get()).toBe(null);
      });
    });

    describe('when storing multiple values sequentially', () => {
      describe('when calling `get`', () => {
        beforeEach(() => {
          cache.set({ something: true });
          cache.set({ somethingElse: true });
          cache.set(value);
        });
        it('should return the latest value', () => {
          expect(cache.get()).toBe(value);
        });
      });
    });
  });
});
