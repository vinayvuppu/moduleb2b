import React from 'react';
import { shallow } from 'enzyme';
import oneLine from 'common-tags/lib/oneLine';
import {
  AngleDownIcon,
  AngleUpIcon,
  FlatButton,
} from '@commercetools-frontend/ui-kit';
import { intlMock } from '../../../../test-utils';
import { AttributeInputSetBase } from './attribute-input-set-base';

const renderItem = jest.fn(({ index, onChangeValue, onBlurValue }) => (
  <input
    val={index}
    onChange={e => onChangeValue({ value: e.target.value })}
    onBlur={e => onBlurValue({ value: e.target.value })}
  />
));

const createTestProps = custom => ({
  attribute: {
    name: 'some-text-attribute',
    value: ['some', 'values', 'here'],
  },
  renderItem,
  onChangeValue: jest.fn(),
  checkIsEmpty: jest.fn(() => false),
  isExpanded: true,
  onToggleExpand: jest.fn(),
  intl: intlMock,
  ...custom,
});

describe('rendering', () => {
  let props;
  let wrapper;
  describe('with some initial values', () => {
    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(<AttributeInputSetBase {...props} />);
    });

    it('should render a ValidatedItemList', () => {
      expect(wrapper.find('ValidatedItemList')).toHaveLength(1);
    });

    it('should call renderItem', () => {
      // simulate ValidatedItemList calling the renderItem function
      wrapper.find('ValidatedItemList').prop('renderItem')({ index: 0 });
      expect(props.renderItem).toHaveBeenCalledTimes(1);
      expect(props.renderItem).toHaveBeenCalledWith({
        index: 0,
        value: 'some',
        isValid: true,
        onChangeValue: expect.any(Function),
        onBlurValue: expect.any(Function),
      });
    });
    describe('<FlatButton>', () => {
      describe('when attribute is expanded', () => {
        beforeEach(() => {
          props = createTestProps({
            isExpanded: true,
          });
          wrapper = shallow(<AttributeInputSetBase {...props} />);
          wrapper.setState({ currentAttributeValues: ['1', '2'] });
        });
        it('should render <AngleUpIcon> as icon', () => {
          expect(wrapper.find(FlatButton)).toHaveProp('icon', <AngleUpIcon />);
        });
        it('should pass collapse label', () => {
          expect(wrapper.find(FlatButton)).toHaveProp(
            'label',
            'AttributeInputSet.collapse'
          );
        });
        it('should pass onClick handler', () => {
          expect(wrapper.find(FlatButton)).toHaveProp(
            'onClick',
            wrapper.instance().handleToggleExpand
          );
        });
      });
      describe('when attribute is not expanded', () => {
        beforeEach(() => {
          props = createTestProps({
            isExpanded: false,
          });
          wrapper = shallow(<AttributeInputSetBase {...props} />);
          wrapper.setState({ currentAttributeValues: ['1', '2'] });
        });
        it('should render <AngleDownIcon> as icon', () => {
          expect(wrapper.find(FlatButton)).toHaveProp(
            'icon',
            <AngleDownIcon />
          );
        });
        it('should pass expand label', () => {
          expect(wrapper.find(FlatButton)).toHaveProp(
            'label',
            'AttributeInputSet.expand'
          );
        });
        it('should pass onClick handler', () => {
          expect(wrapper.find(FlatButton)).toHaveProp(
            'onClick',
            wrapper.instance().handleToggleExpand
          );
        });
      });
    });
  });

  describe('with no initial values', () => {
    it('should always render at least one, empty value', () => {
      props = createTestProps({
        attribute: {
          name: 'some-text-attribute',
          value: [],
        },
      });
      wrapper = shallow(<AttributeInputSetBase {...props} />);
      expect(wrapper.state('currentAttributeValues')).toHaveLength(1);
    });
  });

  describe('initially collapsed', () => {
    props = createTestProps({
      attribute: {
        name: 'some-text-attribute',
        value: [],
      },
      isExpanded: false,
    });
    wrapper = shallow(<AttributeInputSetBase {...props} />);

    it('should have one item per attribute', () => {
      expect(wrapper.find('ValidatedItemList').prop('itemCount')).toBe(1);
    });
  });
});

