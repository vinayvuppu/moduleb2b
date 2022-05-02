import validate from './validations';

const createValues = custom => ({
  name: {
    de: 'test-name-de',
  },
  ...custom,
});

describe('with name', () => {
  let values;
  beforeEach(() => {
    values = createValues();
  });

  it('should return no validation errors', () => {
    expect(validate(values)).toEqual({});
  });
});

describe('without name', () => {
  let values;
  beforeEach(() => {
    values = createValues({
      name: null,
    });
  });

  it('should required error for name', () => {
    expect(validate(values)).toEqual({
      name: {
        required: true,
      },
    });
  });
});

describe('with empty name', () => {
  let values;
  beforeEach(() => {
    values = createValues({
      name: '',
    });
  });

  it('should required error for name', () => {
    expect(validate(values)).toEqual({
      name: {
        required: true,
      },
    });
  });
});
