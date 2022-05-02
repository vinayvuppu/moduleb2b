import React from 'react';
import { shallow } from 'enzyme';
import SearchContainer from './search-container';

const createTestProps = props => ({
  onUpdateSearch: jest.fn(),
  children: jest.fn(),
  ...props,
});

describe('rendering', () => {
  it('should render basic components', () => {
    const props = createTestProps({
      children: jest.fn(() => (
        <div className="test-container">{'Tony Stark'}</div>
      )),
    });
    const wrapper = shallow(<SearchContainer {...props} />);

    expect(props.children).toHaveBeenCalledTimes(1);
    expect(props.children).toHaveBeenCalledWith({
      onUpdateSearch: wrapper.instance().handleUpdateSearch,
      onUpdateSorting: wrapper.instance().handleUpdateSorting,
    });
    expect(wrapper.find('div.test-container')).toHaveLength(1);
  });
});

describe('callbacks', () => {
  const renderCallback = jest.fn(() => <div />);
  let props;
  let wrapper;
  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(
      <SearchContainer {...props}>{renderCallback}</SearchContainer>
    );
  });

  describe('call search with text', () => {
    beforeEach(() => {
      wrapper.instance().handleUpdateSearch({ searchText: 'foo' });
    });
    it('should call onUpdateSearch', () => {
      expect(props.onUpdateSearch).toHaveBeenCalledTimes(1);
      expect(props.onUpdateSearch).toHaveBeenCalledWith({ searchText: 'foo' });
    });
  });

  describe('call search with filters', () => {
    beforeEach(() => {
      wrapper.instance().handleUpdateSearch({ filters: 'filters' });
    });
    it('should call onUpdateSearch', () => {
      expect(props.onUpdateSearch).toHaveBeenCalledTimes(1);
      expect(props.onUpdateSearch).toHaveBeenCalledWith({ filters: 'filters' });
    });
  });

  describe('call search with text and filters', () => {
    beforeEach(() => {
      wrapper
        .instance()
        .handleUpdateSearch({ searchText: 'foo2', filters: 'filter2' });
    });
    it('should call onUpdateSearch', () => {
      expect(props.onUpdateSearch).toHaveBeenCalledTimes(1);
      expect(props.onUpdateSearch).toHaveBeenCalledWith({
        searchText: 'foo2',
        filters: 'filter2',
      });
    });
  });

  describe('call search with sorting', () => {
    beforeEach(() => {
      wrapper.instance().handleUpdateSorting('sorting');
    });
    it('should call onUpdateSearch', () => {
      expect(props.onUpdateSearch).toHaveBeenCalledTimes(1);
      expect(props.onUpdateSearch).toHaveBeenLastCalledWith({
        sorting: 'sorting',
      });
    });
  });
});
