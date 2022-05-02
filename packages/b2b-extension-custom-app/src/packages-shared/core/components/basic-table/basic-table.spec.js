import React from 'react';
import { render } from '@commercetools-frontend/application-shell/test-utils';
import BasicTable from './basic-table';

const createTestProps = customProps => ({
  columns: [
    {
      key: 'column-0',
      label: <p>Column 0</p>,
    },
  ],
  items: [{}],
  itemRenderer: jest.fn(() => <p>Cell 0</p>),
  components: {
    header: <p>Header</p>,
    footer: <p>Footer</p>,
  },
  ...customProps,
});

describe('BasicTable', () => {
  const props = createTestProps();

  it('should render column header', () => {
    const { queryByText } = render(<BasicTable {...props} />);
    expect(queryByText('Column 0')).toBeInTheDocument();
  });

  it('should render column cell', () => {
    const { queryByText } = render(<BasicTable {...props} />);
    expect(queryByText('Cell 0')).toBeInTheDocument();
  });

  it('should render header row content', () => {
    const { queryByText } = render(<BasicTable {...props} />);
    expect(queryByText('Header')).toBeInTheDocument();
  });

  it('should render footer row content', () => {
    const { queryByText } = render(<BasicTable {...props} />);
    expect(queryByText('Footer')).toBeInTheDocument();
  });
});
