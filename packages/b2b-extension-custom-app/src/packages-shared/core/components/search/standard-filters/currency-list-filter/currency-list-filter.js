import { compose, withProps } from 'recompose';
import React from 'react';
import PropTypes from 'prop-types';
import { defaultMemoize } from 'reselect';
import { withApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { withCurrencies } from '@commercetools-frontend/l10n';
import { createEnumSingleFilter } from '../enum-filters';

export const createCurrencySingleFilter = defaultMemoize(
  createEnumSingleFilter
);

export const currenciesToOptions = defaultMemoize(currencies =>
  Object.entries(currencies).map(([code, value]) => ({
    value: code.toUpperCase(),
    // E.g. `EUR - Euro ($)`
    label: `${code.toUpperCase()} - ${value.label} (${value.symbol})`,
  }))
);

export class CurrencyListFilter extends React.PureComponent {
  static displayName = 'CurrencyListFilter';

  static propTypes = {
    locale: PropTypes.string.isRequired,
    isMulti: PropTypes.bool.isRequired,
    isSearchable: PropTypes.bool.isRequired,
    // withCurrencies
    currencies: PropTypes.objectOf(
      PropTypes.shape({ label: PropTypes.string, symbol: PropTypes.string })
    ),
  };

  static defaultProps = {
    isMulti: false,
    isSearchable: false,
  };

  render() {
    return createCurrencySingleFilter({
      options: currenciesToOptions(this.props.currencies),
      isMulti: this.props.isMulti,
      isSearchable: this.props.isSearchable,
    })(this.props);
  }
}

export default function createCountryListSingleFilter({
  isMulti = false,
  isSearchable = false,
}) {
  return compose(
    withProps(() => ({
      isMulti,
      isSearchable,
    })),
    withApplicationContext(applicationContext => ({
      locale: applicationContext.user.locale,
    })),
    withCurrencies(ownProps => ownProps.locale)
  )(CurrencyListFilter);
}
