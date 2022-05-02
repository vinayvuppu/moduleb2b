import { compose, withProps } from 'recompose';
import React from 'react';
import PropTypes from 'prop-types';
import { defaultMemoize } from 'reselect';
import { withApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { withCountries, countriesShape } from '@commercetools-frontend/l10n';
import { createEnumSingleFilter } from '../enum-filters';

export const getCountrySingleFilter = defaultMemoize(createEnumSingleFilter);

export const countriesToOptions = defaultMemoize(countries =>
  Object.entries(countries).map(([code, label]) => ({
    value: code.toUpperCase(),
    label: `${label} (${code.toUpperCase()})`,
  }))
);

export class CountryListFilter extends React.PureComponent {
  static displayName = 'CountryListFilter';

  static propTypes = {
    locale: PropTypes.string.isRequired,
    isMulti: PropTypes.bool.isRequired,
    isSearchable: PropTypes.bool.isRequired,
    countries: countriesShape.isRequired,
  };

  static defaultProps = {
    isMulti: false,
    isSearchable: false,
  };

  render() {
    return getCountrySingleFilter({
      options: countriesToOptions(this.props.countries),
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
    withCountries(ownProps => ownProps.locale)
  )(CountryListFilter);
}
