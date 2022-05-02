import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { compose } from 'recompose';
import has from 'lodash.has';
import omit from 'lodash.omit';
import isNil from 'lodash.isnil';
import startCase from 'lodash.startcase';
import isFunction from 'lodash.isfunction';
import { deepEqual } from 'fast-equals';
import isEmptyFilterDefault from '../../../../utils/filters/is-empty';
import injectTracking from '../../tracking/inject-tracking';
import trackingEvents from './tracking-events';
import { SEARCH_FILTERS_EVENTS } from '..';

function mergeFieldToCorrectPosition(fields, fieldName, fieldValue) {
  if (has(fields, fieldName))
    return Object.keys(fields).reduce(
      (acc, name) => ({
        ...acc,
        ...(name === fieldName && fieldValue.length > 0
          ? { [name]: fieldValue }
          : { [name]: fields[name] }),
      }),
      {}
    );

  // If the key is not present yet, add it at the bottom
  return { ...fields, [fieldName]: fieldValue };
}

function removeFilterFromField(filteredFields, fieldName, index) {
  const previousFilters = filteredFields[fieldName] || [];
  const nextFilters = [
    ...previousFilters.slice(0, index),
    ...previousFilters.slice(index + 1),
  ];
  return nextFilters.length > 0
    ? mergeFieldToCorrectPosition(filteredFields, fieldName, nextFilters)
    : omit(filteredFields, fieldName);
}

export class FiltersContainer extends React.PureComponent {
  static displayName = 'FiltersContainer';

  static propTypes = {
    onUpdateSearch: PropTypes.func.isRequired,
    children: PropTypes.func.isRequired,
    onChange: PropTypes.func,
    filteredFields: PropTypes.objectOf(
      PropTypes.arrayOf(
        PropTypes.shape({
          type: PropTypes.string.isRequired,
          value: PropTypes.any,
        })
      )
    ),
    searchText: PropTypes.string,
    // Describes the filter options available for each field
    fieldDefinitions: PropTypes.objectOf(
      PropTypes.shape({
        filterTypes: PropTypes.objectOf(
          PropTypes.shape({
            filterComponent: PropTypes.func.isRequired,
            tagComponent: PropTypes.func.isRequired,
            validator: PropTypes.func,
            label: PropTypes.string.isRequired,
          })
        ).isRequired,
      })
    ).isRequired,
    trackingPrefix: PropTypes.string,
    intl: PropTypes.object,
    isEditMode: PropTypes.bool.isRequired,
    track: PropTypes.func.isRequired,
  };

