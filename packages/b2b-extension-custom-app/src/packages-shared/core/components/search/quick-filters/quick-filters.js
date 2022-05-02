import React from 'react';
import PropTypes from 'prop-types';
import { SelectInput, Spacings, Text } from '@commercetools-frontend/ui-kit';
import { FormattedMessage } from 'react-intl';
import { QUICK_FILTERS_FOR_DATES } from '../standard-quick-filter-definitions';
import messages from './messages';
import styles from './quick-filters.mod.css';

export class QuickFilters extends React.PureComponent {
  static displayName = 'QuickFilters';

  static propTypes = {
    onChange: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    values: PropTypes.objectOf(
      PropTypes.arrayOf(
        PropTypes.shape({
          type: PropTypes.string.isRequired,
          value: PropTypes.any,
        })
      ).isRequired
    ),
    definitions: PropTypes.array,
  };

  handleChange = event => {
    const selectedQuickFilter = this.props.definitions.find(
      quickFilter => quickFilter.value === event.target.value
    );

    if (selectedQuickFilter) {
      // If the selected value is "none" we need to clear the quick filter
      if (event.target.value === QUICK_FILTERS_FOR_DATES.none)
        this.props.onRemove(selectedQuickFilter.filter);
      // if the selected value is one of the quick filters we search directly
      // by the selected option
      else {
        this.props.onChange(selectedQuickFilter.filter);
      }
    }
  };

  getValue = () => {
    const activeQuickFilter =
      Object.keys(this.props.values).length === 1 &&
      this.props.values.createdAt?.length === 1 &&
      this.props.values.createdAt?.find(
        filter => filter.value?.quickFilterValue
      );

    return (
      activeQuickFilter?.value?.quickFilterValue || QUICK_FILTERS_FOR_DATES.none
    );
  };

  render() {
    const hasValues = Object.keys(this.props.values).length > 0;
    return (
      <div className={hasValues ? '' : styles.container}>
        <Spacings.InsetSquish scale="s">
          <Spacings.Inline scale="s" alignItems="center">
            <Text.Body isBold>
              <FormattedMessage {...messages.title} />
            </Text.Body>
            <SelectInput
              value={this.getValue()}
              onChange={this.handleChange}
              options={this.props.definitions}
              horizontalConstraint="m"
            />
          </Spacings.Inline>
        </Spacings.InsetSquish>
      </div>
    );
  }
}

export default QuickFilters;
