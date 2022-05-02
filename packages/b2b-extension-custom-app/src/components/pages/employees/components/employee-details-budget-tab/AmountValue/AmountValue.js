import React from 'react';
import PropTypes from 'prop-types';
import { formatMoney } from '@commercetools-local/utils/formats/money';
import { useIntl } from 'react-intl';
import { Text, Spacings } from '@commercetools-frontend/ui-kit';

const AmountValue = ({ amount, label, noValueLabel, errorOnNegative }) => {
  const intl = useIntl();

  const getValue = () => {
    if (!amount) return noValueLabel;
    if (amount.centAmount <= 0 && errorOnNegative)
      return <span style={{ color: 'red' }}>{formatMoney(amount, intl)}</span>;

    return formatMoney(amount, intl);
  };

  return (
    <Spacings.Stack>
      <Text.Body isBold>{label}</Text.Body>
      <Text.Headline as="h3" isBold>
        {getValue()}
      </Text.Headline>
    </Spacings.Stack>
  );
};

AmountValue.propTypes = {
  amount: PropTypes.shape({
    centAmount: PropTypes.number.isRequired,
  }),
  label: PropTypes.string.isRequired,
  noValueLabel: PropTypes.string.isRequired,
  errorOnNegative: PropTypes.bool,
};

AmountValue.defaultProps = {
  errorOnZero: false,
};

AmountValue.displayName = 'AmountValue';

export default AmountValue;
