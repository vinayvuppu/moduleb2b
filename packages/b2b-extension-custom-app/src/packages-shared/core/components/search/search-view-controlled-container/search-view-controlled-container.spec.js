import React from 'react';
import { shallow } from 'enzyme';
import SearchView from '../search-view';
import { SearchViewControlledContainer } from './search-view-controlled-container';

const createTestProps = customProps => ({
  value: {
    foo: 'foo',
    bar: 'bar',
  },
  onChange: jest.fn(),
  children: jest.fn(),

  ...customProps,
});

describe('rendering', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<SearchViewControlledContainer {...props} />);
  });

  it('should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render a `<SearchView>`', () => {
    expect(wrapper).toRender(SearchView);
  });

  describe('`<SearchView>`', () => {
    let searchViewWrapper;

    beforeEach(() => {
      searchViewWrapper = wrapper.find(SearchView);
    });

    it('should receive `onSearch`', () => {
      expect(searchViewWrapper).toHaveProp(
        'onSearch',
        wrapper.instance().handleOnSearch
      );
    });

    it('should receive `setSearchFiltersState`', () => {
      expect(searchViewWrapper).toHaveProp(
        'setSearchFiltersState',
        wrapper.instance().handleChange
      );
    });

    it('should receive all `value` props', () => {
      expect(searchViewWrapper).toHaveProp(
        'value',
        expect.objectContaining(props.value)
      );
    });
  });
});
