import React from 'react';
import {
  render,
  fireEvent,
  waitForElement,
  within,
  wait,
} from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import ThrottledField from '../throttled-field';
import localizedField from './localized-field';

const createTestProps = props => ({
  languages: ['en', 'de'],
  selectedLanguage: 'en',
  name: 'some name',
  modalTitle: 'Some localized field',
  modalWarningMessage: 'This is warning message',
  onChangeValue: jest.fn(),
  ...props,
});

describe('rendering', () => {
  it('should show localized values', async () => {
    const Input = props => <ThrottledField as="text" {...props} />;
    const LocalizedField = localizedField(Input);
    const props = createTestProps();
    const rendered = render(
      <IntlProvider locale="en" messages={{}}>
        <LocalizedField {...props} />
      </IntlProvider>
    );

    // Selected locale
    expect(rendered.queryByText('EN')).toBeInTheDocument();
    // Number of available locales
    expect(rendered.queryByText('0 / 2')).toBeInTheDocument();

    // Open modal
    fireEvent.click(rendered.getByText('EN'));

    await waitForElement(() => rendered.getByLabelText('localized-field'));

    expect(rendered.queryByText('Some localized field')).toBeInTheDocument();
    expect(rendered.queryByText('This is warning message')).toBeInTheDocument();

    // enter text in first input field
    const input = within(
      rendered.getByLabelText('localized-field')
    ).getByTestId('localized-field-en');
    fireEvent.change(input, { target: { value: 'English text' } });
    await wait(() => {
      expect(props.onChangeValue).toHaveBeenCalledWith(
        { en: 'English text' },
        expect.anything()
      );
    });
  });
});
// TODO: more tests
