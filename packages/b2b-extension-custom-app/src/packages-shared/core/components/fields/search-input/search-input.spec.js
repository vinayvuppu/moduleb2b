import React from 'react';
import {
  renderApp,
  waitForElement,
  fireEvent,
} from '@commercetools-frontend/application-shell/test-utils';
import SearchInput from './search-input';

const createTestProps = custom => ({
  onSubmit: jest.fn(),
  ...custom,
});

describe('<SearchInput />', () => {
  it('should render with a default placeholder if non is provided', async () => {
    const props = createTestProps();
    const { getByPlaceholderText } = renderApp(<SearchInput {...props} />);
    await waitForElement(() => getByPlaceholderText('Search'));
  });

  it('should render with a provided placeholder', async () => {
    const props = createTestProps({ placeholder: 'enter something...' });
    const { getByPlaceholderText } = renderApp(<SearchInput {...props} />);
    await waitForElement(() => getByPlaceholderText('enter something...'));
  });

  it('should render with an initialValue', async () => {
    const props = createTestProps({ initialValue: 'hello' });
    const { getByDisplayValue } = renderApp(<SearchInput {...props} />);
    await waitForElement(() => getByDisplayValue('hello'));
  });

  it('should override input value with a provided one', async () => {
    const props = createTestProps();
    let changeInitialValue;
    class Component extends React.Component {
      state = {
        value: 'foo',
      };

      render() {
        changeInitialValue = value => this.setState({ value });
        return <SearchInput {...props} initialValue={this.state.value} />;
      }
    }
    const { getByDisplayValue } = renderApp(<Component />);
    await waitForElement(() => getByDisplayValue('foo'));

    changeInitialValue('bar');

    await waitForElement(() => getByDisplayValue('bar'));
  });

  it('should submit on search icon click', async () => {
    const props = createTestProps({ onSubmit: jest.fn(), initialValue: 'foo' });
    const { getByTestId } = renderApp(<SearchInput {...props} />);
    fireEvent.click(getByTestId('search-button'));

    expect(props.onSubmit).toHaveBeenCalledWith('foo');
  });

  it('should submit on hitting Enter', async () => {
    const props = createTestProps({ onSubmit: jest.fn(), initialValue: 'foo' });
    const { getByDisplayValue } = renderApp(<SearchInput {...props} />);
    fireEvent.keyDown(getByDisplayValue('foo'), { key: 'Enter', keyCode: 13 });

    expect(props.onSubmit).toHaveBeenCalledWith('foo');
  });

  it('should submit on change when `shouldSubmitOnInputChange` was true', async () => {
    let onSubmit;
    const waitForSubmit = new Promise(resolve => {
      onSubmit = resolve;
    });

    const props = createTestProps({
      onSubmit,
      shouldSubmitOnInputChange: true,
    });

    const { getByPlaceholderText } = renderApp(<SearchInput {...props} />);
    const input = await waitForElement(() => getByPlaceholderText('Search'));
    fireEvent.change(input, { target: { value: 'entered value' } });

    const submittedValue = await waitForSubmit;
    expect(submittedValue).toBe('entered value');
  });

  it('should clear input on submit if `shouldClearOnSubmit` was true', async () => {
    const props = createTestProps({
      initialValue: 'foo',
      shouldClearOnSubmit: true,
    });

    const { getByTestId, getByDisplayValue } = renderApp(
      <SearchInput {...props} />
    );

    fireEvent.click(getByTestId('search-button'));
    await waitForElement(() => getByDisplayValue(''));
  });
});
