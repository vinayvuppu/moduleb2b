import React from 'react';
import { shallow } from 'enzyme';
import { IntlProvider } from 'react-intl';
import { NO_VALUE_FALLBACK } from '@commercetools-frontend/constants';
import createChannelReferenceSingleFilter, {
  mapItemToOption,
  renderItem,
} from './category-reference-filter';

const InnerComponent = () => <div />;
InnerComponent.displayName = 'InnerComponent';

const mockWithDereferencedCategory = jest.fn(
  (/* options */) => (/* Component */) => InnerComponent
);
jest.mock('../with-dereferenced-category', () => (...args) =>
  mockWithDereferencedCategory(...args)
);

describe('named exports', () => {
  describe('mapItemToOption', () => {
    it('should map category fields for dropdown option', () => {
      expect(mapItemToOption({ id: '1', name: 'Category' })).toEqual({
        value: '1',
        label: 'Category',
      });
    });
    describe('when category has no name', () => {
      it('should return fallback', () => {
        expect(mapItemToOption({ id: '1', key: 'foo' })).toEqual({
          value: '1',
          label: NO_VALUE_FALLBACK,
        });
      });
    });
  });
  describe('renderItem', () => {
    let wrapper;
    beforeEach(() => {
      wrapper = shallow(renderItem({ name: 'Category', slug: 'category' }));
    });
    it('should render dropdown option', () => {
      expect(wrapper).toMatchSnapshot();
    });
    describe('when category has no name', () => {
      beforeEach(() => {
        wrapper = shallow(renderItem({ slug: 'category' }));
      });
      it('should return fallback', () => {
        expect(wrapper.text()).toMatch(NO_VALUE_FALLBACK);
      });
    });
    describe('when category has no slug', () => {
      beforeEach(() => {
        wrapper = shallow(renderItem({ name: 'Category' }));
      });
      it('should return fallback', () => {
        expect(wrapper.text()).toMatch(NO_VALUE_FALLBACK);
      });
    });
  });
});

describe('withDereferencedResource', () => {
  let WrappedComponent;
  let wrapper;
  beforeEach(() => {
    mockWithDereferencedCategory.mockClear();
    WrappedComponent = createChannelReferenceSingleFilter({});
    wrapper = shallow(
      <IntlProvider locale="en" messages={{}}>
        <WrappedComponent />
      </IntlProvider>
    );
  });
  it('should call withDereferencedResource with correct arguments', () => {
    expect(mockWithDereferencedCategory).toHaveBeenCalledWith({
      isMulti: false,
    });
  });
  it('should compose components', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
