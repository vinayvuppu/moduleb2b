import React from 'react';
import { shallow } from 'enzyme';
import { SelectInput } from '@commercetools-frontend/ui-kit';
import { QuickFilters } from './quick-filters';
import {
  QUICK_FILTERS_FOR_DATES,
  QUICK_FILTERS,
} from '../standard-quick-filter-definitions';
import messages from './messages';
import styles from './quick-filters.mod.css';

const createTestProps = props => ({
  onChange: jest.fn().mockName('onChange'),
  onRemove: jest.fn().mockName('onRemove:'),
  values: {
    createdAt: [
      {
        type: 'range',
        value: {
          quickFilterValue: QUICK_FILTERS_FOR_DATES.lastThirtyDays,
          from: '2018-08-20',
          to: '2018-09-19',
        },
      },
    ],
  },
  definitions: [
    {
      label: 'None',
      value: QUICK_FILTERS_FOR_DATES.none,
      filter: {
        fieldName: QUICK_FILTERS.CREATED_AT,
        index: 0,
      },
    },
    {
      label: 'Last 30 days',
      value: QUICK_FILTERS_FOR_DATES.lastThirtyDays,
      filter: {
        fieldName: QUICK_FILTERS.CREATED_AT,
        index: 0,
        filter: {
          type: 'range',
          value: {
            quickFilterValue: QUICK_FILTERS_FOR_DATES.lastThirtyDays,
            from: '2018-08-20',
            to: '2018-09-19',
          },
        },
      },
    },
  ],
  ...props,
});

describe('rendering', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<QuickFilters {...props} />);
  });

  it('should not have `container` classname', () => {
    expect(wrapper).not.toHaveClassName(styles.container);
  });

  it('should render title', () => {
    expect(wrapper).toRender({ id: messages.title.id });
  });

  describe('<SelectInput>', () => {
    it('should render <SelectInput>', () => {
      expect(wrapper).toRender(SelectInput);
    });

    describe('when has an active quick filter without other filters', () => {
      it('should have the value as `quickFilterValue`', () => {
        expect(wrapper.find(SelectInput)).toHaveProp(
          'value',
          QUICK_FILTERS_FOR_DATES.lastThirtyDays
        );
      });
    });

    describe('when has an active quick filter with other filters', () => {
      beforeEach(() => {
        props = createTestProps({
          values: {
            createdAt: [
              {
                type: 'range',
                value: {
                  quickFilterValue: QUICK_FILTERS_FOR_DATES.lastThirtyDays,
                  from: '2018-08-20',
                  to: '2018-09-19',
                },
              },
            ],
            foo: [
              {
                type: 'equalTo',
                value: 'bar',
              },
            ],
          },
        });
        wrapper = shallow(<QuickFilters {...props} />);
      });
      it('should have the value as `none`', () => {
        expect(wrapper.find(SelectInput)).toHaveProp(
          'value',
          QUICK_FILTERS_FOR_DATES.none
        );
      });
    });

    describe('when has only one active filter but is not a quick filter', () => {
      beforeEach(() => {
        props = createTestProps({
          values: {
            foo: [
              {
                type: 'equalTo',
                value: 'bar',
              },
            ],
          },
        });
        wrapper = shallow(<QuickFilters {...props} />);
      });
      it('should have the value as `none`', () => {
        expect(wrapper.find(SelectInput)).toHaveProp(
          'value',
          QUICK_FILTERS_FOR_DATES.none
        );
      });
    });

    describe('when there no filters', () => {
      beforeEach(() => {
        props = createTestProps({
          values: {},
        });
        wrapper = shallow(<QuickFilters {...props} />);
      });
      it('should have `container` classname', () => {
        expect(wrapper).toHaveClassName(styles.container);
      });
    });
  });
});

describe('callbacks', () => {
  let props;
  let wrapper;

  describe('handleChange', () => {
    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(<QuickFilters {...props} />);
      wrapper.find(SelectInput).prop('onChange')({
        target: { value: QUICK_FILTERS_FOR_DATES.lastThirtyDays },
      });
    });

    it('should invoke `onChange`', () => {
      expect(props.onChange).toHaveBeenCalled();
    });

    describe('when changing the value to `none`', () => {
      beforeEach(() => {
        props = createTestProps();
        wrapper = shallow(<QuickFilters {...props} />);
        wrapper.find(SelectInput).prop('onChange')({
          target: { value: QUICK_FILTERS_FOR_DATES.none },
        });
      });

      it('should invoke `onRemove`', () => {
        expect(props.onRemove).toHaveBeenCalled();
      });
    });
  });
});
