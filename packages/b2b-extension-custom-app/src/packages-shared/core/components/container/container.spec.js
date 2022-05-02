import React from 'react';
import { shallow } from 'enzyme';
import Container from './container';

describe('rendering', () => {
  it('should render content', () => {
    const wrapper = shallow(
      <Container>
        <div>{'bar'}</div>
      </Container>
    );
    expect(wrapper.find({ className: 'container' }).text()).toBe('bar');
  });
});
