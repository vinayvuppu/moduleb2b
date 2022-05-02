import React from 'react';
import { shallow } from 'enzyme';
import { IntlProvider } from 'react-intl';
import createStoreReferenceSingleFilter, {
  createMapToItemOption,
  renderItem,
  filterOption,
} from './store-reference-filter';

const InnerComponent = () => <div />;
InnerComponent.displayName = 'InnerComponent';

const mockWithDereferencedResource = jest.fn(
  (/* options */) => (/* Component */) => InnerComponent
);
jest.mock('../with-dereferenced-store', () => (...args) =>
  mockWithDereferencedResource(...args)
);

describe('named exports', () => {
  let mapItemToOption;
  describe('mapItemToOption', () => {
    beforeEach(() => {
      mapItemToOption = createMapToItemOption('en', ['en', 'fr', 'de']);
    });
    it('should map store fields for dropdown option', () => {
      expect(
        mapItemToOption({
          nameAllLocales: [
            {
              locale: 'en',
              value: 'Store 1',
            },
          ],
          key: 'foo',
        })
      ).toEqual({
        label: 'Store 1',
        value: 'foo',
        key: 'foo',
      });
    });
    describe('when store has no name', () => {
      it('should return key fallback', () => {
        expect(mapItemToOption({ key: 'foo' })).toEqual({
          value: 'foo',
          label: 'foo',
          key: 'foo',
        });
      });
    });
  });
  describe('renderItem', () => {
    let wrapper;
    beforeEach(() => {
      wrapper = shallow(renderItem({ name: 'Store 1', key: 'foo' }));
    });
    it('should render dropdown option', () => {
      expect(wrapper).toMatchSnapshot();
    });
    describe('when store has no name', () => {
      beforeEach(() => {
        wrapper = shallow(renderItem({ key: 'foo' }));
      });
      it('should return fallback', () => {
        expect(wrapper).toMatchSnapshot();
      });
    });
  });
  describe('filterOption', () => {
    it('should return true if filter value matches', () => {
      expect(
        filterOption({ data: { label: 'Store 1', key: 'foo' } }, 'tore')
      ).toBe(true);
    });
    describe('if key is not defined', () => {
      it('should only match by label', () => {
        expect(
          filterOption({ data: { label: 'Store 1', key: 'foo' } }, 'bar')
        ).toBe(false);
      });
    });
  });
});

describe('withDereferencedResource', () => {
  let WrappedComponent;
  let wrapper;
  beforeEach(() => {
    mockWithDereferencedResource.mockClear();
    WrappedComponent = createStoreReferenceSingleFilter({});
    wrapper = shallow(
      <IntlProvider locale="en" messages={{}}>
        <WrappedComponent />
      </IntlProvider>
    );
  });
  it('should call withDereferencedResource with correct arguments', () => {
    expect(mockWithDereferencedResource).toHaveBeenCalledWith({
      isMulti: false,
      dataFenceStores: null,
    });
  });
  it('should compose components', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
