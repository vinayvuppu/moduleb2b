import React from 'react';
import { shallow } from 'enzyme';
import RangePaginator from '../../tables/paginators/range-paginator';
import PerPageSwitcher from '../../tables/paginators/per-page-switcher';
import Pagination from './pagination';

const createTestProps = custom => ({
  totalItems: 200,
  perPage: 20,
  page: 1,
  onPerPageChange: jest.fn(),
  onPageChange: jest.fn(),
  ...custom,
});

describe('rendering', () => {
  let props;
  let wrapper;
  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<Pagination {...props} />);
  });

  it('outputs correct tree', () => {
    expect(wrapper).toMatchSnapshot();
  });

  describe('PerPageSwitcher', () => {
    it('should receive perPage', () => {
      expect(wrapper.find(PerPageSwitcher)).toHaveProp(
        'perPage',
        props.perPage
      );
    });
    describe('calculation of itemsOnPage', () => {
      describe('when page is not the last page', () => {
        beforeEach(() => {
          props = createTestProps({ page: 1, perPage: 5, totalItems: 20 });
          wrapper = shallow(<Pagination {...props} />);
        });
        it('should equal perPage', () => {
          expect(wrapper.find(PerPageSwitcher).prop('itemsOnPage')).toBe(
            props.perPage
          );
        });
      });
      describe('when on last page', () => {
        describe('when items are left over', () => {
          beforeEach(() => {
            props = createTestProps({ page: 2, perPage: 20, totalItems: 27 });
            wrapper = shallow(<Pagination {...props} />);
          });
          it('should equal the remainder', () => {
            expect(wrapper.find(PerPageSwitcher).prop('itemsOnPage')).toBe(7);
          });
        });
      });
    });
  });

  describe('RangePaginator', () => {
    it('should receive page', () => {
      expect(wrapper.find(RangePaginator)).toHaveProp('page', props.page);
    });
  });
});
