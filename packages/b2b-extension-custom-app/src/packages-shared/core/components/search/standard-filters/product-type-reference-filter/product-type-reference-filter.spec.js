import React from 'react';
import { shallow } from 'enzyme';
import { IntlProvider } from 'react-intl';
import createProductTypeReferenceSingleFilter, {
  mapItemToOption,
  renderItem,
  filterOption,
} from './product-type-reference-filter';

const InnerComponent = () => <div />;
InnerComponent.displayName = 'InnerComponent';

const mockWithDereferencedResource = jest.fn(
  (/* options */) => (/* Component */) => InnerComponent
);
jest.mock('../with-dereferenced-product-type', () => (...args) =>
  mockWithDereferencedResource(...args)
);

describe('named exports', () => {
  describe('mapItemToOption', () => {
    it('should map product type fields for dropdown option', () => {
      expect(
        mapItemToOption({ id: '1', name: 'ProductType', key: 'foo' })
      ).toEqual({
        value: '1',
        label: 'ProductType',
        key: 'foo',
      });
    });
    describe('when product type has no name', () => {
      it('should return `key`', () => {
        expect(mapItemToOption({ id: '1', key: 'foo' })).toEqual({
          value: '1',
          label: 'foo',
          key: 'foo',
        });
      });
    });
  });
  describe('renderItem', () => {
    let wrapper;
    beforeEach(() => {
      wrapper = shallow(renderItem({ name: 'ProductType', key: 'foo' }));
    });
    it('should render dropdown option', () => {
      expect(wrapper).toMatchSnapshot();
    });
    describe('when product type has no name', () => {
      beforeEach(() => {
        wrapper = shallow(renderItem({ key: 'foo' }));
      });
      it('should return `key`', () => {
        expect(wrapper.text()).toMatch('foo');
      });
    });
  });
  describe('filterOption', () => {
    it('should return true if filter value matches', () => {
      expect(
        filterOption({ data: { label: 'ProductType', key: 'foo' } }, 'prod')
      ).toBe(true);
    });
  });
});

describe('withDereferencedResource', () => {
  let WrappedComponent;
  let wrapper;
  describe('without `isMulti`', () => {
    beforeEach(() => {
      mockWithDereferencedResource.mockClear();
      WrappedComponent = createProductTypeReferenceSingleFilter({});
      wrapper = shallow(
        <IntlProvider locale="en" messages={{}}>
          <WrappedComponent />
        </IntlProvider>
      );
    });
    it('should call withDereferencedResource with `isMulti` being `false`', () => {
      expect(mockWithDereferencedResource).toHaveBeenCalledWith(
        expect.objectContaining({
          isMulti: false,
        })
      );
    });
    // renderItem: expect.any(Function),
    // mapItemToOption: expect.any(Function),
    // placeholderLabel: 'Placeholder',
    it('should compose components', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('with `isMulti`', () => {
    beforeEach(() => {
      mockWithDereferencedResource.mockClear();
      WrappedComponent = createProductTypeReferenceSingleFilter({
        isMulti: true,
      });
      wrapper = shallow(
        <IntlProvider locale="en" messages={{}}>
          <WrappedComponent />
        </IntlProvider>
      );
    });
    it('should call withDereferencedResource with `isMulti` being `true`', () => {
      expect(mockWithDereferencedResource).toHaveBeenCalledWith(
        expect.objectContaining({
          isMulti: true,
        })
      );
    });
    // renderItem: expect.any(Function),
    // mapItemToOption: expect.any(Function),
    // placeholderLabel: 'Placeholder',
    it('should compose components', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
