import React from 'react';
import { shallow } from 'enzyme';
import { FlatButton } from '@commercetools-frontend/ui-kit';
import { intlMock } from '../../../../test-utils';
import { FilterSearchBar } from './filter-search-bar';

const createTestProps = props => ({
  intl: intlMock,
  initialValue: '123',
  onSubmit: jest.fn(),
  onToggleFilterButton: jest.fn(),
  isFilterButtonActive: false,
  isFilterButtonDisabled: false,
  onChange: jest.fn(),
  onClearAll: jest.fn(),
  showOnClearAll: false,
  searchInputPlaceholder: 'Some search placeholder...',
  onUpdateQuickFilterForField: jest.fn(),
  onRemoveFilterTagFromField: jest.fn(),
  ...props,
});

describe('rendering', () => {
  let props;
  let wrapper;
  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<FilterSearchBar {...props} />);
  });

  it('outputs correct tree', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('outputs with filter button disabled', () => {
    wrapper.setProps({ isFilterButtonDisabled: true });
    expect(wrapper).toMatchSnapshot();
  });

  describe('rendering when exists text on SearchInput', () => {
    beforeEach(() => {
      props = createTestProps({ showOnClearAll: true });
      wrapper = shallow(<FilterSearchBar {...props} />);
    });
    it('should render the `remove All` button', () => {
      expect(wrapper).toRender(FlatButton);
    });
  });

  describe('when there are quick filters', () => {
    beforeEach(() => {
      props = createTestProps({
        renderQuickFilters: jest.fn().mockName('renderQuickFilters'),
      });
      wrapper = shallow(<FilterSearchBar {...props} />);
    });
    it('should invoke `renderQuickFilters`', () => {
      expect(props.renderQuickFilters).toHaveBeenCalled();
    });
    it('should invoke `renderQuickFilters` with `onUpdateQuickFilterForField`', () => {
      expect(props.renderQuickFilters).toHaveBeenCalledWith(
        expect.objectContaining({
          onUpdateQuickFilterForField: props.onUpdateQuickFilterForField,
        })
      );
    });
    it('should invoke `renderQuickFilters` with `onRemoveFilterTagFromField`', () => {
      expect(props.renderQuickFilters).toHaveBeenCalledWith(
        expect.objectContaining({
          onRemoveFilterTagFromField: props.onRemoveFilterTagFromField,
        })
      );
    });
  });
});

describe('callbacks', () => {
  let props;
  let wrapper;
  beforeEach(() => {
    props = createTestProps({ showOnClearAll: true });
    wrapper = shallow(<FilterSearchBar {...props} />);
    wrapper.find(FlatButton).simulate('click');
  });
  it('should call on `oncClearAll` function', () => {
    expect(props.onClearAll).toHaveBeenCalledTimes(1);
  });
});