describe('lifecycle', () => {
  const props = createTestProps();
  const wrapper = shallow(<AttributeInputSetBase {...props} />);

  it(
    oneLine`
      should update the values in state when new values are passed in as props
    `,
    () => {
      const newProps = {
        ...props,
        attribute: {
          value: ['one', 'two', 'three'],
          name: props.attribute.name,
        },
      };
      wrapper.instance().UNSAFE_componentWillReceiveProps(newProps);
      expect(wrapper.state('currentAttributeValues')).toEqual([
        'one',
        'two',
        'three',
      ]);
    }
  );

  it(
    oneLine`
      should run validation of the new values against a the new validation
      function
    `,
    () => {
      const newProps = {
        ...props,
        attribute: {
          value: ['four', 'five', 'six'],
          name: props.attribute.name,
        },
        onValidate: () => ({
          isValid: false,
          message: 'cant validate this',
          invalidValues: ['five'],
        }),
      };
      wrapper.instance().UNSAFE_componentWillReceiveProps(newProps);
      expect(wrapper.state('validation')).toEqual({
        isValid: false,
        message: 'cant validate this',
        invalidIndexes: [1],
      });
    }
  );

  it(
    oneLine`
      should revert to the default validator if the current validator is removed
    `,
    () => {
      const newProps = {
        ...props,
        onValidate: null,
      };
      wrapper.instance().UNSAFE_componentWillReceiveProps(newProps);
      expect(wrapper.state('validation')).toEqual({
        isValid: true,
        message: '',
        invalidIndexes: [],
      });
    }
  );
});

