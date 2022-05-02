import React from 'react';
import { shallow } from 'enzyme';
import oneLine from 'common-tags/lib/oneLine';
import { intlMock } from '../../../../test-utils';
import AttributeInputBoolean from './attribute-input-boolean';
import BooleanField from '../../fields/boolean-field';

const createTestProps = (props = {}, { isRequired = null } = {}) => ({
  selectedLanguage: 'en',
  languages: ['en', 'de'],
  definition: {
    label: {
      en: 'Foo (en)',
      de: 'Foo (de)',
    },
    type: { name: 'boolean' },
    inputHint: 'input hint',
    isRequired: Boolean(isRequired),
  },
  attribute: {
    name: 'foo',
    value: false,
  },
  onChangeValue: jest.fn(),
  // Settings
  expandSettings: {},
  updateSettings: jest.fn(),
  intl: intlMock,
  ...props,
});

describe('rendering', () => {
  it('should render one BooleanField', () => {
    const props = createTestProps();
    const wrapper = shallow(<AttributeInputBoolean {...props} />);

    expect(wrapper.find(BooleanField)).toHaveLength(1);
  });

  it(
    oneLine`should set the isRequired prop to true on the BooleanField if the
    attribute is required`,
    () => {
      const props = createTestProps({}, { isRequired: true });
      const wrapper = shallow(<AttributeInputBoolean {...props} />);

      expect(wrapper.find(BooleanField).prop('isRequired')).toBe(true);
    }
  );
});

describe('callbacks', () => {
  const props = createTestProps();
  const wrapper = shallow(<AttributeInputBoolean {...props} />);
  wrapper.debug();
  it('should call onChangeValue when value changes', () => {
    wrapper.find(BooleanField).prop('onChange')(true);
    expect(props.onChangeValue).toHaveBeenCalledWith({
      name: props.attribute.name,
      value: true,
    });
  });
});
