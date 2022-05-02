import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';
import QuoteDetailsCommentsTab from './quote-details-comments-tab';

jest.mock('react-intl', () => {
  const actual = jest.requireActual('react-intl');
  return {
    ...actual,
    useIntl: () => ({
      formatDate: date => date,
      formatTime: time => time,
      formatMessage: msg => msg.defaultMessage,
    }),
  };
});
jest.mock('@commercetools-frontend/application-shell-connectors', () => {
  const actual = jest.requireActual(
    '@commercetools-frontend/application-shell-connectors'
  );
  return {
    ...actual,
    useApplicationContext: () => ({ user: { email: 'foo@example.com' } }),
  };
});
jest.mock('@commercetools-frontend/actions-global', () => ({
  useShowNotification: () => jest.fn(),
}));
jest.mock('../quote-details-add-comment-form', () => ({ onSubmit }) => (
  <button
    onClick={() => onSubmit({ text: 'foo-text' })}
    data-testid="mock-button"
  />
));

const quote = {
  comments: [
    { id: 'foo', text: 'text', email: 'foo@example.com', createdAt: 'date' },
    { id: 'bar', text: 'text', email: 'bar@example.com', createdAt: 'date' },
  ],
};

describe('QuoteDetailsCommentsTab', () => {
  it('should render the correct snapshot', () => {
    const { asFragment } = render(
      <QuoteDetailsCommentsTab addComment={jest.fn()} quote={quote} />
    );

    expect(asFragment()).toMatchSnapshot();
  });
  it('should call addComment on submit children', async () => {
    const addCommentSpy = jest.fn();
    const { getByTestId } = render(
      <QuoteDetailsCommentsTab addComment={addCommentSpy} quote={quote} />
    );
    const submitChildren = getByTestId('mock-button');

    fireEvent.click(submitChildren);
    await wait();
    expect(addCommentSpy).toHaveBeenCalledWith({
      email: 'foo@example.com',
      text: 'foo-text',
    });
  });
  it('should call addComent with employeeEmail prop', async () => {
    const addCommentSpy = jest.fn();
    const { getByTestId } = render(
      <QuoteDetailsCommentsTab
        addComment={addCommentSpy}
        quote={quote}
        employeeEmail="internal@example.com"
      />
    );
    const submitChildren = getByTestId('mock-button');

    fireEvent.click(submitChildren);
    await wait();
    expect(addCommentSpy).toHaveBeenCalledWith({
      email: 'internal@example.com',
      text: 'foo-text',
    });
  });
});
