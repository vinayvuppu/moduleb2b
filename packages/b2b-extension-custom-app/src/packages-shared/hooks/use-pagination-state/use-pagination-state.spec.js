import React from 'react';
import {
  renderApp,
  fireEvent,
} from '@commercetools-frontend/application-shell/test-utils';
import { Spacings, PrimaryButton } from '@commercetools-frontend/ui-kit';
import usePaginationState from './use-pagination-state';

const TestComponent = () => {
  const { perPage, page, sorting } = usePaginationState();

  return (
    <>
      <ul>
        <li>Per page: {perPage.current}</li>
        <li>Page: {page.current}</li>
        <li>Sorting: {`${sorting.current.key}:${sorting.current.order}`}</li>
      </ul>

      <Spacings.Stack>
        <PrimaryButton
          onClick={() => perPage.onChange(50)}
          label="Change per page"
        />
        <PrimaryButton
          onClick={() => page.onChange(page.current + 1)}
          label="Change page"
        />
        <PrimaryButton
          onClick={() => sorting.onChange('name', 'asc')}
          label="Change sorting"
        />
      </Spacings.Stack>
    </>
  );
};

describe('per page', () => {
  it('should default per page and allow increasing page size', async () => {
    const rendered = renderApp(<TestComponent />);

    expect(rendered.queryByText(/Per page: 20/)).toBeInTheDocument();

    fireEvent.click(rendered.getByLabelText(/Change per page/));

    expect(rendered.queryByText(/Per page: 50/)).toBeInTheDocument();
  });
});

describe('page', () => {
  it('should default page and allow moving to next page', async () => {
    const rendered = renderApp(<TestComponent />);

    expect(rendered.queryByText(/Page: 1/)).toBeInTheDocument();

    fireEvent.click(rendered.getByLabelText(/Change page/));

    expect(rendered.queryByText(/Page: 2/)).toBeInTheDocument();
  });
});

describe('sorting', () => {
  it('should default sorting and allow changing order and key', async () => {
    const rendered = renderApp(<TestComponent />);

    expect(rendered.queryByText(/Sorting: createdAt:desc/)).toBeInTheDocument();

    fireEvent.click(rendered.getByLabelText(/Change sorting/));

    expect(rendered.queryByText(/Sorting: name:asc/)).toBeInTheDocument();
  });
});
