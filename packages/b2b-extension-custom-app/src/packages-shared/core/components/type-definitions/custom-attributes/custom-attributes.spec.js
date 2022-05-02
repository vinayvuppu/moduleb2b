import React from 'react';
import { shallow } from 'enzyme';
import AttributeInput from '../../attribute-definitions/attribute-input';
import CustomAttributes from './custom-attributes';

const createTestProps = props => ({
  currencies: ['EUR', 'USD'],
  languages: ['en', 'de'],
  language: 'en',
  expandSettings: {},
  fieldDefinitions: [
    {
      name: 'test',
      type: {
        name: 'String',
      },
    },
    {
      name: 'boolean',
      type: {
        name: 'Boolean',
      },
    },
    {
      name: 'set-dates',
      type: {
        name: 'set',
        elementType: {
          name: 'date',
        },
      },
    },
  ],
  fields: {
    test: 'value',
    boolean: false,
    'set-dates': ['2017-01-27T09:40:38.179Z', '2017-05-27T09:40:38.179Z'],
  },
  updateSettings: jest.fn(),
  handleChange: jest.fn(),
  isDisabled: false,
  ...props,
});
describe('rendering', () => {
  let props;
  let wrapper;
  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<CustomAttributes {...props} />);
  });
  it('should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  describe('when disabled', () => {
    beforeEach(() => {
      props = createTestProps({
        isDisabled: true,
      });
      wrapper = shallow(<CustomAttributes {...props} />);
    });
    it('should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });
    it('should propagate `isDisabled` as `disabled`', () => {
      expect(wrapper.find(AttributeInput).at(0)).toHaveProp(
        'disabled',
        props.isDisabled
      );
    });
  });
});

describe('callbacks', () => {
  describe('when changing the attribute value', () => {
    let props;
    let wrapper;
    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(<CustomAttributes {...props} />);
      wrapper
        .find(AttributeInput)
        .at(0)
        .prop('onChangeValue')({ value: 'new value' });
    });
    it('should call the handleChange function', () => {
      expect(props.handleChange).toHaveBeenCalledTimes(1);
    });
    it('should call the handleChange function with the new value to change', () => {
      expect(props.handleChange).toHaveBeenCalledWith('test', 'new value');
    });
  });
});
