import { defaultMemoize } from 'reselect';
import {
  createTypesDefinitionsMap,
  createDateDefinitionsMap,
  createTextDefinitionsMap,
  createReferenceDefinitionsMap,
  createCreatableOptionsDefinitionsMap,
  createCustomFieldDefinitionsMap,
} from '@commercetools-local/core/components/search/standard-filter-definitions';
import {
  orderStateMessages,
  paymentStateMessages,
  shipmentStateMessages,
} from '@commercetools-local/core/messages/order-states';
import messages from './messages';
import styles from './company-orders-list.mod.css';

const mapStatesMessagesOptions = (stateMessages, intl) =>
  Object.entries(stateMessages).map(([key, message]) => ({
    label: intl.formatMessage(message),
    value: key,
  }));

const createFilterDefinitions = defaultMemoize(
  (intl, restrictToState = false) => ({
    orderNumber: {
      label: intl.formatMessage(messages.columnOrderNumber),
      filterTypes: createCreatableOptionsDefinitionsMap(intl, {
        placeholder: intl.formatMessage(messages.orderNumberFilterPlaceholder),
      }),
    },
    orderState: {
      label: intl.formatMessage(messages.columnOrderState),
      filterTypes: createTypesDefinitionsMap(intl, {
        options: mapStatesMessagesOptions(orderStateMessages, intl),
      }),
    },
    ...(!restrictToState && {
      'state.id': {
        label: intl.formatMessage(messages.columnState),
        filterTypes: createReferenceDefinitionsMap(intl, {
          type: 'state',
          stateType: 'OrderState',
          isMulti: true,
          className: styles['state-reference'],
        }),
      },
    }),
    paymentState: {
      label: intl.formatMessage(messages.columnPaymentState),
      filterTypes: createTypesDefinitionsMap(intl, {
        options: mapStatesMessagesOptions(paymentStateMessages, intl),
      }),
    },
    shipmentState: {
      label: intl.formatMessage(messages.columnShipmentState),
      filterTypes: createTypesDefinitionsMap(intl, {
        options: mapStatesMessagesOptions(shipmentStateMessages, intl),
      }),
    },
    lineItemState: {
      label: intl.formatMessage(messages.lineItemStateFilter),
      filterTypes: createReferenceDefinitionsMap(intl, {
        type: 'state',
        stateType: 'LineItemState',
        isMulti: true,
        className: styles['state-reference'],
      }),
    },
    createdAt: {
      label: intl.formatMessage(messages.columnCreatedAt),
      filterTypes: createDateDefinitionsMap(intl),
    },
    orderPredicate: {
      label: intl.formatMessage(messages.orderPredicateFilter),
      filterTypes: createTextDefinitionsMap(intl, {
        className: styles['predicate-input'],
      }),
    },
    firstName: {
      label: intl.formatMessage(messages.customerFirstNameLabel),
      filterTypes: createTextDefinitionsMap(intl),
    },
    lastName: {
      label: intl.formatMessage(messages.customerLastNameLabel),
      filterTypes: createTextDefinitionsMap(intl),
    },
    skuFilter: {
      label: intl.formatMessage(messages.skuFilter),
      filterTypes: createTextDefinitionsMap(intl),
    },
    billingAddressCityFilter: {
      label: intl.formatMessage(messages.billingAddressCityFilter),
      filterTypes: createTextDefinitionsMap(intl),
    },
    billingAddressPostalCodeFilter: {
      label: intl.formatMessage(messages.billingAddressPostalCodeFilter),
      filterTypes: createTextDefinitionsMap(intl),
    },
    shippingAddressCityFilter: {
      label: intl.formatMessage(messages.shippingAddressCityFilter),
      filterTypes: createTextDefinitionsMap(intl),
    },
    shippingAddressPostalCodeFilter: {
      label: intl.formatMessage(messages.shippingAddressPostalCodeFilter),
      filterTypes: createTextDefinitionsMap(intl),
    },
    paymentPredicate: {
      label: intl.formatMessage(messages.paymentPredicateFilter),
      filterTypes: createTextDefinitionsMap(intl, {
        className: styles['predicate-input'],
      }),
    },
    paymentTransactionId: {
      label: intl.formatMessage(messages.paymentTransactionIdFilter),
      filterTypes: createTextDefinitionsMap(intl, {
        className: styles['predicate-input'],
      }),
    },
    paymentInteractionId: {
      label: intl.formatMessage(messages.paymentInteractionIdFilter),
      filterTypes: createTextDefinitionsMap(intl, {
        className: styles['predicate-input'],
      }),
    },
    // 'store.key': {
    //   label: intl.formatMessage(messages.columnStore),
    //   filterTypes: createReferenceDefinitionsMap(intl, {
    //     type: 'store',
    //     isMulti: true,
    //     dataFenceStores: orderSpecificStores,
    //     className: styles['state-reference'],
    //   }),
    // },
  })
);

const createCustomFieldFilterDefinitions = defaultMemoize(
  (intl, mappedCustomFieldsDefinitions, hideTypes) => {
    const customFieldFilterDefinitions = {};
    if (
      mappedCustomFieldsDefinitions.orders &&
      Object.keys(mappedCustomFieldsDefinitions.orders).length > 0
    )
      customFieldFilterDefinitions.orderCustomField = {
        label: intl.formatMessage(messages.orderCustomFieldFilter),
        filterTypes: createCustomFieldDefinitionsMap(intl, {
          customFieldDefinitions: mappedCustomFieldsDefinitions.orders,
          hideTypes,
        }),
      };

    if (
      mappedCustomFieldsDefinitions.payments &&
      Object.keys(mappedCustomFieldsDefinitions.payments).length > 0
    )
      customFieldFilterDefinitions.paymentCustomField = {
        label: intl.formatMessage(messages.paymentCustomFieldFilter),
        filterTypes: createCustomFieldDefinitionsMap(intl, {
          customFieldDefinitions: mappedCustomFieldsDefinitions.payments,
          hideTypes,
        }),
      };

    return customFieldFilterDefinitions;
  }
);

export {
  mapStatesMessagesOptions,
  createFilterDefinitions,
  createCustomFieldFilterDefinitions,
};
