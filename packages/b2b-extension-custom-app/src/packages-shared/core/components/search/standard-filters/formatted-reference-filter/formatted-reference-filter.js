import React from 'react';
import PropTypes from 'prop-types';
import createReferenceSingleFilter from '../reference-filter';

export default function createFormattedReferenceFilter(options) {
  const isMulti = options.isMulti;
  const ReferenceFilter = createReferenceSingleFilter(options);

  class FormattedReferenceFilter extends React.PureComponent {
    static propTypes = {
      // The "value" corresponds to the `id` (or a list of `id`s) of the item.
      value: isMulti ? PropTypes.arrayOf(PropTypes.string) : PropTypes.string,
      readItemFromCache: PropTypes.func.isRequired,
      intl: PropTypes.shape({ formatMessage: PropTypes.func.isRequired })
        .isRequired,
    };

    mapValueToItem = id => {
      const cachedItem = this.props.readItemFromCache(id);
      return cachedItem || { id };
    };

    formatValueToItem = () => {
      if (isMulti) {
        return this.props.value
          ? this.props.value.map(this.mapValueToItem).filter(Boolean)
          : [];
      }
      return this.props.value ? this.mapValueToItem(this.props.value) : null;
    };

    render() {
      return (
        <ReferenceFilter
          {...this.props}
          value={this.formatValueToItem()}
          mapValueToItem={this.mapValueToItem}
        />
      );
    }
  }
  FormattedReferenceFilter.displayName = isMulti
    ? 'FormattedReferenceFilterMulti'
    : 'FormattedReferenceFilterSingle';
  return FormattedReferenceFilter;
}
