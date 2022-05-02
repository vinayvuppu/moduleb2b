import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';
import { FILTER_TYPES } from '../../../../constants';
import SingleFilterTag from '../single-filter-tag';
import RangeFilterTag from '../range-filter-tag';

const formatDateTime = 'YYYY-MM-DDTHH:mm:ss.SSSZ';
const formatDateTimeTag = 'YYYY-MM-DD HH:mm';
const formatTime = 'HH:mm:ss.SSS';
const formatTimeTag = 'HH:mm';

const renderLocalizedValue = value =>
  Object.keys(value)
    .map(locale => `${value[locale]} (${locale.toUpperCase()})`)
    .join(' ');

export const renderValue = filterValue => {
  const { value, type } = filterValue;
  switch (type.name) {
    case 'Money':
      return `${value.currencyCode} ${value.amount}`;
    case 'LocalizedString':
      return renderLocalizedValue(value);
    case 'Time':
      return moment(value, formatTime).format(formatTimeTag);
    case 'DateTime':
      return moment(value, formatDateTime).format(formatDateTimeTag);
    case 'Boolean':
    case 'String':
    case 'Enum':
    case 'LocalizedEnum':
    case 'Number':
    case 'Date':
    case 'Reference':
    case 'Set':
      return value.label || value;
    default:
      return '-';
  }
};

const getFilterTagTypeLabel = (option, filterTypeLabel) => {
  switch (option) {
    case FILTER_TYPES.lessThan:
      return '<';
    case FILTER_TYPES.moreThan:
      return '>';
    default:
      return filterTypeLabel;
  }
};

const CustomFieldFilterTag = props => (
  <React.Fragment>
    {props.value?.option === FILTER_TYPES.range ? (
      <RangeFilterTag
        fieldLabel={props.value.target}
        filterTypeLabel={props.filterTypeLabel}
        value={props.value?.value}
        renderValue={value =>
          `${renderValue({
            value,
            type: props.value?.type,
            option: props.value?.option,
          })}`
        }
        onRemove={props.onRemove}
        onClick={props.onClick}
      />
    ) : (
      <SingleFilterTag
        fieldLabel={props.value.target}
        filterTypeLabel={getFilterTagTypeLabel(
          props.value?.option,
          props.filterTypeLabel
        )}
        value={props.value}
        renderValue={value =>
          `${renderValue({
            value: value?.value,
            type: props.value?.type,
            option: props.value?.option,
          })}`
        }
        onRemove={props.onRemove}
        onClick={props.onClick}
      />
    )}
  </React.Fragment>
);
CustomFieldFilterTag.displayName = 'CustomFieldFilterTag';
CustomFieldFilterTag.propTypes = {
  fieldLabel: PropTypes.string.isRequired,
  filterTypeLabel: PropTypes.string.isRequired,
  value: PropTypes.shape({
    option: PropTypes.string,
    target: PropTypes.string.isRequired,
    type: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
    value: PropTypes.any,
  }).isRequired,
  onRemove: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default CustomFieldFilterTag;
