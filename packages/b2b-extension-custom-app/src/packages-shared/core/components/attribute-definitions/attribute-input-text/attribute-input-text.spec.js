import React from 'react';
import { shallow } from 'enzyme';
import { Collapsible } from '@commercetools-frontend/ui-kit';
import { createMountOptions, intlMock } from '../../../../test-utils';
import ThrottledField from '../../fields/throttled-field';
import ExpandableField from '../../fields/expandable-field';
import {
  AttributeInputText,
  RequiredThrottledField,
} from './attribute-input-text';

const createTestProps = (customDefinition, custom) => ({
  selectedLanguage: 'en',
  languages: ['en', 'de'],
  definition: {
    type: {
      name: 'text',
    },
    label: { en: 'Foo' },
    inputHint: 'SingleLine',
    isRequired: false,
    ...customDefinition,
  },
  attribute: {
    name: 'foo',
    value: 'bar',
  },
  onChangeValue: jest.fn(),
  onBlurValue: jest.fn(),
  // Settings
  expandSettings: {},
  updateSettings: jest.fn(),
  isValid: true,
  intl: intlMock,
  ...custom,
});

describe('rendering normal text', () => {
  it('should render a basic, single line input', () => {
    const props = createTestProps({
      type: { name: 'text' },
      inputHint: 'SingleLine',
      isRequired: false,
    });
    const wrapper = shallow(<AttributeInputText {...props} />);

    expect(wrapper.find(ThrottledField)).toHaveLength(1);
  });

  it('should render a validated, single line input', () => {
    const props = createTestProps({
      type: { name: 'text' },
      inputHint: 'SingleLine',
      isRequired: true,
    });
    const wrapper = shallow(<AttributeInputText {...props} />);

    expect(wrapper.find(RequiredThrottledField)).toHaveLength(1);
  });

  it('should render a multiline input', () => {
    const props = createTestProps({
      type: { name: 'text' },
      inputHint: 'MultiLine',
      isRequired: false,
    });
    const wrapper = shallow(<AttributeInputText {...props} />);
    expect(wrapper).toRender(ExpandableField);
  });

  it('should render a multiline set input', () => {
    const props = createTestProps({
      type: { name: 'set', elementType: { name: 'text' } },
      inputHint: 'MultiLine',
      isRequired: false,
    });
    const wrapper = shallow(<AttributeInputText {...props} />);

    expect(wrapper.find(Collapsible)).toHaveLength(1);
    expect(wrapper.find(Collapsible).prop('isDefaultClosed')).toBe(true);
  });
});

describe('rendering localised text', () => {
  it('should render a basic, single line input', () => {
    const props = createTestProps(
      {
        type: { name: 'ltext' },
        inputHint: 'SingleLine',
        isRequired: false,
      },
      { attribute: { name: 'foo', value: {} } }
    );
    const wrapper = shallow(<AttributeInputText {...props} />);
    expect(wrapper).toRender({ name: 'foo' });
  });

  it('should render a multiline input', () => {
    const props = createTestProps(
      {
        type: { name: 'ltext' },
        inputHint: 'MultiLine',
        isRequired: false,
      },
      { attribute: { name: 'foo', value: {} } }
    );
    const wrapper = shallow(<AttributeInputText {...props} />);

    expect(wrapper.find({ as: 'textarea' })).toHaveLength(1);
    expect(typeof wrapper.find({ as: 'textarea' }).prop('onToggle')).toBe(
      'function'
    );
  });

  it('should render a multiline set input', () => {
    const props = createTestProps(
      {
        type: { name: 'set', elementType: { name: 'ltext' } },
        inputHint: 'MultiLine',
        isRequired: false,
      },
      { attribute: { name: 'foo', value: {} } }
    );
    const wrapper = shallow(<AttributeInputText {...props} />);

    expect(wrapper.find({ as: 'textarea' }).prop('onToggle')).toBe(undefined);
  });
});

describe('callbacks', () => {
  it('should trigger change callback', () => {
    const props = createTestProps();
    const wrapper = shallow(<AttributeInputText {...props} />);

    wrapper.find(ThrottledField).prop('onChange')({
      target: { value: 'changed' },
    });

    expect(props.onChangeValue).toHaveBeenCalledTimes(1);
    expect(props.onChangeValue).toHaveBeenCalledWith({
      name: props.attribute.name,
      value: 'changed',
    });

    wrapper.find(ThrottledField).prop('onChange')({ target: { value: '' } });

    expect(props.onChangeValue).toHaveBeenCalledTimes(2);
    expect(props.onChangeValue).toHaveBeenCalledWith({
      name: props.attribute.name,
      value: null,
    });
  });

  it('should trigger warning if set attribute is invalid', () => {
    const props = createTestProps(
      { type: { name: 'set', elementType: { name: 'ltext' } } },
      { isValid: false, attribute: { name: 'foo', value: {} } }
    );
    const wrapper = shallow(
      <AttributeInputText {...props} />,
      createMountOptions({
        intl: intlMock,
      })
    );

    expect(wrapper.find({ name: 'foo' }).prop('modalWarningMessage')).toBe(
      'AttributeInputText.setAttributeLocaleErrorModal'
    );
  });
});
