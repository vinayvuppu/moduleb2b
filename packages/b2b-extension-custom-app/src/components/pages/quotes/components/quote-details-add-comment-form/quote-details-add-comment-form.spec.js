import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';
import QuoteDetailsAddCommentForm from './quote-details-add-comment-form';

jest.mock('react-intl', () => {
  const actual = jest.requireActual('react-intl');
  return {
    ...actual,
    useIntl: () => ({ formatMessage: text => text.defaultMessage }),
  };
});

describe('QuoteDetailsAddCommentForm', () => {
  it('should render the correct snapshot', () => {
    const { asFragment } = render(
      <QuoteDetailsAddCommentForm onSubmit={jest.fn()} />
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('should dont call onSubmit if form is invalid', async () => {
    const onSubmitSpy = jest.fn();
    const { getByLabelText, getByPlaceholderText } = render(
      <QuoteDetailsAddCommentForm onSubmit={onSubmitSpy} />
    );
    const sendButton = getByLabelText('Send');
    const textField = getByPlaceholderText('Enter a comment...');

    fireEvent.click(sendButton);
    expect(onSubmitSpy).not.toHaveBeenCalled();

    fireEvent.change(textField, { target: { value: 'text' } });
    fireEvent.change(textField, { target: { value: '' } });
    fireEvent.click(sendButton);
    await wait();
    expect(onSubmitSpy).not.toHaveBeenCalled();
  });

  it('should call onSubmit on valid form', async () => {
    const onSubmitSpy = jest.fn();
    const { getByLabelText, getByPlaceholderText } = render(
      <QuoteDetailsAddCommentForm onSubmit={onSubmitSpy} />
    );
    const sendButton = getByLabelText('Send');
    const textField = getByPlaceholderText('Enter a comment...');

    fireEvent.change(textField, { target: { value: 'foo' } });
    fireEvent.click(sendButton);
    await wait();
    expect(onSubmitSpy).toHaveBeenCalledWith({ text: 'foo' });
  });
});
