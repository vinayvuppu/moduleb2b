const flatten = require('lodash.flatten');
const { QUOTE_TYPES } = require('./constants');

const roundHalfEven = x => 2 * Math.round(x / 2);

const convertLineItem = ({ name, custom, ...rest }) => {
  let nameAllLocales = [];

  if (name) {
    nameAllLocales = Object.keys(name).map(key => ({
      locale: key,
      value: name[key]
    }));
  }

  return {
    nameAllLocales,
    originalPrice:
      custom && custom.fields && custom.fields.originalPrice
        ? custom.fields.originalPrice
        : undefined,
    ...rest
  };
};

const getOriginalTotalPrice = ({
  lineItems = [],
  customLineItems = [],
  totalPrice
}) => {
  if (
    lineItems.some(
      lineItem =>
        lineItem.custom &&
        lineItem.custom.fields &&
        lineItem.custom.fields.originalPrice
    ) ||
    customLineItems.length > 0
  ) {
    const totalLineItems = lineItems.reduce((acc, act) => {
      const lineItemCentAmount =
        act.custom && act.custom.fields && act.custom.fields.originalPrice
          ? act.custom.fields.originalPrice.centAmount * act.quantity
          : act.totalPrice.centAmount;
      return acc + lineItemCentAmount;
    }, 0);

    return {
      ...totalPrice,
      centAmount: totalLineItems
    };
  }
  return undefined;
};

const getAmountDiscount = ({ customLineItems = [] }) => {
  const amountDiscount = customLineItems.find(
    customLineItem =>
      customLineItem.name[Object.keys(customLineItem.name)[0]] ===
      'quote-amount-discount'
  );

  if (amountDiscount) {
    return {
      ...amountDiscount.totalPrice,
      centAmount: amountDiscount.totalPrice.centAmount * -1
    };
  }
  return undefined;
};

const getPercentageDiscount = cart =>
  cart &&
  cart.custom &&
  cart.custom.fields &&
  cart.custom.fields.percentageDiscountApplied
    ? cart.custom.fields.percentageDiscountApplied
    : undefined;

const convertRestCartToQuote = cart => {
  const {
    customerId: employeeId,
    customerEmail: employeeEmail,
    customerGroup,
    lineItems,
    custom,
    ...rest
  } = cart;

  return {
    ...rest,
    employeeId,
    employeeEmail,
    customerGroup: {
      typeId: customerGroup.typeId,
      key: customerGroup.obj.key
    },
    company: {
      id: customerGroup.obj.key,
      name: customerGroup.obj.name
    },
    lineItems: lineItems.map(convertLineItem),
    quoteState: custom && custom.fields ? custom.fields.quoteState : undefined,
    quoteNumber:
      custom && custom.fields ? custom.fields.quoteNumber : undefined,
    originalTotalPrice: getOriginalTotalPrice(cart),
    amountDiscount: getAmountDiscount(cart),
    percentageDiscount: getPercentageDiscount(cart)
  };
};

const generateFindParams = ({
  limit = 20,
  offset = 0,
  sort = ['createdAt desc'],
  quoteState,
  employeeId,
  quoteNumber,
  employeeEmail,
  searchTerm,
  customerGroupId,
  companyId,
  expand
}) => {
  const params = {
    perPage: limit,
    page: Math.floor(offset / limit) + 1
  };
  const where = ['custom(fields(isQuote=true))'];

  if (quoteState && quoteState.length) {
    where.push(`custom(fields(quoteState in ("${quoteState.join('","')}")))`);
  }

  if (quoteNumber) {
    where.push(`custom(fields(quoteNumber="${quoteNumber}"))`);
  }

  if (employeeId) {
    where.push(`customerId="${employeeId}"`);
  }
  if (employeeEmail) {
    where.push(`customerEmail="${employeeEmail}"`);
  }
  if (customerGroupId) {
    where.push(`customerId="${employeeId}"`);
  }
  if (companyId) {
    where.push(`store(key="${companyId}")`);
  }

  if (searchTerm) {
    where.push(
      `customerEmail="${searchTerm}" or custom(fields(quoteNumber="${searchTerm}"))`
    );
  }

  params.where = where;
  if (sort && sort.length) {
    const sortParams = sort[0].split(' ');
    params.sortBy = sortParams[0];
    params.sortDirection = sortParams[1];
  }
  params.expand = expand;
  return params;
};

