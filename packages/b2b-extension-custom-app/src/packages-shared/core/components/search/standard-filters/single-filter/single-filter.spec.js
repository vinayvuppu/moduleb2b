import React from 'react';
import PropTypes from 'prop-types';
import {
  fireEvent,
  renderApp,
} from '@commercetools-frontend/application-shell/test-utils';
import SingleFilter from './single-filter';

const renderInput = ({
  onBlur,
  onFocus,
  onUpdateValue,
  placeholder,
  value,
}) => (
  <input
    data-testid="render-input-id"
    value={value}
    onBlur={onBlur}
    onChange={onUpdateValue}
    onFocus={onFocus}
    placeholder={placeholder}
  />
);

renderInput.propTypes = {
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  onUpdateValue: PropTypes.func,
  placeholder: PropTypes.string,
  value: PropTypes.any,
};

class TestComponent extends React.Component {
  state = {
    value: '',
  };

  handleChange = evt => {
    this.setState({
      value: evt.target.value,
    });
  };

  render() {
    return (
      <div>
        <label htmlFor="test-input">Input value</label>
        <input
          id="test-input"
          type="text"
          value={this.state.value}
          onChange={this.handleChange}
        />
        <SingleFilter
          renderInput={this.props.renderInput}
          value={this.state.value}
          onBlur={this.props.onBlur}
          onFocus={this.props.onFocus}
          onUpdateValue={this.props.onUpdateValue}
          error={this.props.error}
          placeholder={this.props.placeholder}
        />
      </div>
    );
  }
}

TestComponent.propTypes = {
  onUpdateValue: PropTypes.func.isRequired,
  value: PropTypes.any,
  renderInput: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  error: PropTypes.string,
  placeholder: PropTypes.string,
};

TestComponent.defaultProps = {
  onUpdateValue: () => {},
  renderInput,
  value: '',
  placeholder: '',
};

describe('rendering', () => {
  it('should render an input', () => {
    const { queryByTestId } = renderApp(<TestComponent />);
    expect(queryByTestId('render-input-id')).toBeInTheDocument();
  });

  it('should render an error message', () => {
    const { queryByText } = renderApp(<TestComponent error="Error" />);
    expect(queryByText('Error')).toBeInTheDocument();
  });

  it('should call renderInput with correct props', () => {
    const renderInputFn = jest.fn();
    renderApp(<TestComponent renderInput={renderInputFn} />);
    expect(renderInputFn).toHaveBeenCalledWith(
      expect.objectContaining({
        hasError: false,
        onBlur: expect.any(Function),
        onFocus: expect.any(Function),
        onUpdateValue: expect.any(Function),
        placeholder: '',
        value: '',
      })
    );
  });
  describe('callbacks', () => {
    it('should trigger onBlur and onFocus', () => {
      const onBlur = jest.fn();
      const onFocus = jest.fn();
      const { getByTestId } = renderApp(
        <TestComponent onBlur={onBlur} onFocus={onFocus} />
      );
      const input = getByTestId('render-input-id');
      fireEvent.blur(input);
      expect(onBlur).toHaveBeenCalled();
      fireEvent.focus(input);
      expect(onFocus).toHaveBeenCalled();
    });
    it('should trigger onUpdateValue when value changes', () => {
      const onUpdateValueFn = jest.fn();
      const renderInputFn = jest.fn(({ onUpdateValue, value }) =>
        onUpdateValue(value)
      );

      const { getByLabelText } = renderApp(
        <TestComponent
          renderInput={renderInputFn}
          onUpdateValue={onUpdateValueFn}
        />
      );
      const input = getByLabelText('Input value');
      const event = { target: { value: 'YG' } };
      fireEvent.change(input, event);
      expect(renderInputFn).toHaveBeenCalledTimes(2);
      expect(renderInputFn).toHaveBeenCalledWith(
        expect.objectContaining({
          value: 'YG',
        })
      );
      expect(onUpdateValueFn).toHaveBeenCalledWith('YG');
    });
    it('should trigger onUpdateValue with null if empty string', () => {
      const onUpdateValueFn = jest.fn();
      const renderInputFn = jest.fn(({ onUpdateValue }) => onUpdateValue(null));

      renderApp(
        <TestComponent
          renderInput={renderInputFn}
          onUpdateValue={onUpdateValueFn}
        />
      );
      expect(onUpdateValueFn).toHaveBeenCalledWith(null);
    });
  });
});
