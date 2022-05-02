import React from 'react';
import PropTypes from 'prop-types';
import { ApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import {
  DateTimeInput,
  DateInput,
  TimeInput,
} from '@commercetools-frontend/ui-kit';
import SingleFilter from '../single-filter';
import RangeFilter from '../range-filter';

// Date and DateTime inputs need a min width in order to properly
// show the calendar picker.
const minWidth = '268px';

export const createDateFilter = ({
  isRange,
  timeScale,
  horizontalConstraint = 'scale',
} = {}) => {
  const FilterType = isRange ? RangeFilter : SingleFilter;
  const DateFilter = props => (
    <FilterType
      renderInput={({ value, onUpdateValue, hasError, onBlur }) => (
        <ApplicationContext
          render={({ user }) => {
            if (timeScale === 'datetime')
              return (
                <div style={{ minWidth }}>
                  <DateTimeInput
                    value={value || ''}
                    onChange={event => onUpdateValue(event.target.value)}
                    onBlur={onBlur}
                    horizontalConstraint={horizontalConstraint}
                    isDisabled={props.disabled}
                    hasError={hasError}
                    timeZone={user?.timeZone || 'UTC'}
                  />
                </div>
              );
            if (timeScale === 'date')
              return (
                <div style={{ minWidth }}>
                  <DateInput
                    value={value || ''}
                    onChange={event => onUpdateValue(event.target.value)}
                    onBlur={onBlur}
                    horizontalConstraint={horizontalConstraint}
                    isDisabled={props.disabled}
                    hasError={hasError}
                    timeZone={user?.timeZone}
                  />
                </div>
              );
            if (timeScale === 'time')
              return (
                <TimeInput
                  value={value || ''}
                  onChange={event => onUpdateValue(event.target.value)}
                  onBlur={onBlur}
                  horizontalConstraint={horizontalConstraint}
                  isDisabled={props.disabled}
                  hasError={hasError}
                  timeZone={user?.timeZone}
                />
              );
            return null;
          }}
        />
      )}
      value={props.value}
      error={props.error}
      onUpdateValue={props.onUpdateFilter}
    />
  );
  DateFilter.displayName = 'DateFilter';
  DateFilter.defaultProps = {
    disabled: false,
  };
  DateFilter.propTypes = {
    onUpdateFilter: PropTypes.func.isRequired,
    options: PropTypes.shape({
      inputFormat: PropTypes.string,
      time: PropTypes.bool,
    }),
    disabled: PropTypes.bool,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    value: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.string,
      PropTypes.shape({
        from: PropTypes.string,
        to: PropTypes.string,
      }),
    ]),
    error: PropTypes.any,
  };
  return DateFilter;
};

export const DateSingleFilter = createDateFilter({ timeScale: 'date' });
DateSingleFilter.displayName = 'DateSingleFilter';

export const DateMultipleFilter = createDateFilter({
  isMultiple: true,
  timeScale: 'date',
});

export const TimeSingleFilter = createDateFilter({ timeScale: 'time' });
TimeSingleFilter.displayName = 'TimeSingleFilter';

export const TimeMultipleFilter = createDateFilter({
  isMultiple: true,
  timeScale: 'time',
});
TimeMultipleFilter.displayName = 'TimeMultipleFilter';

export const DateTimeSingleFilter = createDateFilter({ timeScale: 'datetime' });
DateTimeSingleFilter.displayName = 'DateTimeSingleFilter';

export const DateTimeMultipleFilter = createDateFilter({
  timeScale: 'datetime',
  isMultiple: true,
});
DateTimeMultipleFilter.displayName = 'DateTimeMultipleFilter';

export const DateRangeFilter = createDateFilter({
  isRange: true,
  timeScale: 'date',
});
DateRangeFilter.displayName = 'DateRangeFilter';

export const TimeRangeFilter = createDateFilter({
  isRange: true,
  timeScale: 'time',
});
TimeRangeFilter.displayName = 'TimeRangeFilter';

export const DateTimeRangeFilter = createDateFilter({
  isRange: true,
  timeScale: 'datetime',
  isMultiple: true,
});
DateTimeRangeFilter.displayName = 'DateTimeRangeFilter';
