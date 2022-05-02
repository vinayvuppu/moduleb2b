import React from 'react';
import { wrapDisplayName } from 'recompose';
import { defaultMemoize } from 'reselect';

export default (propName = 'pendingRequests') => {
  // We use a creator function so that the object reference stays the same,
  // except when the loading state changes.
  // This helps avoid some unnecessary rerenders.
  // We need to create a separate memoized function for each application of
  // this HoC to avoid one HoC application destroying the memo of another.
  const createApi = defaultMemoize((increment, decrement, isLoading) => ({
    isLoading,
    increment,
    decrement,
  }));
  return Component =>
    class extends React.Component {
      static displayName = wrapDisplayName(Component, 'withPendingRequests');
      state = { pendingRequests: 0 };
      componentWillUnmount() {
        this.isUnmounting = true;
      }
      change = delta => {
        // Safe-guard from state updates when the component is not mounted anymore.
        // > Can't perform a React state update on an unmounted component.
        // > This is a no-op, but it indicates a memory leak in your application.
        // > To fix, cancel all subscriptions and asynchronous tasks in the componentWillUnmount method.
        if (!this.isUnmounting) {
          this.setState(prevState => ({
            pendingRequests: prevState.pendingRequests + delta,
          }));
        }
      };
      increment = () => this.change(1);
      decrement = () => this.change(-1);
      render() {
        const pendingProp = {
          [propName]: createApi(
            this.increment,
            this.decrement,
            this.state.pendingRequests > 0
          ),
        };
        return <Component {...this.props} {...pendingProp} />;
      }
    };
};
