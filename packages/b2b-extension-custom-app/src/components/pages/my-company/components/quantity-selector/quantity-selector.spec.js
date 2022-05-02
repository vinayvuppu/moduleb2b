import React from 'react';
import {
  renderApp,
  fireEvent,
} from '@commercetools-frontend/application-shell/test-utils';
import QuantitySelector, { createQuantityOptions } from './quantity-selector';

const createTestProps = props => ({
  id: 'quantity-selector',
  onChange: jest.fn(),
  ...props,
});

const render = (props = createTestProps()) => {
  return renderApp(
    <React.Fragment>
      <label htmlFor={props.id}>Quantity Select</label>
      <QuantitySelector id={props.id} {...props} />
    </React.Fragment>
  );
};

describe('createQuantityOptions', () => {
  it('should return an array with the valid options', () => {
    expect(createQuantityOptions(3)).toEqual([
      { label: 1, value: '1' },
      { label: 2, value: '2' },
      { label: '3+', value: '3' },
    ]);
  });
});

describe('QuantitySelector', () => {
  describe('when rendering with the default props', () => {
    it('should render the SelectInput', () => {
      const rendered = render();

      expect(
        rendered.queryByTestId('quantity-selector-select-input')
      ).toBeInTheDocument();
    });
    it('should render the quantity', () => {
      const rendered = render();

      expect(rendered.queryByText('1')).toBeInTheDocument();
    });
    describe('when changing quantity', () => {
      it('should show the option 10+', () => {
        const rendered = render();

        const selectInput = rendered.getByLabelText('Quantity Select');

        fireEvent.focus(selectInput);
        fireEvent.keyDown(selectInput, { key: 'ArrowDown' });

        expect(rendered.queryByText('10+')).toBeInTheDocument();
      });
    });
    describe('when selecting an option', () => {
      it('should call the onChange fn with the selected quantity', () => {
        const onChange = jest.fn();
        const rendered = render(createTestProps({ onChange }));

        const selectInput = rendered.getByLabelText('Quantity Select');

        fireEvent.focus(selectInput);
        fireEvent.keyDown(selectInput, { key: 'ArrowDown' });

        fireEvent.click(rendered.getByText('5'));

        expect(onChange).toHaveBeenCalledWith('5');
      });
    });
  });
  describe('when rendering with a quantity greater or equal than maxSelectableValue', () => {
    const testProps = {
      quantity: '10',
      maxSelectableValue: 10,
    };

    it('should render the NumberInput', () => {
      const rendered = render(createTestProps(testProps));

      expect(
        rendered.queryByTestId('quantity-selector-number-input')
      ).toBeInTheDocument();
    });
    it('should render the apply button', () => {
      const rendered = render(createTestProps(testProps));

      expect(rendered.queryByLabelText('Apply')).toBeInTheDocument();
    });
    describe('when the value is unchanged', () => {
      it('the apply button should be disabled', () => {
        const rendered = render(createTestProps(testProps));

        expect(rendered.queryByLabelText('Apply')).toBeDisabled();
      });
    });
    describe('when setting the input to a different value', () => {
      it('the apply button should be enabled', () => {
        const rendered = render(createTestProps(testProps));

        const selectInput = rendered.getByLabelText('Quantity Select');

        fireEvent.change(selectInput, {
          target: { value: '15' },
        });

        expect(rendered.queryByLabelText('Apply')).toBeEnabled();
      });
      describe('when applying a value', () => {
        it('should call the onChange fn with the selected quantity', () => {
          const onChange = jest.fn();
          const rendered = render(createTestProps({ ...testProps, onChange }));

          const selectInput = rendered.getByLabelText('Quantity Select');

          fireEvent.change(selectInput, {
            target: { value: '15' },
          });

          fireEvent.click(rendered.queryByLabelText('Apply'));

          expect(onChange).toHaveBeenCalledWith('15');
        });
      });
    });
  });
});
