import {
  VERSION_KEY,
  augmentWithVersion,
  omitVersion,
  matchesVersion,
  hasQuery,
  encodeToUrl,
} from './utils';

describe('`hasQuery`', () => {
  describe('with `query.query` has more than one character', () => {
    it('should return `true`', () => {
      expect(hasQuery({ query: { query: 'foo' } })).toBe(true);
    });
  });

  describe('with `query.query` has no characters', () => {
    it('should return `false`', () => {
      expect(hasQuery({ query: { query: '' } })).toBe(false);
    });
  });

  describe('without `query.query`', () => {
    it('should return `false`', () => {
      expect(hasQuery({ query: {} })).toBe(false);
    });
  });
});

describe('`encodeToUrl`', () => {
  const searchOptions = { foo: 'bar' };
  const previousSearch = 'foo-previous-search=far-search';
  let encodedUrl;

  beforeEach(() => {
    encodedUrl = encodeToUrl(searchOptions, previousSearch);
  });

  it('should match snapshot', () => {
    expect(encodedUrl).toMatchSnapshot();
  });

  it('should contain previous `search`', () => {
    expect(encodedUrl).toEqual(expect.stringContaining(previousSearch));
  });

  it('should contain a `query`', () => {
    expect(encodedUrl).toEqual(expect.stringContaining('query'));
  });
});

describe('augmentWithVersion', () => {
  it('should augment the version onto the passed search query', () => {
    const version = 2;
    expect(augmentWithVersion({ a: 'b' }, version)).toEqual(
      expect.objectContaining({ [VERSION_KEY]: version })
    );
  });
});

describe('omitVersion', () => {
  it('should remove the version onto the passed search query', () => {
    const version = 2;
    expect(omitVersion(augmentWithVersion({ a: 'b' }, version))).toEqual(
      expect.not.objectContaining({ [VERSION_KEY]: version })
    );
  });
});

describe('matchesVersion', () => {
  const version = 2;
  describe('with version on search query', () => {
    describe('when version is equal', () => {
      it('should match (return true)', () => {
        expect(
          matchesVersion({ a: 'b', [VERSION_KEY]: version }, version)
        ).toBe(true);
      });
    });
    describe('when version is not equal', () => {
      it('should not match (return false)', () => {
        expect(matchesVersion({ a: 'b', [VERSION_KEY]: version }, 3)).toBe(
          false
        );
      });
    });
  });
  describe('without version on search query', () => {
    it('should not match (return false)', () => {
      expect(matchesVersion({ a: 'b' }, version)).toBe(false);
    });
  });
});
