import React from 'react';
import { shallow } from 'enzyme';
import { IntlProvider } from 'react-intl';
import { NO_VALUE_FALLBACK } from '@commercetools-frontend/constants';
import createCustomerGroupReferenceSingleFilter, {
  mapItemToOption,
  renderItem,
  filterOption,
} from './customer-group-reference-filter';

const InnerComponent = () => <div />;
InnerComponent.displayName = 'InnerComponent';

const mockWithDereferencedResource = jest.fn(
  (/* options */) => (/* Component */) => InnerComponent
);
jest.mock('../with-dereferenced-customer-group', () => (...args) =>
  mockWithDereferencedResource(...args)
);

describe('named exports', () => {
  describe('mapItemToOption', () => {
    it('should map customer group fields for dropdown option', () => {
      expect(
        mapItemToOption({ id: '1', name: 'Customer Group', key: 'foo' })
      ).toEqual({
        value: '1',
        label: 'Customer Group',
        key: 'foo',
      });
    });
    describe('when customer group has no name', () => {
      it('should return fallback', () => {
        expect(mapItemToOption({ id: '1', key: 'foo' })).toEqual({
          value: '1',
          label: NO_VALUE_FALLBACK,
          key: 'foo',
        });
      });
    });
    describe('when customer group has no key', () => {
      it('should return fallback', () => {
        expect(mapItemToOption({ id: '1' })).toEqual({
          value: '1',
          label: NO_VALUE_FALLBACK,
          key: undefined,
        });
      });
    });
  });
  describe('renderItem', () => {
    let wrapper;
    beforeEach(() => {
      wrapper = shallow(renderItem({ name: 'Customer Group', key: 'foo' }));
    });
    it('should render dropdown option', () => {
      expect(wrapper).toMatchSnapshot();
    });
    describe('when customer-group has no name', () => {
      beforeEach(() => {
        wrapper = shallow(renderItem({ key: 'foo' }));
      });
      it('should return fallback', () => {
        expect(wrapper.text()).toMatch(NO_VALUE_FALLBACK);
      });
    });
  });
  describe('filterOption', () => {
    it('should return true if filter value matches', () => {
      expect(
        filterOption({ label: 'Customer Group', key: 'foo' }, 'stom')
      ).toBe(true);
    });
    describe('if key is not defined', () => {
      it('should only match by label', () => {
        expect(filterOption({ label: 'Customer Group' }, 'foo')).toBe(false);
      });
    });
  });
});

describe('withDereferencedResource', () => {
  let WrappedComponent;
  let wrapper;
  beforeEach(() => {
    mockWithDereferencedResource.mockClear();
    WrappedComponent = createCustomerGroupReferenceSingleFilter({});
    wrapper = shallow(
      <IntlProvider locale="en" messages={{}}>
        <WrappedComponent />
      </IntlProvider>
    );
  });
  it('should call withDereferencedResource with correct arguments', () => {
    expect(mockWithDereferencedResource).toHaveBeenCalledWith({
      isMulti: false,
    });
  });
  it('should compose components', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
