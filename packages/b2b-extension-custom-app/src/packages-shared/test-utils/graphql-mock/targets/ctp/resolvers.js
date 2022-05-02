import merge from 'lodash.merge';
import get from 'lodash.get';
import { setIn } from 'formik';

const buildOrderResultForUpdateAction = (action, variables, ctpFixture) => {
  switch (action) {
    case 'changeShipmentState':
    case 'changePaymentState':
    case 'changeOrderState':
      return {
        ...ctpFixture.order,
        ...variables,
      };
    case 'addParcelToDelivery': {
      const deliveryIndex = ctpFixture.order.shippingInfo.deliveries.findIndex(
        delivery => delivery.id === variables.deliveryId
      );
      return setIn(
        ctpFixture.order,
        `shippingInfo.deliveries[${deliveryIndex}].parcels`,
        [
          ...ctpFixture.order.shippingInfo.deliveries[deliveryIndex].parcels,
          ctpFixture.parcel,
        ]
      );
    }
    case 'addDelivery': {
      return setIn(ctpFixture.order, 'shippingInfo.deliveries', [
        ...ctpFixture.order.shippingInfo.deliveries,
        ctpFixture.delivery,
      ]);
    }
    case 'addReturnInfo': {
      return setIn(ctpFixture.order, 'returnInfo', [
        ...ctpFixture.order.returnInfo,
        ctpFixture.returnInfo,
      ]);
    }
    case 'setReturnPaymentState':
    case 'setReturnShipmentState': {
      const attributeToBeUpdate =
        action === 'setReturnPaymentState' ? 'paymentState' : 'shipmentState';
      const returnInfoFromItem = ctpFixture.order.returnInfo.find(ret =>
        ret.items.find(item => item.id === variables.returnItemId)
      );
      const returnInfoIndex = ctpFixture.order.returnInfo.findIndex(
        ret => ret.returnTrackingId === returnInfoFromItem.returnTrackingId
      );
      const itemIndex = returnInfoFromItem.items.findIndex(
        item => item.id === variables.returnItemId
      );
      return setIn(
        ctpFixture.order,
        `returnInfo[${returnInfoIndex}].items[${itemIndex}].${attributeToBeUpdate}`,
        variables[attributeToBeUpdate]
      );
    }
    default:
      return ctpFixture.order;
  }
};

const parseWhereExpression = where => {
  if (!where) return null;

  const idsMatch = where.match(/id\s+in\s+\((.*)\)/);
  if (!idsMatch) return null;

  const idsString = idsMatch[1];
  const ids = idsString.match(/[^",\s]+/g);
  if (!ids) return null;

  return ids.map(id => id.replace(/"/g, ''));
};

const sortEntities = (entities, sortDefinition) => {
  if (!sortDefinition) return entities;

  // prevent in-place sorting of original array
  const result = entities.concat();
  sortDefinition.forEach(definition => {
    const [sortBy, sortOrder] = definition.split(/\s+/);
    result.sort((a, b) =>
      sortOrder === 'asc'
        ? get(a, sortBy) > get(b, sortBy)
        : get(a, sortBy) < get(b, sortBy)
    );
  });
  return result;
};

const findEntities = (entities, args) => {
  const { limit = 100, offset = 0, where = '' } = args;
  const ids = parseWhereExpression(where);
  const matchingWeheExpression = ids
    ? entities.filter(ent => ids.includes(ent.id))
    : entities;
  const sortedEntities = sortEntities(matchingWeheExpression, args.sort);
  const results = sortedEntities.slice(offset, offset + limit);
  const total = sortedEntities.length;
  const count = results.length;
  return {
    total,
    count,
    results,
  };
};

export default (fixtures, customResolvers = {}) => {
  const ctpFixture = merge(
    {
      products: [],
      productTypes: [],
      categories: [],
      customerGroups: [],
      states: [],
      typeDefinitions: [],
      orders: [],
      productType: {},
      order: {},
      parcel: {},
      delivery: {},
      typeDefinition: {},
      returnInfo: {},
    },
    fixtures
  );

  return {
    Query: () => ({
      products: (obj, args) => findEntities(ctpFixture.products, args),
      productTypes: (obj, args) => findEntities(ctpFixture.productTypes, args),
      categories: (obj, args) => findEntities(ctpFixture.categories, args),
      categoryAutocomplete: (obj, args) => {
        const { locale, text } = args;
        return {
          results: ctpFixture.categories
            .filter(category => {
              const name = category.nameAllLocales.find(
                localizedName => localizedName.locale === locale
              );
              if (name && name.value.startsWith(text)) return true;
              return false;
            })
            .slice(0, 5),
        };
      },
      customer: () => ctpFixture.customer,
      customerGroups: () => ctpFixture.customerGroups,
      productType: () => ctpFixture.productType,
      order: () => ctpFixture.order,
      stores: () => ({
        results: ctpFixture.stores,
        total: ctpFixture.stores.length,
        count: ctpFixture.stores.length,
      }),
      orders: () => ({
        total: ctpFixture.orders.length,
        count: ctpFixture.orders.length,
        results: ctpFixture.orders,
      }),
      typeDefinitions: () => ({
        results: ctpFixture.typeDefinitions,
        total: ctpFixture.typeDefinitions.length,
        count: ctpFixture.typeDefinitions.length,
      }),
      // TODO: take `where: "type=\"ProductState\""` into account
      states: (obj, args) => findEntities(ctpFixture.states, args),
      ...customResolvers.query,
    }),
    Mutation: () => ({
      updateOrder: (obj, args) => {
        let result;
        args.actions.forEach(action => {
          result = Object.entries(action).reduce(
            (acc, [actionName, variables]) =>
              buildOrderResultForUpdateAction(
                actionName,
                variables,
                ctpFixture
              ),
            {}
          );
        });
        return result;
      },
    }),
    Long: () => 100,
    Currency: () => 'EUR',
    Locale: () => 'en',
    DateTime: () => '2017-01-20T09:57:12.492Z',
    Country: () => 'DE',
    Json: () => 'Bar',
    Type: () => ({
      __typename: 'MyCustomType',
    }),
    BaseMoney: () => ({
      __typename: 'Money',
    }),
  };
};