const generateCartDraft = ({ quoteDraft, quoteNumber }) => {
  const {
    employeeId: customerId,
    employeeEmail: customerEmail,
    companyId,
    currency,
    ...rest
  } = quoteDraft;

  const cartDraft = {
    currency,
    customerId,
    customerEmail,
    store: {
      typeId: 'store',
      key: companyId
    },
    custom: {
      type: {
        typeId: 'type',
        key: 'quote-type'
      },
      fields: {
        isQuote: true,
        quoteNumber,
        quoteState: 'initial'
      }
    },
    ...rest
  };
  return cartDraft;
};

const addActionForRemoveAmountDiscount = cart => {
  if (cart.customLineItems && cart.customLineItems.length > 0) {
    return cart.customLineItems.map(customLineItem => ({
      action: 'removeCustomLineItem',
      customLineItemId: customLineItem.id
    }));
  }
  return [];
};

const addActionForRemovePercentageDiscountApplied = cart =>
  cart.custom &&
  cart.custom.fields &&
  cart.custom.fields.percentageDiscountApplied && {
    action: 'setCustomField',
    name: 'percentageDiscountApplied',
    value: undefined
  };

const addActionForSetOriginalPrice = ({
  lineItemId,
  cart,
  percentageDiscountApplied
}) => {
  const oldLineItem = cart.lineItems.find(
    oldLineItem => oldLineItem.id === lineItemId
  );

  if (
    !oldLineItem.custom ||
    !oldLineItem.custom.fields ||
    !oldLineItem.custom.fields.originalPrice
  ) {
    return [
      {
        action: 'setLineItemCustomType',
        type: {
          typeId: 'type',
          key: 'line-item-quote-type'
        },
        lineItemId: lineItemId,
        fields: {
          originalPrice: oldLineItem.price.value,
          percentageDiscountApplied
        }
      }
    ];
  } else if (
    oldLineItem.custom &&
    oldLineItem.custom.fields &&
    !oldLineItem.custom.fields.originalPrice
  ) {
    return [
      {
        action: 'setLineItemCustomField',
        lineItemId: lineItemId,
        name: 'originalPrice',
        value: oldLineItem.price.value
      },
      {
        action: 'setLineItemCustomField',
        lineItemId: lineItemId,
        name: 'percentageDiscountApplied',
        value: percentageDiscountApplied
      }
    ];
  } else if (
    oldLineItem.custom &&
    oldLineItem.custom.fields &&
    oldLineItem.custom.fields.originalPrice
  ) {
    return [
      {
        action: 'setLineItemCustomField',
        lineItemId: lineItemId,
        name: 'originalPrice',
        value: oldLineItem.custom.fields.originalPrice
      },
      {
        action: 'setLineItemCustomField',
        lineItemId: lineItemId,
        name: 'percentageDiscountApplied',
        value: percentageDiscountApplied
      }
    ];
  }
};

const addActionForRestoreItemsOriginalPrice = cart => {
  let discountedActions = [];
  const discountedLineItems = cart.lineItems.filter(
    lineItem =>
      lineItem.custom &&
      lineItem.custom.fields &&
      lineItem.custom.fields.originalPrice
  );
  if (discountedLineItems && discountedLineItems.length > 0) {
    discountedActions = flatten(
      discountedLineItems.map(discountedLineItem => {
        return [
          {
            action: 'setLineItemPrice',
            lineItemId: discountedLineItem.id,
            externalPrice: discountedLineItem.custom.fields.originalPrice
          },
          {
            action: 'setLineItemCustomField',
            lineItemId: discountedLineItem.id,
            name: 'originalPrice',
            value: undefined
          }
        ];
      })
    );
  }

  let percentageDiscountAppliedActions = cart.lineItems
    .filter(
      lineItem =>
        lineItem.custom &&
        lineItem.custom.fields &&
        lineItem.custom.fields.percentageDiscountApplied
    )
    .map(lineItem => ({
      action: 'setLineItemCustomField',
      lineItemId: lineItem.id,
      name: 'percentageDiscountApplied',
      value: undefined
    }));

  return [...discountedActions, ...percentageDiscountAppliedActions];
};

const createAddCustomLineItem = ({ name, taxCategoryId, slug, money }) => ({
  action: 'addCustomLineItem',
  name: {
    en: name
  },
  taxCategory: {
    typeId: 'tax-category',
    id: taxCategoryId
  },
  quantity: 1,
  slug,
  money
});

