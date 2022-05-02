import React from 'react';
import { renderApp } from '@commercetools-frontend/application-shell/test-utils';
import TotalResults from './total-results';

describe('rendering', () => {
  it('should render message', () => {
    const rendered = renderApp(<TotalResults total={10} />);
    expect(rendered.queryByText('10 results')).toBeInTheDocument();
  });
});
