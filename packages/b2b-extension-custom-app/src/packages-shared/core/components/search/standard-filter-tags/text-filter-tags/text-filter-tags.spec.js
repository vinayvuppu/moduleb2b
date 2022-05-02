import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { intlMock } from '../../../../../test-utils';
import { TextSingleFilterTag } from './text-filter-tags';

const createTestProps = custom => ({
  fieldLabel: 'Text',
  filterTypeLabel: 'Equals to',
  value: 'foo-bar',
  onRemove: jest.fn(),
  onClick: jest.fn(),

  intl: intlMock,

  ...custom,
});

describe('TextSingleFilterTag', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<TextSingleFilterTag {...props} />);
  });

  it('render correct tree', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});

describe('callbacks', () => {
  describe('of `<SingleFilterTag />`', () => {
    let props;
    let wrapper;
    let singleFilterTagWrapper;

    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(<TextSingleFilterTag {...props} />);

      singleFilterTagWrapper = wrapper.find('SingleFilterTag');
    });

    describe('`renderValue`', () => {
      it('should return the value unchanged', () => {
        const valueToRender = 'foo-value-to-render';
        expect(
          singleFilterTagWrapper.prop('renderValue')(valueToRender)
        ).toEqual(valueToRender);
      });
    });

    describe('`onRemove`', () => {
      beforeEach(() => {
        singleFilterTagWrapper.prop('onRemove')();
      });

      it('should invoke `onRemove` on the `TextSingleFilterTag`', () => {
        expect(props.onRemove).toHaveBeenCalled();
      });
    });

    describe('`onClick`', () => {
      beforeEach(() => {
        singleFilterTagWrapper.prop('onClick')();
      });

      it('should invoke `onClick` on the `TextSingleFilterTag`', () => {
        expect(props.onClick).toHaveBeenCalled();
      });
    });
  });
});
