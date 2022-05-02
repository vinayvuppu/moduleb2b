import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import {
  NumberInput,
  PrimaryButton,
  Spacings,
  SelectInput,
} from '@commercetools-frontend/ui-kit';
import styles from './quantity-selector.mod.css';
import messages from './messages';

const propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  quantity: PropTypes.string,
  menuPortalTarget: PropTypes.object,
  menuPortalZIndex: PropTypes.number,
  maxSelectableValue: PropTypes.number.isRequired,
};
const defaultProps = {
  quantity: '1',
  maxSelectableValue: 10,
};

const getArrayWithValues = maxValue => {
  const values = [];
  for (let i = 1; i < maxValue; i += 1) {
    values.push({
      value: String(i),
      label: i,
    });
  }
  return values;
};

export const createQuantityOptions = maxValue => [
  ...getArrayWithValues(maxValue),
  {
    label: `${maxValue}+`,
    value: String(maxValue),
  },
];

const QuantitySelector = props => {
  const intl = useIntl();

  // initialize SelectInput options
  const quantityOptions = React.useMemo(
    () => createQuantityOptions(props.maxSelectableValue),
    [props.maxSelectableValue]
  );

  const [numberValue, setNumberValue] = React.useState(props.quantity);

  const isNumericInputEnabled = React.useRef(false);

  // GIVEN we are displaying the SelectInput,
  // and we set the quantity to maxSelectableValue,
  // THEN we must switch from the SelectInput to the NumberInput
  // and then update the numberValue state, used by NumberInput
  // which will trigger the re-render
  React.useEffect(() => {
    if (
      !isNumericInputEnabled.current &&
      props.quantity >= props.maxSelectableValue
    ) {
      isNumericInputEnabled.current = true;
      setNumberValue(props.quantity);
    }
  }, [props.maxSelectableValue, props.quantity]);

  const handleSelectChange = event => {
    props.onChange(event.target.value);
  };

  const handleNumericInputChange = event => {
    setNumberValue(event.target.value);
  };

  const handleApplyNumericInputChange = () => {
    if (numberValue < props.maxSelectableValue) {
      isNumericInputEnabled.current = false;
    }
    props.onChange(numberValue);
  };

  return props.quantity < props.maxSelectableValue ? (
    <SelectInput
      id={props.id}
      name={props.name}
      value={props.quantity}
      options={quantityOptions}
      onChange={handleSelectChange}
      components={{
        // eslint-disable-next-line react/display-name
        Option: optionProps => (
          <React.Fragment>
            {optionProps.value === `${props.maxSelectableValue}` && (
              <span className={styles.separator} />
            )}
            <SelectInput.Option {...optionProps} />
          </React.Fragment>
        ),
      }}
      menuPortalTarget={props.menuPortalTarget}
      menuPortalZIndex={props.menuPortalZIndex}
      data-testid="quantity-selector-select-input"
    />
  ) : (
    <Spacings.Inline alignItems="center">
      <NumberInput
        id={props.id}
        name={props.name}
        value={numberValue}
        onChange={handleNumericInputChange}
        data-testid="quantity-selector-number-input"
      />
      <PrimaryButton
        label={intl.formatMessage(messages.apply)}
        onClick={handleApplyNumericInputChange}
        isDisabled={numberValue === props.quantity}
      />
    </Spacings.Inline>
  );
};
QuantitySelector.displayName = 'QuantitySelector';
QuantitySelector.propTypes = propTypes;
QuantitySelector.defaultProps = defaultProps;

export default QuantitySelector;
