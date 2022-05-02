import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import withMouseOverState from './with-mouse-over-state';

const Component = withMouseOverState(props => (
  <div
    data-testid="div"
    onMouseOver={props.handleMouseOver}
    onMouseOut={props.handleMouseOut}
  >
    {props.isMouseOver ? 'mouse over' : 'mouse not over'}
  </div>
));

it('should provide isMouseOver as "false" by default', () => {
  const { queryByTestId } = render(<Component />);
  expect(queryByTestId('div')).toHaveTextContent('mouse not over');
});

it('should work through the whole cycle', () => {
  const { getByTestId, queryByTestId } = render(<Component />);

  // it should provide isMouseOver as "true" when mouse is over
  fireEvent(
    getByTestId('div'),
    new MouseEvent('mouseover', { bubbles: true, cancelable: true })
  );
  expect(queryByTestId('div')).toHaveTextContent('mouse over');

  // it should provide isMouseOver as "false" when mouse is up again
  fireEvent(
    getByTestId('div'),
    new MouseEvent('mouseout', { bubbles: true, cancelable: true })
  );
  expect(queryByTestId('div')).toHaveTextContent('mouse not over');
});
