import React from 'react';
import { shallow } from 'enzyme';
import {
  CurrencyListFilter,
  currenciesToOptions,
} from './currency-list-filter';

const createProps = custom => ({
  locale: 'de',
  isMulti: false,
  isSearchable: false,
  currencies: {
    EUR: { label: 'Euro', symbol: '€' },
    USD: { label: 'USD', symbol: '$' },
  },

  // SingleFilter's props
  onUpdateFilter: jest.fn(), // is required in `SingleFilter`
  ...custom,
});

describe('rendering', () => {
  describe('SingleFilter', () => {
    let wrapper;
    let props;
    beforeEach(() => {
      props = createProps();
      wrapper = shallow(<CurrencyListFilter {...props} />);
    });
    it('should render a `SingleFilter` component', () => {
      expect(wrapper).toRender('SingleFilter');
    });
    it('should match output tree', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});

describe('currenciesToOptions', () => {
  let list;
  beforeEach(() => {
    list = currenciesToOptions({
      EUR: { label: 'Euro', symbol: '€' },
      USD: { label: 'US-Dollar', symbol: '$' },
    });
  });
  it('should return list of select options', () => {
    expect(list).toEqual([
      { value: 'EUR', label: 'EUR - Euro (€)' },
      { value: 'USD', label: 'USD - US-Dollar ($)' },
    ]);
  });
});