describe('callbacks', () => {
  describe('adding a new item', () => {
    const props = createTestProps();
    const wrapper = shallow(<AttributeInputSetBase {...props} />);

    wrapper.find('ValidatedItemList').simulate('addItem');

    it('should prepend new, empty value to state when something is added', () => {
      expect(wrapper.state('currentAttributeValues')[0]).toBe(undefined);
    });

    it('should not call onChangeValue when empty value is added', () => {
      expect(props.onChangeValue).toHaveBeenCalledTimes(0);
    });

    wrapper.find('ValidatedItemList').simulate('addItem');

    it('should not prepend new, empty value to state if one already exists', () => {
      expect(wrapper.state('currentAttributeValues')).toEqual([
        undefined,
        'some',
        'values',
        'here',
      ]);
    });
  });

  describe('removing an item', () => {
    describe('basic case', () => {
      const props = createTestProps();
      const wrapper = shallow(<AttributeInputSetBase {...props} />);

      wrapper.find('ValidatedItemList').simulate('removeItem', { index: 1 });

      it('should remove item from state', () => {
        expect(wrapper.state('currentAttributeValues')).toEqual([
          'some',
          'here',
        ]);
      });

      it('should call onChangeValue when a non empty value is removed', () => {
        expect(props.onChangeValue).toHaveBeenCalledTimes(1);
        expect(props.onChangeValue).toHaveBeenCalledWith({
          name: props.attribute.name,
          value: wrapper.state('currentAttributeValues'),
        });
      });

      it('should not call onChangeValue when an empty value is removed', () => {
        wrapper.find('ValidatedItemList').simulate('addItem');
        wrapper.find('ValidatedItemList').simulate('removeItem', { index: 0 });
        expect(props.onChangeValue).toHaveBeenCalledTimes(1);
      });
    });

    describe('valid changes', () => {
      const props = createTestProps({
        onValidate: jest.fn(() => ({
          isValid: true,
          invalidValues: [],
          message: '',
        })),
      });
      const wrapper = shallow(<AttributeInputSetBase {...props} />);

      wrapper.find('ValidatedItemList').simulate('removeItem', { index: 1 });

      it('should remove item from state', () => {
        expect(wrapper.state('currentAttributeValues')).toEqual([
          'some',
          'here',
        ]);
      });

      it('should trigger validation', () => {
        expect(props.onValidate).toHaveBeenCalledTimes(1);
        expect(props.onValidate).toHaveBeenCalledWith(['some', 'here']);
      });

      it('should trigger onChangeValue for a valid change', () => {
        expect(props.onChangeValue).toHaveBeenCalledTimes(1);
        expect(props.onChangeValue).toHaveBeenCalledWith({
          name: props.attribute.name,
          value: ['some', 'here'],
        });
      });
    });

    describe('invalid changes', () => {
      const props = createTestProps({
        onValidate: jest.fn(() => ({
          isValid: false,
          invalidValues: [1],
          message: '',
        })),
      });
      const wrapper = shallow(<AttributeInputSetBase {...props} />);

      wrapper.find('ValidatedItemList').simulate('removeItem', { index: 1 });

      it('should remove item from state', () => {
        expect(wrapper.state('currentAttributeValues')).toEqual([
          'some',
          'here',
        ]);
      });

      it('should trigger validation', () => {
        expect(props.onValidate).toHaveBeenCalledTimes(1);
        expect(props.onValidate).toHaveBeenCalledWith(['some', 'here']);
      });

      it('should not trigger onChangeValue for an invalid change', () => {
        expect(props.onChangeValue).not.toHaveBeenCalled();
      });
    });
  });

  describe('changing an item', () => {
    describe('basic case', () => {
      const props = createTestProps({
        onValidate: jest.fn(() => ({
          isValid: true,
          message: '',
          invalidValues: [],
        })),
      });
      const wrapper = shallow(<AttributeInputSetBase {...props} />);

      wrapper.instance().handleChangeValue('different value', 0);

      it('should trigger validation when an items value changes', () => {
        expect(props.onValidate).toHaveBeenCalledTimes(1);
        expect(props.onValidate).toHaveBeenCalledWith([
          'different value',
          ...props.attribute.value.slice(1),
        ]);
      });

      it('should update the state with the changes', () => {
        expect(wrapper.state('currentAttributeValues')).toEqual([
          'different value',
          ...props.attribute.value.slice(1),
        ]);
      });

      it('should call onChangeValue with the change', () => {
        expect(props.onChangeValue).toHaveBeenCalledTimes(1);
        expect(props.onChangeValue).toHaveBeenCalledWith({
          name: props.attribute.name,
          value: ['different value', ...props.attribute.value.slice(1)],
        });
      });
    });

    describe('valid changes', () => {
      const props = createTestProps({
        onValidate: jest.fn(() => ({
          isValid: true,
          message: '',
          invalidValues: [],
        })),
      });
      const wrapper = shallow(<AttributeInputSetBase {...props} />);

      wrapper.instance().handleChangeValue('different value', 0);

      it(
        oneLine`
          should call onChangeValue if an items value changes and the set is
          valid
        `,
        () => {
          expect(props.onChangeValue).toHaveBeenCalledTimes(1);
          expect(props.onChangeValue).toHaveBeenCalledWith({
            name: props.attribute.name,
            value: ['different value', 'values', 'here'],
          });
        }
      );
    });

    describe('invalid changes', () => {
      const props = createTestProps({
        onValidate: jest.fn(() => ({
          isValid: false,
          message: 'not valid',
          invalidValues: ['different value'],
        })),
      });
      const wrapper = shallow(<AttributeInputSetBase {...props} />);

      wrapper.instance().handleChangeValue('different value', 0);

      it(
        oneLine`
          should not call onChangeValue if an items value changes and the set is
          invalid
        `,
        () => {
          expect(props.onChangeValue).not.toHaveBeenCalled();
        }
      );
    });
  });

  describe('blurring an input', () => {
    const props = createTestProps({
      onValidate: jest.fn(() => ({
        isValid: true,
        message: '',
        invalidValues: [],
      })),
    });
    const wrapper = shallow(<AttributeInputSetBase {...props} />);

    it('should trigger validation', () => {
      wrapper.instance().handleBlurValue();
      expect(props.onValidate).toHaveBeenCalledTimes(1);
      expect(props.onValidate).toHaveBeenCalledWith(props.attribute.value);
    });
  });
});
