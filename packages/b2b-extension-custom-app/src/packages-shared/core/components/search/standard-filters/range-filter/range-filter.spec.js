import React from 'react';
import PropTypes from 'prop-types';
import {
  fireEvent,
  renderApp,
} from '@commercetools-frontend/application-shell/test-utils';
import RangeFilter, { processUpdateValue } from './range-filter';

const renderInput = ({
  onBlur,
  onFocus,
  onUpdateValue,
  placeholder,
  value,
}) => (
  <input
    className="rendered-input"
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
    value: this.props.value,
  };

  handleChange = ({ to, from }) => {
    if (to) {
      this.setState(prevState => ({
        value: {
          ...prevState.value,
          to,
        },
      }));
    } else {
      this.setState(prevState => ({
        value: {
          ...prevState.value,
          from,
        },
      }));
    }
  };

  render() {
    return (
      <div>
        <label htmlFor="input-to">Input to value</label>
        <input
          id="input-to"
          value={this.state.value.to}
          onChange={evt => this.handleChange({ to: evt.target.value })}
        />
        <label htmlFor="input-from">Input from value</label>
        <input
          id="input-from"
          value={this.state.value.from}
          onChange={evt => this.handleChange({ from: evt.target.value })}
        />
        <RangeFilter
          renderInput={this.props.renderInput}
          value={this.state.value}
          onUpdateValue={this.props.onUpdateValue}
          onBlur={this.props.onBlur}
          onFocus={this.props.onFocus}
          error={this.props.error}
        />
      </div>
    );
  }
}

TestComponent.defaultProps = {
  onUpdateValue: () => {},
  renderInput,
  value: { from: '0', to: '10' },
};

TestComponent.propTypes = {
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  renderInput: PropTypes.func,
  onUpdateValue: PropTypes.func.isRequired,
  value: PropTypes.shape({
    to: PropTypes.string.isRequired,
    from: PropTypes.string.isRequired,
  }).isRequired,
  error: PropTypes.shape({
    to: PropTypes.string,
    from: PropTypes.string,
  }),
};

describe('rendering', () => {
  it('should render both inputs', () => {
    const { container } = renderApp(<TestComponent />);
    expect(container.querySelectorAll('.rendered-input')).toHaveLength(2);
  });
  it('should render a `to` error message', () => {
    const errorMessage = 'A to error';
    const { queryByText } = renderApp(
      <TestComponent error={{ to: errorMessage }} />
    );
    expect(queryByText(errorMessage)).toBeInTheDocument();
  });
  it('should render a `from` error message', () => {
    const errorMessage = 'A from error';
    const { queryByText } = renderApp(
      <TestComponent error={{ from: errorMessage }} />
    );
    expect(queryByText(errorMessage)).toBeInTheDocument();
  });
});

describe('callbacks', () => {
  it('should trigger onBlur and onFocus', () => {
    const onBlur = jest.fn();
    const onFocus = jest.fn();
    const { container } = renderApp(
      <TestComponent onBlur={onBlur} onFocus={onFocus} />
    );
    const inputs = container.querySelectorAll('.rendered-input');
    // with first input
    fireEvent.blur(inputs[0]);
    fireEvent.focus(inputs[0]);
    expect(onFocus).toHaveBeenCalledTimes(1);
    expect(onBlur).toHaveBeenCalledTimes(1);
    // with second input
    fireEvent.blur(inputs[1]);
    fireEvent.focus(inputs[1]);
    expect(onFocus).toHaveBeenCalledTimes(2);
    expect(onBlur).toHaveBeenCalledTimes(2);
  });
  it('should trigger onUpdateValue when value changes', () => {
    const onUpdateValueFn = jest.fn();
    const renderInputFn = jest.fn(({ onUpdateValue, value }) => {
      return onUpdateValue(value);
    });

    const { getByLabelText } = renderApp(
      <TestComponent
        renderInput={renderInputFn}
        onUpdateValue={onUpdateValueFn}
      />
    );
    // first input
    const fromInput = getByLabelText('Input from value');
    const event = { target: { value: 'YG' } };
    fireEvent.change(fromInput, event);
    expect(renderInputFn).toHaveBeenCalledWith(
      expect.objectContaining({
        value: 'YG',
      })
    );
    // second input
    const toInput = getByLabelText('Input to value');
    fireEvent.change(toInput, { target: { value: 'YT' } });
    expect(renderInputFn).toHaveBeenCalledWith(
      expect.objectContaining({
        value: 'YT',
      })
    );
  });
});

describe('processUpdateValue', () => {
  it('should set "to" value to null if "to" value is an empty string', () => {
    const input = { from: 'some value', to: '' };
    expect(processUpdateValue(input)).toEqual({
      from: 'some value',
      to: null,
    });
  });
  it('should set "from" value to null if "from" value is an empty string', () => {
    const input = { from: '', to: 'some value' };
    expect(processUpdateValue(input)).toEqual({
      from: null,
      to: 'some value',
    });
  });
  it('should return the value unmodified if it is valid', () => {
    const input = { from: 'some value', to: 'some other value' };
    expect(processUpdateValue(input)).toEqual(input);
  });
});