const convertGraphqlActionToRestAction = (
  graphqlAction,
  oldCart,
  noTaxCategory
) => {
  const key = Object.keys(graphqlAction)[0];
  const value = graphqlAction[key];
  let action = {};
  switch (key) {
    case 'removeLineItem':
    case 'addLineItem': {
      action = [
        {
          action: key,
          ...value
        }
      ];
      break;
    }
    case 'changeState': {
      action = [
        {
          action: 'setCustomField',
          name: 'quoteState',
          value: value.state
        }
      ];
      break;
    }
    case 'changeLineItemQuantity': {
      action = [
        {
          action: key,
          lineItemId: value.lineItemId,
          quantity: value.quantity,
          ...(value.externalPrice && {
            externalPrice: {
              ...(value.externalPrice.centPrecision && {
                ...value.externalPrice.centPrecision
              }),
              ...(value.externalPrice.highPrecision && {
                ...value.externalPrice.highPrecision
              })
            }
          }),
          ...(value.externalTotalPrice && {
            externalTotalPrice: value.externalTotalPrice
          })
        }
      ];
      break;
    }

    case 'setLineItemPrice': {
      const removePercentageDiscountActions = oldCart.lineItems
        .filter(
          lineItem =>
            lineItem.custom &&
            lineItem.custom.fields &&
            lineItem.custom.fields.percentageDiscountApplied === true &&
            lineItem.id !== value.lineItemId
        )
        .map(lineItem => [
          ...addActionForSetOriginalPrice({
            cart: oldCart,
            lineItemId: lineItem.id,
            percentageDiscountApplied: false
          }),
          {
            action: 'setLineItemPrice',
            lineItemId: lineItem.id,
            externalPrice: lineItem.custom.fields.originalPrice
          }
        ]);

      action = [
        ...addActionForRemoveAmountDiscount(oldCart),
        addActionForRemovePercentageDiscountApplied(oldCart),
        ...flatten(removePercentageDiscountActions),
        {
          action: key,
          lineItemId: value.lineItemId,
          externalPrice: {
            ...(value.externalPrice.centPrecision && {
              ...value.externalPrice.centPrecision
            }),
            ...(value.externalPrice.highPrecision && {
              ...value.externalPrice.highPrecision
            })
          }
        },
        ...addActionForSetOriginalPrice({
          cart: oldCart,
          lineItemId: value.lineItemId,
          percentageDiscountApplied: false
        })
      ];
      break;
    }
    case 'setLineItemTotalPrice': {
      action = [
        ...addActionForRemoveAmountDiscount(oldCart),
        addActionForRemovePercentageDiscountApplied(oldCart),
        {
          action: key,
          lineItemId: value.lineItemId,
          externalTotalPrice: {
            price: {
              ...(value.externalTotalPrice.price.centPrecision && {
                ...value.externalTotalPrice.price.centPrecision
              }),
              ...(value.externalTotalPrice.price.highPrecision && {
                ...value.externalTotalPrice.price.highPrecision
              })
            },
            totalPrice: {
              ...value.externalTotalPrice.totalPrice
            }
          }
        },
        ...addActionForSetOriginalPrice({
          lineItemId: value.lineItemId,
          cart: oldCart,
          percentageDiscountApplied: false
        })
      ];

      break;
    }
    case 'setAmountDiscount': {
      const originalTotalPrice = getOriginalTotalPrice(oldCart);

      const totalPrice = originalTotalPrice || oldCart.totalPrice;

      if (value.amountDiscount.centAmount < 0) {
        throw new Error('The discount must be 0 or bigger');
      }
      if (value.amountDiscount.centAmount > totalPrice.centAmount) {
        throw new Error('The discount cannot be bigger than the total price');
      }
      action = [
        ...addActionForRemoveAmountDiscount(oldCart),
        addActionForRemovePercentageDiscountApplied(oldCart),
        createAddCustomLineItem({
          name: 'quote-amount-discount',
          taxCategoryId: noTaxCategory.id,
          slug: 'quote-amount-discount',
          money: {
            ...value.amountDiscount,
            centAmount: value.amountDiscount.centAmount * -1
          }
        }),
        ...addActionForRestoreItemsOriginalPrice(oldCart)
      ];

      break;
    }
    case 'setPercentageDiscount': {
      if (value.percentage < 0 || value.percentage > 1) {
        throw new Error('The percentage must be between 0 and 1');
      }

      const actions = oldCart.lineItems.map(lineItem => {
        const price =
          lineItem.custom &&
          lineItem.custom.fields &&
          lineItem.custom.fields.originalPrice
            ? lineItem.custom.fields.originalPrice
            : lineItem.price.value;

        return [
          {
            action: 'setLineItemPrice',
            lineItemId: lineItem.id,
            externalPrice: {
              ...price,
              centAmount: roundHalfEven(
                price.centAmount - price.centAmount * value.percentage
              )
            }
          },
          ...addActionForSetOriginalPrice({
            lineItemId: lineItem.id,
            cart: oldCart,
            percentageDiscountApplied: true
          })
        ];
      });

      action = [
        ...addActionForRemoveAmountDiscount(oldCart),
        ...flatten(actions),
        {
          action: 'setCustomField',
          name: 'percentageDiscountApplied',
          value: value.percentage
        }
      ];

      break;
    }
  }
  return action.filter(Boolean);
};

