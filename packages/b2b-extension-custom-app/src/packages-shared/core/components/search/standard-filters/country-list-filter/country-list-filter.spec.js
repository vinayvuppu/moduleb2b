import React from 'react';
import { shallow } from 'enzyme';
import { CountryListFilter, countriesToOptions } from './country-list-filter';

const createProps = custom => ({
  locale: 'de',
  isMulti: false,
  isSearchable: false,
  countries: { br: 'Brazil', de: 'Germany' },

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
      wrapper = shallow(<CountryListFilter {...props} />);
    });
    it('should render a `SingleFilter` component', () => {
      expect(wrapper).toRender('SingleFilter');
    });
    it('should match output tree', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});

describe('countriesToOptions', () => {
  let list;
  beforeEach(() => {
    list = countriesToOptions({ br: 'Brazil', de: 'Germany' });
  });
  it('should return list of select options', () => {
    expect(list).toEqual([
      { value: 'BR', label: 'Brazil (BR)' },
      { value: 'DE', label: 'Germany (DE)' },
    ]);
  });
});
