import PropTypes from 'prop-types';
import React from 'react';
import { transformLocalizedFieldToString } from '@commercetools-local/utils/graphql';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';

import SingleFilterTag from '../single-filter-tag';

// NOTE: this component will be wrapped into a `<Resource>ReferenceFilterTag`,
// which will inject `readItemFromCache` as prop.
const ReferenceSingleFilterTag = props => {
  const { dataLocale } = useApplicationContext(applicationContext => ({
    dataLocale: applicationContext.dataLocale,
  }));

  return (
    <SingleFilterTag
      fieldLabel={props.fieldLabel}
      filterTypeLabel={props.filterTypeLabel}
      value={props.value}
      renderValue={value => {
        const item = props.readItemFromCache(value);

        if (item && item.name) {
          return item.name;
        }

        if (item && item.nameAllLocales) {
          const name = transformLocalizedFieldToString(item.nameAllLocales);
          return (name && name[dataLocale]) || '';
        }

        return '';
      }}
      onRemove={props.onRemove}
      onClick={props.onClick}
    />
  );
};

ReferenceSingleFilterTag.displayName = 'ReferenceSingleFilterTag';
ReferenceSingleFilterTag.propTypes = {
  fieldLabel: PropTypes.string.isRequired,
  filterTypeLabel: PropTypes.string.isRequired,
  value: PropTypes.string,
  onRemove: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  readItemFromCache: PropTypes.func.isRequired,
};

export const ReferenceMultiFilterTag = props => (
  <SingleFilterTag
    fieldLabel={props.fieldLabel}
    filterTypeLabel={props.filterTypeLabel}
    value={props.value}
    renderValue={value => {
      // Check if the fragment exists. If an error is thrown, return an empty
      // string while the refetch is done.
      try {
        return value
          .map(props.readItemFromCache)
          .map(item => item.name || item.key)
          .join(', ');
      } catch (e) {
        return '';
      }
    }}
    onRemove={props.onRemove}
    onClick={props.onClick}
  />
);

ReferenceMultiFilterTag.displayName = 'ReferenceMultiFilterTag';
ReferenceMultiFilterTag.propTypes = {
  fieldLabel: PropTypes.string.isRequired,
  filterTypeLabel: PropTypes.string.isRequired,
  value: PropTypes.array,
  onRemove: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  readItemFromCache: PropTypes.func.isRequired,
};

export default ReferenceSingleFilterTag;
