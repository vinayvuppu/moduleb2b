import React from 'react';
import { shallow } from 'enzyme';
import withPendingRequests from './with-pending-requests';

const Component = () => <React.Fragment>Component</React.Fragment>;
Component.displayName = 'Component';

describe('when component is unmounted', () => {
  let wrapper;
  let EnhancedComponent;

  beforeEach(() => {
    EnhancedComponent = withPendingRequests()(Component);
    wrapper = shallow(<EnhancedComponent />);
    wrapper.instance().isUnmounting = true;

    wrapper.prop('pendingRequests').increment();
    wrapper.update();
  });

  it('should not set `isLoading` to `true` (no state updates)', () => {
    expect(wrapper).toHaveProp(
      'pendingRequests',
      expect.objectContaining({
        isLoading: false,
      })
    );
  });
});

describe('when incrementing', () => {
  let wrapper;
  let EnhancedComponent;

  beforeEach(() => {
    EnhancedComponent = withPendingRequests()(Component);
    wrapper = shallow(<EnhancedComponent />);

    wrapper.prop('pendingRequests').increment();
    wrapper.update();
  });

  it('should set `isLoading` to `true`', () => {
    expect(wrapper).toHaveProp(
      'pendingRequests',
      expect.objectContaining({
        isLoading: true,
      })
    );
  });

  describe('when decrementing', () => {
    beforeEach(() => {
      wrapper.prop('pendingRequests').decrement();
      wrapper.update();
    });

    it('should set `isLoading` back to `false`', () => {
      expect(wrapper).toHaveProp(
        'pendingRequests',
        expect.objectContaining({
          isLoading: false,
        })
      );
    });
  });
});

describe('without `propName`', () => {
  let wrapper;
  let EnhancedComponent;

  beforeEach(() => {
    EnhancedComponent = withPendingRequests()(Component);
    wrapper = shallow(<EnhancedComponent />);
  });

  it('should inject the Api onto the `pendingRequests` prop', () => {
    expect(wrapper).toHaveProp(
      'pendingRequests',
      expect.objectContaining({
        isLoading: expect.any(Boolean),
        increment: expect.any(Function),
        decrement: expect.any(Function),
      })
    );
  });
});

describe('with `propName`', () => {
  const propName = 'pendingOtherRequests';
  let wrapper;
  let EnhancedComponent;

  beforeEach(() => {
    EnhancedComponent = withPendingRequests(propName)(Component);
    wrapper = shallow(<EnhancedComponent />);
  });

  it('should inject the Api onto the `propName`', () => {
    expect(wrapper).toHaveProp(
      propName,
      expect.objectContaining({
        isLoading: expect.any(Boolean),
        increment: expect.any(Function),
        decrement: expect.any(Function),
      })
    );
  });
});
