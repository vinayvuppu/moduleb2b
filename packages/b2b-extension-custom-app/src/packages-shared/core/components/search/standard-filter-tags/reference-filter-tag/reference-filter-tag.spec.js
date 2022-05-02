import React from 'react';
import { shallow } from 'enzyme';
import ReferenceSingleFilterTag, {
  ReferenceMultiFilterTag,
} from './reference-filter-tag';

const createTestProps = custom => ({
  fieldLabel: 'Reference',
  filterTypeLabel: 'Equals to',
  value: 'something',
  language: 'en',
  onRemove: jest.fn(),
  onClick: jest.fn(),
  readItemFromCache: jest.fn(),
  ...custom,
});

describe('rendering', () => {
  let props;
  let wrapper;
  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<ReferenceSingleFilterTag {...props} />);
  });
  it('should proxy fieldLabel prop', () => {
    expect(wrapper.prop('fieldLabel')).toBe(props.fieldLabel);
  });
  it('should proxy filterTypeLabel prop', () => {
    expect(wrapper.prop('filterTypeLabel')).toBe(props.filterTypeLabel);
  });
  it('should proxy value prop', () => {
    expect(wrapper.prop('value')).toBe(props.value);
  });
  it('should proxy onRemove prop', () => {
    expect(wrapper.prop('onRemove')).toBe(props.onRemove);
  });
  it('should proxy onClick prop', () => {
    expect(wrapper.prop('onClick')).toBe(props.onClick);
  });
  it('should not proxy readItemFromCache prop', () => {
    expect(wrapper.prop('readItemFromCache')).not.toBeDefined();
  });
});

describe('callbacks', () => {
  describe('when renderValue is called with an value', () => {
    describe('when the item with the value (ID) is found in the cache', () => {
      let props;
      let wrapper;
      beforeEach(() => {
        props = createTestProps({
          readItemFromCache: jest.fn(() => ({ id: '123', name: 'Foo' })),
        });
        wrapper = shallow(<ReferenceSingleFilterTag {...props} />);
      });
      it('return the item name', () => {
        expect(wrapper.prop('renderValue')('123')).toBe('Foo');
      });
    });
    describe('when the item with the value (ID) is not found in the cache', () => {
      let props;
      let wrapper;
      beforeEach(() => {
        props = createTestProps({
          readItemFromCache: jest.fn(() => null),
        });
        wrapper = shallow(<ReferenceSingleFilterTag {...props} />);
      });
      it('return an empty string', () => {
        expect(wrapper.prop('renderValue')('123')).toBe('');
      });
    });
  });
});

describe('ReferenceMultiFilterTag', () => {
  let props;
  let wrapper;
  beforeEach(() => {
    props = createTestProps({ value: ['test1', 'test2'] });
    wrapper = shallow(<ReferenceMultiFilterTag {...props} />);
  });

  describe('rendering', () => {
    it('should proxy fieldLabel prop', () => {
      expect(wrapper.prop('fieldLabel')).toBe(props.fieldLabel);
    });
    it('should proxy filterTypeLabel prop', () => {
      expect(wrapper.prop('filterTypeLabel')).toBe(props.filterTypeLabel);
    });
    it('should proxy value prop', () => {
      expect(wrapper.prop('value')).toBe(props.value);
    });
    it('should proxy onRemove prop', () => {
      expect(wrapper.prop('onRemove')).toBe(props.onRemove);
    });
    it('should proxy onClick prop', () => {
      expect(wrapper.prop('onClick')).toBe(props.onClick);
    });
    it('should not proxy readItemFromCache prop', () => {
      expect(wrapper.prop('readItemFromCache')).not.toBeDefined();
    });
  });

  describe('callbacks', () => {
    describe('when renderValue is called with an array of values', () => {
      describe('when the items with the values (ID) are found in the cache', () => {
        beforeEach(() => {
          props = createTestProps({
            value: ['test1', 'test2'],
            readItemFromCache: jest.fn(value =>
              value === 'test1'
                ? { id: 'test1', name: 'Foo' }
                : { id: 'test2', name: 'Bar' }
            ),
          });
          wrapper = shallow(<ReferenceMultiFilterTag {...props} />);
        });
        it('return the item name', () => {
          expect(wrapper.prop('renderValue')(['test1', 'test2'])).toBe(
            'Foo, Bar'
          );
        });
      });
      describe('when the item with the value (ID) is not found in the cache', () => {
        beforeEach(() => {
          props = createTestProps({
            value: ['test1', 'test2'],
            readItemFromCache: jest.fn(() => {
              throw new Error('Not found');
            }),
          });
          wrapper = shallow(<ReferenceMultiFilterTag {...props} />);
        });
        it('return an empty string', () => {
          expect(wrapper.prop('renderValue')(['test1', 'test2'])).toBe('');
        });
      });
    });
  });
});