  state = this.computeInitialState();
  static defaultProps = {
    onChange: () => {},
  };
  computeInitialState() {
    return {
      filteredFields: this.props.filteredFields,
      searchText: this.props.searchText,
      hasChangesInFilters: false,
      hasChangesInTextSearch: false,
    };
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!nextProps.isEditMode)
      this.setState({
        filteredFields: nextProps.filteredFields,
      });
  }

  getTrackingCategory = category =>
    [this.props.trackingPrefix, category].join('-');

  detectChangesInFilters = (nextState, prevState) => {
    const changesInFiltersDraft =
      !isNil(nextState.filteredFields) &&
      !deepEqual(prevState.filteredFields, nextState.filteredFields, {
        strict: true,
      });

    const changesInSearchTextDraft =
      !isNil(nextState.searchText) &&
      nextState.searchText !== prevState.searchText;

    const changesInFiltersApplied =
      !isNil(nextState.filteredFields) &&
      !deepEqual(nextState.filteredFields, this.props.filteredFields, {
        strict: true,
      });

    const changesInSearchTextApplied =
      // prevents false positives when passed from null to empty
      !isNil(nextState.searchText) &&
      nextState.searchText !== '' &&
      nextState.searchText !== this.props.searchText &&
      // prevents false positives when passed from null to empty
      !(isNil(this.props.searchText) && nextState.searchText.length === '');

    if (changesInFiltersDraft || changesInSearchTextDraft)
      return {
        hasChangesInFilters: changesInFiltersApplied,
        hasChangesInTextSearch: changesInSearchTextApplied,
        ...nextState,
      };

    return nextState;
  };

  handleUpdateFilterForField = ({ fieldName, index, filter }) => {
    this.props.track(
      trackingEvents.changeFilter.event,
      this.getTrackingCategory(trackingEvents.changeFilter.category),
      startCase(fieldName)
    );

    this.props.onChange({
      fieldName,
      fieldValue: filter,
      eventName: SEARCH_FILTERS_EVENTS.updateFilterValue,
    });

    this.setState(prevState => {
      const previousFilters = prevState.filteredFields[fieldName] || [];
      const fieldValue = [
        ...previousFilters.slice(0, index),
        filter,
        ...previousFilters.slice(index + 1),
      ];

      const newState = {
        filteredFields: mergeFieldToCorrectPosition(
          prevState.filteredFields,
          fieldName,
          fieldValue
        ),
      };

      return this.detectChangesInFilters(newState, prevState);
    });
  };

  // Specific callback for quick filters since we need to trigger the search
  // right after the user selects one option. That's why in the `setState` callback
  // we need to invoke `handleApplyFilters`
  handleUpdateQuickFilterForField = ({ fieldName, filter: fieldValue }) => {
    this.props.track(
      trackingEvents.selectQuickFilter.event,
      this.getTrackingCategory(trackingEvents.selectQuickFilter.category),
      startCase(fieldValue.value.quickFilterValue)
    );

    this.props.onChange({
      fieldName,
      fieldValue,
      eventName: SEARCH_FILTERS_EVENTS.updateFilterValue,
    });

    this.setState(
      prevState => {
        const nextFieldValue = [fieldValue];

        // Note that the nextState will be only the applied quick filter since the
        // expected behaviour is that a quick filter replaces all previous applied
        // filters
        const nextState = {
          filteredFields: {
            [fieldName]: nextFieldValue,
          },
        };

        return this.detectChangesInFilters(nextState, prevState);
      },
      () => {
        this.handleApplyFilters();
      }
    );
  };

  handleCancelFilterChanges = () => {
    this.props.onChange({
      eventName: SEARCH_FILTERS_EVENTS.cancelFilterChanges,
    });
    this.setState(this.computeInitialState());
  };

  handleRemoveFilterFromField = ({ fieldName, index }) => {
    this.props.onChange({
      eventName: SEARCH_FILTERS_EVENTS.removeFilterFromField,
      fieldName,
    });
    this.setState(prevState => {
      const newState = {
        filteredFields: removeFilterFromField(
          prevState.filteredFields,
          fieldName,
          index
        ),
      };

      return this.detectChangesInFilters(newState, prevState);
    });
  };

  handleClearAllFilters = () => {
    this.props.onChange({
      eventName: SEARCH_FILTERS_EVENTS.clearAllFilters,
    });
    this.setState(prevState =>
      this.detectChangesInFilters({ filteredFields: {} }, prevState)
    );
  };

  handleAddFilterToField = ({ fieldName, filter, index }) => {
    this.props.onChange({
      eventName: SEARCH_FILTERS_EVENTS.addFilterToField,
      fieldName,
      filter,
    });
    this.setState(prevState => {
      const previousFilters = prevState.filteredFields[fieldName] || [];
      const fieldValue = [
        ...previousFilters.slice(0, index),
        filter,
        ...previousFilters.slice(index),
      ];
      const newState = {
        filteredFields: mergeFieldToCorrectPosition(
          prevState.filteredFields,
          fieldName,
          fieldValue
        ),
      };

      return this.detectChangesInFilters(newState, prevState);
    });
  };

  handleClearFiltersFromField = ({ fieldName }) => {
    this.props.onChange({
      eventName: SEARCH_FILTERS_EVENTS.clearFiltersFromField,
      fieldName,
    });
    this.setState(prevState =>
      this.detectChangesInFilters(
        {
          filteredFields: omit(prevState.filteredFields, fieldName),
        },
        prevState
      )
    );
  };

  handleAddField = ({ fieldName }) => {
    this.props.track(
      trackingEvents.addFilter.event,
      this.getTrackingCategory(trackingEvents.addFilter.category),
      startCase(fieldName)
    );

    this.props.onChange({
      eventName: SEARCH_FILTERS_EVENTS.addField,
      fieldName,
    });
    this.setState(prevState => {
      const fieldValue = [
        {
          type: Object.keys(
            this.props.fieldDefinitions[fieldName].filterTypes
          )[0],
          value: null,
        },
      ];
      const newState = {
        filteredFields: mergeFieldToCorrectPosition(
          prevState.filteredFields,
          fieldName,
          fieldValue
        ),
      };

      return this.detectChangesInFilters(newState, prevState);
    });
  };

  /**
   * @type Boolean returns whether or not all filters are valid, used to prevent
   *       filter container closing if there are invalid filters
   */
  handleApplyFilters = ({ removeEmptyFilters = false } = {}) => {
    const getFilterOfType = (fieldName, fieldType) =>
      this.props.fieldDefinitions[fieldName].filterTypes[fieldType];
    const filterEmptyFilters = fieldName => filter => {
      const filterForType = getFilterOfType(fieldName, filter.type);
      // Allowing to overwrite isEmptyFilter on filter definition level while
      // defaulting to isEmptyFilterDefault
      const isEmptyFilter = isFunction(filterForType.isEmptyFilter)
        ? filterForType.isEmptyFilter
        : isEmptyFilterDefault;

      return !isEmptyFilter(filter);
    };
    // filter out empty filters, and any fields without any filters
    const filteredFields = removeEmptyFilters
      ? Object.entries(this.state.filteredFields).reduce(
          (fields, [fieldName, fieldValues]) => {
            const nonEmptyFilters = fieldValues.filter(
              filterEmptyFilters(fieldName)
            );

            if (nonEmptyFilters.length)
              return { ...fields, [fieldName]: nonEmptyFilters };

            return fields;
          },
          {}
        )
      : this.state.filteredFields;

    // iterate through validators and collect errors
    const validatedFilters = Object.entries(filteredFields).reduce(
      (acc, [fieldName, fieldValues]) => {
        const fieldWithErrors = fieldValues
          .filter(filterEmptyFilters(fieldName))
          .map(({ type, value }) => {
            const filterOfType = getFilterOfType(fieldName, type);
            const { validator } = filterOfType;

            if (!validator) return { type, value };

            return {
              type,
              value,
              error: validator({ type, value }, this.props.intl),
            };
          });
        const updatedFilters = mergeFieldToCorrectPosition(
          acc.updatedFilters,
          fieldName,
          fieldWithErrors
        );

        const numberOfErrors = fieldWithErrors.filter(({ error }) => error)
          .length;

        return {
          isValid: acc.isValid && numberOfErrors === 0,
          updatedFilters,
        };
      },
      { isValid: true, updatedFilters: filteredFields }
    );

    if (validatedFilters.isValid) {
      this.props.onUpdateSearch({
        filters: filteredFields,
        searchText: this.state.searchText,
        page: 1,
      });
      this.setState({
        hasChangesInFilters: false,
        hasChangesInTextSearch: false,
      });
      const eventName = removeEmptyFilters
        ? SEARCH_FILTERS_EVENTS.applyFiltersAndRemoveEmpty
        : SEARCH_FILTERS_EVENTS.applyFilters;
      this.props.onChange({
        eventName,
      });
    } else
      this.setState(prevState =>
        this.detectChangesInFilters(
          {
            filteredFields: validatedFilters.updatedFilters,
          },
          prevState
        )
      );

    return validatedFilters.isValid;
  };

  handleRemoveFilterTagFromField = ({ fieldName, index }) => {
    this.props.track(
      trackingEvents.removeFilter.event,
      this.getTrackingCategory(trackingEvents.removeFilter.category),
      startCase(fieldName)
    );

    this.props.onChange({
      eventName: SEARCH_FILTERS_EVENTS.removeFilterTagFromField,
    });
    this.setState(prevState => {
      const nextFilteredFields = removeFilterFromField(
        prevState.filteredFields,
        fieldName,
        index
      );

      // update the filters straight away
      this.props.onUpdateSearch({
        filters: nextFilteredFields,
        searchText: this.state.searchText,
        page: 1,
      });
      return { filteredFields: nextFilteredFields, hasChangesInFilters: false };
    });
  };

  handleChangeSearchText = searchText => {
    this.setState(prevState =>
      this.detectChangesInFilters({ searchText }, prevState)
    );
  };

  shouldShowClearAll = () =>
    (this.state.filteredFields &&
      Object.keys(this.state.filteredFields).length > 0) ||
    (!isNil(this.state.searchText) && this.state.searchText !== '');

  handleClearAll = () => {
    this.props.onChange({
      eventName: SEARCH_FILTERS_EVENTS.clearAll,
    });
    this.setState({ filteredFields: {}, searchText: null }, () => {
      this.handleApplyFilters();
    });
  };

  render() {
    return (
      <div>
        {this.props.children({
          onCancelFilterChanges: this.handleCancelFilterChanges,
          onApplyFilters: this.handleApplyFilters,
          onUpdateFilterForField: this.handleUpdateFilterForField,
          onUpdateQuickFilterForField: this.handleUpdateQuickFilterForField,
          onRemoveFilterFromField: this.handleRemoveFilterFromField,
          onAddFilterToField: this.handleAddFilterToField,
          onAddField: this.handleAddField,
          onClearFiltersFromField: this.handleClearFiltersFromField,
          onRemoveFilterTagFromField: this.handleRemoveFilterTagFromField,
          filteredFields: this.state.filteredFields,
          searchText: this.state.searchText,
          hasChangesInFilters: this.state.hasChangesInFilters,
          showOnClearAll: this.shouldShowClearAll(),
          onClearAll: this.handleClearAll,
          hasChangesInTextSearch: this.state.hasChangesInTextSearch,
          onChangeSearchText: this.handleChangeSearchText,
        })}
      </div>
    );
  }
}

export default compose(injectTracking, injectIntl)(FiltersContainer);
