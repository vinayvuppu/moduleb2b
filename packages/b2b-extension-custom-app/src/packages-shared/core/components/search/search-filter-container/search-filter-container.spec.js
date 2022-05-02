import React from 'react';
import { shallow } from 'enzyme';
import SearchFilterContainer from '.';

describe('rendering', () => {
  it('should match snapshot', () => {
    const wrapper = shallow(
      <SearchFilterContainer>{() => {}}</SearchFilterContainer>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
