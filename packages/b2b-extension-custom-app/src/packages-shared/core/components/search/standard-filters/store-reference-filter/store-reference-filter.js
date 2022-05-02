import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { defaultMemoize } from 'reselect';
import { compose, withProps } from 'recompose';
import { NO_VALUE_FALLBACK } from '@commercetools-frontend/constants';
import { withApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { injectTransformedLocalizedFields } from '@commercetools-local/utils/graphql';
import localize from '@commercetools-local/utils/localize';
import Localize from '@commercetools-local/core/components/localize';
import createFormattedReferenceFilter from '../formatted-reference-filter';
import withDereferencedStore from '../with-dereferenced-store';
import messages from './messages';

export const createMapToItemOption = defaultMemoize(
  (language, languages) => store => {
    const transformedStore = injectTransformedLocalizedFields(store, [
      { from: 'nameAllLocales', to: 'name' },
    ]);
    return {
      value: transformedStore.key,
      key: transformedStore.key,
      label: localize({
        language,
        obj: transformedStore,
        key: 'name',
        fallback: transformedStore.key,
        fallbackOrder: languages,
      }),
    };
  }
);

// eslint-disable-next-line react/display-name
export const renderItem = store => {
  const transformedStore = injectTransformedLocalizedFields(store, [
    { from: 'nameAllLocales', to: 'name' },
  ]);
  return (
    <div>
      <strong>
        <Localize
          object={transformedStore}
          objectKey="name"
          fallback={NO_VALUE_FALLBACK}
        />
      </strong>
      <div>
        <FormattedMessage {...messages.key} />
        {`: ${store.key}`}
      </div>
    </div>
  );
};

// NOTE: if performance is slow because of large list, consider looking into
// https://github.com/JedWatson/react-select#filtering-large-lists
export const filterOption = (option, filter) =>
  option.data.label.toLowerCase().includes(filter) ||
  option.data.key.toLowerCase().includes(filter);

export default function createStoreReferenceSingleFilter({
  isMulti = false,
  isClearable = false,
  dataFenceStores = null,
  className,
}) {
  const FormattedReferenceFilter = createFormattedReferenceFilter({
    isMulti,
    className,
    autoload: true,
  });

  return compose(
    injectIntl,
    withApplicationContext(applicationContext => ({
      languages: applicationContext.project.languages,
    })),
    withDereferencedStore({ isMulti, dataFenceStores }),
    withProps(props => ({
      renderItem,
      mapItemToOption: createMapToItemOption(props.language, props.languages),
      isClearable,
      filterOption,
      placeholderLabel: isMulti
        ? props.intl.formatMessage(messages.placeholderMulti)
        : props.intl.formatMessage(messages.placeholder),
    }))
  )(FormattedReferenceFilter);
}
