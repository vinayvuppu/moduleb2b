import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { defaultMemoize } from 'reselect';
import { FormDialog } from '@commercetools-frontend/application-components';
import {
  Constraints,
  Label,
  Spacings,
  Text,
  SelectInput,
} from '@commercetools-frontend/ui-kit';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { useIsAuthorized } from '@commercetools-frontend/permissions';
import { useStoresListFetcher, useLocalize } from '@commercetools-local/hooks';
import useTracking from '../../hooks/use-tracking';
import { PERMISSIONS } from '../../../../../constants';
import messages from './messages';

const mapCurrenciesToOptions = defaultMemoize(projectCurrencies =>
  projectCurrencies.map(currency => ({
    label: currency,
    value: currency,
  }))
);
const mapStoresToOptions = defaultMemoize((stores, localize) =>
  stores.map(store => ({
    value: store.key,
    label: localize(store.nameAllLocales, store.key),
  }))
);

const initialCurrency = '';
const initialStoreKey = '';

export const OrderCreateSelectStoreAndCurrency = props => {
  const {
    projectCurrencies,
    valuesForManageStoreOrdersDataFence,
  } = useApplicationContext(applicationContext => ({
    projectCurrencies: applicationContext.project.currencies,
    valuesForManageStoreOrdersDataFence:
      applicationContext.dataFences?.store?.orders?.canManageOrders?.values,
  }));

  const [currency, setCurrency] = React.useState(
    // In case the project has only 1 currency defined we set that one as the default one
    projectCurrencies.length === 1 ? projectCurrencies[0] : initialCurrency
  );
  const [storeKey, setStoreKey] = React.useState(initialStoreKey);

  const intl = useIntl();
  const localize = useLocalize();
  const tracking = useTracking();
  const canManageAllOrders = useIsAuthorized({
    demandedPermissions: [PERMISSIONS.ManageOrders],
  });

  const storesFetcher = useStoresListFetcher({
    limit: 500,
    offset: 0,
    sort: 'createdAt desc',
    stores: !canManageAllOrders && valuesForManageStoreOrdersDataFence,
  });

  const canUseStoreInOrderCreate = false; // useFeatureToggle(STORES_IN_ORDER_CREATE);

  const handleCurrencyChange = event => setCurrency(event.target.value);
  const handleStoreChange = event => setStoreKey(event.target.value);

  const handleFormSubmit = () => {
    props.updateCartDraft({ currency });
    props.updateStore(
      storesFetcher.stores.results.find(store => store.key === storeKey)
    );
    props.hideInitialSelectionModal();
  };

  const disableSubmitting =
    !currency || (canUseStoreInOrderCreate && !canManageAllOrders && !storeKey);
  const noStoreAvailable = storesFetcher.stores.results.length === 0;

  return (
    <FormDialog
      title={intl.formatMessage(
        canUseStoreInOrderCreate ? messages.title : messages.titleNoStore
      )}
      isOpen={true}
      onClose={props.goToOrdersList}
      onSecondaryButtonClick={props.goToOrdersList}
      onPrimaryButtonClick={handleFormSubmit}
      isPrimaryButtonDisabled={disableSubmitting}
      labelPrimary={FormDialog.Intl.save}
    >
      <Spacings.Stack scale="m" data-testid="store-currency-selector-modal">
        <Text.Detail
          intlMessage={
            canUseStoreInOrderCreate
              ? messages.subTitle1
              : messages.subTitleNoStore
          }
        />
        {canUseStoreInOrderCreate && (
          <Spacings.Stack scale="xs">
            <Label
              isBold={true}
              isRequiredIndicatorVisible={!canManageAllOrders}
              htmlFor="store-selector"
            >
              <FormattedMessage {...messages.storeLabel} />
            </Label>
            <Constraints.Horizontal constraint="m">
              <SelectInput
                id="store-selector"
                placeholder={intl.formatMessage(
                  noStoreAvailable
                    ? messages.noStoresPlaceholder
                    : messages.storePlaceholder
                )}
                options={mapStoresToOptions(
                  storesFetcher.stores.results,
                  localize
                )}
                value={storeKey}
                onChange={handleStoreChange}
                isDisabled={noStoreAvailable}
                menuPortalTarget={document.body}
                menuPortalZIndex={1000}
                isClearable={true}
                data-track-component="add-store-to-order"
                data-track-event="click"
              />
            </Constraints.Horizontal>
          </Spacings.Stack>
        )}
        <Spacings.Stack scale="xs">
          <Label
            isBold={true}
            isRequiredIndicatorVisible={true}
            htmlFor="currency-selector"
          >
            <FormattedMessage {...messages.currencyLabel} />
          </Label>
          <Constraints.Horizontal constraint="s">
            <SelectInput
              id="currency-selector"
              options={mapCurrenciesToOptions(projectCurrencies)}
              menuPortalTarget={document.body}
              menuPortalZIndex={1000}
              value={currency}
              onChange={tracking.forwardHandler(
                tracking.trackSelectCurrency,
                handleCurrencyChange
              )}
            />
          </Constraints.Horizontal>
        </Spacings.Stack>
      </Spacings.Stack>
    </FormDialog>
  );
};
OrderCreateSelectStoreAndCurrency.displayName =
  'OrderCreateSelectStoreAndCurrency';

OrderCreateSelectStoreAndCurrency.propTypes = {
  projectKey: PropTypes.string.isRequired,
  goToOrdersList: PropTypes.func.isRequired,
  updateCartDraft: PropTypes.func.isRequired,
  updateStore: PropTypes.func.isRequired,
  hideInitialSelectionModal: PropTypes.func.isRequired,
};

export default OrderCreateSelectStoreAndCurrency;