const removeDuplicateRemoveCustomLineItemActions = actions =>
  actions.reduce((unique, item) => {
    if (
      unique.find(
        uniqueItem =>
          uniqueItem.action === 'removeCustomLineItem' &&
          uniqueItem.action === item.action &&
          uniqueItem.customLineItemId === item.customLineItemId
      )
    ) {
      return unique;
    } else {
      return [...unique, item];
    }
  }, []);

const removeDuplicateSetCustomFieldPercentageDiscountApplied = actions =>
  actions.reduce((unique, item) => {
    if (
      unique.find(
        uniqueItem =>
          uniqueItem.action === 'setCustomField' &&
          uniqueItem.action === item.action &&
          uniqueItem.name === 'percentageDiscountApplied' &&
          uniqueItem.name === item.name &&
          uniqueItem.value === undefined &&
          item.value === undefined
      )
    ) {
      return unique;
    } else {
      return [...unique, item];
    }
  }, []);

const removeDuplicateActions = actions =>
  removeDuplicateSetCustomFieldPercentageDiscountApplied(
    removeDuplicateRemoveCustomLineItemActions(actions)
  );

const getQuoteNumber = async customObjectRepository => {
  let quoteNumberCustomObject = {
    container: 'quote-order-number',
    key: 'quote-order-number'
  };

  const response = await customObjectRepository.find({
    where: [`key = "quote-order-number"`]
  });

  quoteNumberCustomObject.value =
    response && response.results && response.results.length
      ? response.results[0].value + 1
      : 1;

  try {
    const quoteNumberSequence = await customObjectRepository.update(
      quoteNumberCustomObject
    );
    return quoteNumberSequence.value.toString().padStart(10, '0');
  } catch (e) {
    return getQuoteNumber(customObjectRepository);
  }
};

const restrictActionsByState = ({ updateAction, state }) => {
  let isAllowed = true;

  const key = Object.keys(updateAction)[0];
  const value = updateAction[key];

  const newState = value.state;

  if (
    [
      QUOTE_TYPES.PLACED,
      QUOTE_TYPES.DECLINED,
      QUOTE_TYPES.EXPIRED,
      QUOTE_TYPES.CLOSED
    ].includes(state)
  ) {
    isAllowed = false;
  }

  if (state === QUOTE_TYPES.APPROVED && key !== 'changeState') {
    isAllowed = false;
  }

  if (
    state === QUOTE_TYPES.APPROVED &&
    key === 'changeState' &&
    ![
      QUOTE_TYPES.PLACED,
      QUOTE_TYPES.DECLINED,
      QUOTE_TYPES.EXPIRED,
      QUOTE_TYPES.CLOSED
    ].includes(newState)
  ) {
    isAllowed = false;
  }

  if (state === QUOTE_TYPES.SUBMITTED) {
    if (
      key === 'changeState' &&
      ![
        QUOTE_TYPES.APPROVED,
        QUOTE_TYPES.DECLINED,
        QUOTE_TYPES.EXPIRED,
        QUOTE_TYPES.CLOSED
      ].includes(newState)
    ) {
      isAllowed = false;
    } else if (
      ![
        'changeState',
        'setLineItemPrice',
        'setLineItemTotalPrice',
        'setAmountDiscount',
        'setPercentageDiscount'
      ].includes(key)
    ) {
      isAllowed = false;
    }
  }
  if (!isAllowed) {
    throw new Error('Action not allowed');
  }
};

module.exports = {
  convertRestCartToQuote,
  generateFindParams,
  convertLineItem,
  generateCartDraft,
  convertGraphqlActionToRestAction,
  getOriginalTotalPrice,
  removeDuplicateRemoveCustomLineItemActions,
  getQuoteNumber,
  restrictActionsByState,
  removeDuplicateActions
};
