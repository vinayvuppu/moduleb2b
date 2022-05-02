import React from 'react';
import { shallow } from 'enzyme';
import { intlMock } from '../../../../../test-utils';
import createFormattedReferenceFilter from './formatted-reference-filter';

const createTestProps = custom => ({
  value: '1',
  readItemFromCache: jest.fn(),
  intl: intlMock,
  // For ReferenceFilter
  onUpdateFilter: jest.fn(),
  ...custom,
});

describe('rendering', () => {
  describe('single', () => {
    const FormattedReferenceFilter = createFormattedReferenceFilter({
      isMulti: false,
    });
    let props;
    let wrapper;
    beforeEach(() => {
      props = createTestProps({ foo: 'bar', onUpdateFilter: jest.fn() });
      wrapper = shallow(<FormattedReferenceFilter {...props} />);
    });
    it('should forward extra props', () => {
      expect(wrapper.prop('foo')).toBe('bar');
    });
    it('should pass mapValueToItem', () => {
      expect(wrapper.prop('mapValueToItem')).toBe(
        wrapper.instance().mapValueToItem
      );
    });

    describe('when value is defined', () => {
      describe('if item can be read from the cached', () => {
        beforeEach(() => {
          props = createTestProps({
            value: '123',
            readItemFromCache: jest.fn(() => ({ id: 'from-cache' })),
          });
          wrapper = shallow(<FormattedReferenceFilter {...props} />);
        });
        it('should pass the cached item as value', () => {
          expect(wrapper.prop('value')).toEqual({ id: 'from-cache' });
        });
      });
      describe('if the item cannot be read from the cached', () => {
        beforeEach(() => {
          props = createTestProps({
            value: '123',
            readItemFromCache: jest.fn(() => null),
          });
          wrapper = shallow(<FormattedReferenceFilter {...props} />);
        });
        it('should pass an object as value with only the id', () => {
          expect(wrapper.prop('value')).toEqual({ id: '123' });
        });
      });
    });
    describe('when value is not defined', () => {
      beforeEach(() => {
        props = createTestProps({
          value: null,
        });
        wrapper = shallow(<FormattedReferenceFilter {...props} />);
      });
      it('should pass null as value', () => {
        expect(wrapper.prop('value')).toBe(null);
      });
    });
  });
  describe('multi', () => {
    const FormattedReferenceFilter = createFormattedReferenceFilter({
      isMulti: true,
    });
    let props;
    let wrapper;
    beforeEach(() => {
      props = createTestProps({
        value: ['1'],
        foo: 'bar',
      });
      wrapper = shallow(<FormattedReferenceFilter {...props} />);
    });
    it('should forward extra props', () => {
      expect(wrapper.prop('foo')).toBe('bar');
    });
    it('should pass mapValueToItem', () => {
      expect(wrapper.prop('mapValueToItem')).toBe(
        wrapper.instance().mapValueToItem
      );
    });
    describe('when value is defined', () => {
      describe('if the item can be read from the cached', () => {
        beforeEach(() => {
          props = createTestProps({
            value: ['123'],
            readItemFromCache: jest.fn(() => ({ id: 'from-cache' })),
          });
          wrapper = shallow(<FormattedReferenceFilter {...props} />);
        });
        it('should pass a list of items loaded from the cache', () => {
          expect(wrapper.prop('value')).toEqual([{ id: 'from-cache' }]);
        });
      });
      describe('if the item cannot be read from the cached', () => {
        beforeEach(() => {
          props = createTestProps({
            value: ['123'],
            readItemFromCache: jest.fn(() => null),
          });
          wrapper = shallow(<FormattedReferenceFilter {...props} />);
        });
        it('should pass a list of objects with only the id', () => {
          expect(wrapper.prop('value')).toEqual([{ id: '123' }]);
        });
      });
    });
    describe('when value is not defined', () => {
      beforeEach(() => {
        props = createTestProps({
          value: null,
        });
        wrapper = shallow(<FormattedReferenceFilter {...props} />);
      });
      it('should pass empty list as value', () => {
        expect(wrapper.prop('value')).toEqual([]);
      });
    });
  });
});
