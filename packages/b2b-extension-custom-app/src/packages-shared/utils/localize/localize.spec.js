import localize from './localize';

const createTestProps = custom => ({
  key: 'localizedStringKey',
  language: 'de-AT',
  ...custom,
});

describe('when entity was not provided', () => {
  let props;

  beforeEach(() => {
    props = createTestProps();
  });

  it('should return empty string', () => {
    expect(localize(props)).toBe('');
  });
});

describe('when entity does not have requested localized string', () => {
  let props;

  beforeEach(() => {
    props = createTestProps({ obj: {} });
  });

  it('should return empty string', () => {
    expect(localize(props)).toBe('');
  });
});

describe('when localized string does not have any translations', () => {
  let props;

  beforeEach(() => {
    props = createTestProps({
      obj: {
        localizedStringKey: {
          en: '',
        },
      },
    });
  });

  it('should return default fallback value', () => {
    expect(localize(props)).toBe('');
  });

  it('should return custom fallback value', () => {
    expect(localize({ ...props, fallback: 'custom fallback' })).toBe(
      'custom fallback'
    );
  });
});

describe('when localized string has prefered language', () => {
  let props;

  beforeEach(() => {
    props = createTestProps({
      obj: {
        localizedStringKey: {
          'de-AT': 'a translation',
        },
      },
    });
  });

  it('should return translation', () => {
    expect(localize(props)).toBe('a translation');
  });
});

describe('when localized sring has primary language matching prefered (extended) langauge', () => {
  let props;

  beforeEach(() => {
    props = createTestProps({
      obj: {
        localizedStringKey: {
          de: 'a primary translation',
        },
      },
    });
  });

  it('should return translation', () => {
    expect(localize(props)).toBe('a primary translation');
  });
});

describe('when prefered language was not provided', () => {
  let props;

  beforeEach(() => {
    props = createTestProps({
      obj: {
        localizedStringKey: {
          ru: '',
          fr: 'fr translation',
          en: 'en translation',
          it: 'it translation',
        },
      },
      language: undefined,
      fallbackOrder: ['it', 'fr'],
    });
  });

  it('should fallback to the first language accoring to fallback order', () => {
    expect(localize(props)).toBe('it translation (IT)');
  });
});

describe('when localized string does not have languages realted to prefered language', () => {
  let props;

  beforeEach(() => {
    props = createTestProps({
      obj: {
        localizedStringKey: {
          ru: '',
          fr: 'fr translation',
          en: 'en translation',
          it: 'it translation',
        },
      },
    });
  });

  it('should fallback to the first non-empty language', () => {
    expect(localize(props)).toBe('fr translation (FR)');
  });
});

describe('when localized string has language from provided desired fallback languages order', () => {
  let props;

  beforeEach(() => {
    props = createTestProps({
      obj: {
        localizedStringKey: {
          ru: '',
          fr: 'fr translation',
          en: 'en translation',
          it: 'it translation',
        },
      },
      fallbackOrder: ['ru', 'it'],
    });
  });

  it('should return first non-empty translation', () => {
    expect(localize(props)).toBe('it translation (IT)');
  });
});

describe('when localized string is missing languages from provided desired fallback languages order', () => {
  let props;

  beforeEach(() => {
    props = createTestProps({
      obj: {
        localizedStringKey: {
          ru: '',
          fr: 'fr translation',
          en: 'en translation',
          it: 'it translation',
        },
      },
      fallbackOrder: ['ru', 'pl'],
    });
  });

  it('should fallback to first present language', () => {
    expect(localize(props)).toBe('fr translation (FR)');
  });
});
