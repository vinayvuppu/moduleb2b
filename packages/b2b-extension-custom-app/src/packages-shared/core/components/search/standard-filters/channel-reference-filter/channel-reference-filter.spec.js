import React from 'react';
import { shallow } from 'enzyme';
import { IntlProvider } from 'react-intl';
import createChannelReferenceSingleFilter, {
  mapItemToOption,
  renderItem,
  filterOption,
} from './channel-reference-filter';

const InnerComponent = () => <div />;
InnerComponent.displayName = 'InnerComponent';

const mockWithDereferencedResource = jest.fn(
  (/* options */) => (/* Component */) => InnerComponent
);
jest.mock('../with-dereferenced-channel', () => (...args) =>
  mockWithDereferencedResource(...args)
);

describe('named exports', () => {
  describe('mapItemToOption', () => {
    it('should map channel fields for dropdown option', () => {
      expect(mapItemToOption({ id: '1', name: 'Channel', key: 'foo' })).toEqual(
        {
          value: '1',
          label: 'Channel',
          key: 'foo',
        }
      );
    });
    describe('when channel has no name', () => {
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
      wrapper = shallow(renderItem({ name: 'Channel', key: 'foo' }));
    });
    it('should render dropdown option', () => {
      expect(wrapper).toMatchSnapshot();
    });
    describe('when channel has no name', () => {
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
        filterOption({ data: { label: 'Channel', key: 'foo' } }, 'chan')
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
      WrappedComponent = createChannelReferenceSingleFilter({});
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
      WrappedComponent = createChannelReferenceSingleFilter({ isMulti: true });
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

  describe('with `roles`', () => {
    beforeEach(() => {
      mockWithDereferencedResource.mockClear();
      WrappedComponent = createChannelReferenceSingleFilter({
        roles: ['InventorySupply'],
      });
      wrapper = shallow(
        <IntlProvider locale="en" messages={{}}>
          <WrappedComponent />
        </IntlProvider>
      );
    });
    it('should call withDereferencedResource with `roles`', () => {
      expect(mockWithDereferencedResource).toHaveBeenCalledWith(
        expect.objectContaining({
          roles: ['InventorySupply'],
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
