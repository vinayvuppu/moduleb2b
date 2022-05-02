import shouldUpdateAttributeInput from './should-update-attribute-input';

const createTestProps = custom => ({
  selectedLanguage: 'en',
  definition: {
    type: {
      name: 'text',
    },
  },
  attribute: {
    name: 'something',
    value: 'some value here',
  },
  ...custom,
});
const createTestState = custom => ({
  isOk: true,
  objects: [{ id: 'something1' }, { id: 'something2' }],
  ...custom,
});
const createFunctionArgs = custom => ({
  currentProps: createTestProps(),
  currentState: createTestState(),
  nextProps: createTestProps(),
  nextState: createTestState(),
  ...custom,
});

describe('shouldUpdateAttributeInput function', () => {
  it('should return false if nothing changes', () => {
    expect(shouldUpdateAttributeInput(createFunctionArgs())).toBe(false);
  });

  it('should return true when state has changed', () => {
    const args = createFunctionArgs({
      nextState: createTestState({ somethingNew: true }),
    });
    expect(shouldUpdateAttributeInput(args)).toBe(true);
  });

  it('should return true when language changes', () => {
    const args = createFunctionArgs({
      nextProps: createTestProps({ selectedLanguage: 'de' }),
    });
    expect(shouldUpdateAttributeInput(args)).toBe(true);
  });

  it('should return true when attribute value changes', () => {
    const args = createFunctionArgs({
      nextProps: createTestProps({
        attribute: {
          name: 'something',
          value: 'a new value',
        },
      }),
    });
    expect(shouldUpdateAttributeInput(args)).toBe(true);
  });

  it('should return true when attribute name changes', () => {
    const args = createFunctionArgs({
      nextProps: createTestProps({
        attribute: {
          name: 'something different',
          value: 'some value here',
        },
      }),
    });
    expect(shouldUpdateAttributeInput(args)).toBe(true);
  });

  it('should return true when attribute type changes', () => {
    const args = createFunctionArgs({
      nextProps: createTestProps({
        definition: {
          type: {
            name: 'set',
          },
        },
      }),
    });
    expect(shouldUpdateAttributeInput(args)).toBe(true);
  });
});
