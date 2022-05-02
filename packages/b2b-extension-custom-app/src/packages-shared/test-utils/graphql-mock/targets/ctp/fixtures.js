import { Factory } from 'rosie';
import faker from 'faker';

const identityFunc = anyValue => anyValue;

const nameAllLocales = (sequenceId, prefixes) => {
  const locales = [null, ['en'], ['en', 'de']][sequenceId % 3];
  return (
    locales &&
    locales.map(locale => ({
      locale,
      value: `${prefixes[locale]}${sequenceId}`,
    }))
  );
};

const createRefFromEntity = (entity, typeId) => ({
  id: entity.id,
  typeId,
});

const createFieldDefinitions = (types, id) =>
  types.map(typeName => ({
    required: false,
    name: `${typeName}-${id}`,
    inputHint: 'SingleLine',
    type: {
      name: typeName,
      // The typename is solved at runtime so we need to specify which
      // is the one for the given definition
      __typename: `${typeName}Type`,
    },
    labelAllLocales:
      nameAllLocales(id, {
        en: `Type Definition ${typeName} label #`,
        de: `TypeDefinition ${typeName} label #`,
      }) || [],
  }));

const getRandomInt = (min, max) => {
  const minimum = Math.ceil(min);
  const maximum = Math.floor(max);
  return Math.floor(Math.random() * (maximum - minimum)) + minimum;
};

const createMoney = (min, max) => ({
  centAmount: getRandomInt(min, max),
  currencyCode: 'EUR',
  fractionDigits: 2,
  type: 'centPrecision',
  __typename: 'Money',
});

const createCustomType = (customType, customFieldsRaw = []) => ({
  __typename: 'MyCustomType',
  type: customType,
  customFieldsRaw,
});

const createDate = (sequenceId, year = '2017') => {
  const x = String(sequenceId % 13).padStart(2, '0');
  return `${year}-${x}-${x}T${x}:${x}:${x}.000Z`;
};

export default () => {
  const Store = new Factory()
    .sequence('sequenceId')
    .attr('id', ['sequenceId'], sequenceId => `store-${sequenceId}`)
    .attr('version', faker.random.number())
    .attr('key', ['sequenceId'], () => faker.random.alphaNumeric(10))
    .attr(
      'nameAllLocales',
      ['en', 'de'].map(locale => ({
        value: `${locale}-foo`,
        locale,
      }))
    );

  const TypeDefinition = new Factory()
    .sequence('sequenceId')
    .attr('id', ['sequenceId'], sequenceId => `type-definition-${sequenceId}`)
    .attr('key', ['sequenceId'], n => `type-definition-key-${n}`)
    .attr('resourceTypeIds', [
      'asset',
      'category',
      'channel',
      'customer',
      'order',
      'discount-code',
      'inventory-entry',
      'line-item',
      'custom-line-item',
      'product-price',
      'payment',
      'payment-interface-interaction',
      'shopping-list',
      'shopping-list-text-line-item',
      'review',
    ])
    .attr('createdAt', ['sequenceId'], createDate)
    .attr('lastModifiedAt', ['sequenceId'], sequenceId =>
      createDate(sequenceId, '2018')
    )
    .attr(
      'nameAllLocales',
      ['sequenceId'],
      n =>
        nameAllLocales(n, {
          en: 'Type Definition #',
          de: 'TypeDefinition #',
        }) || []
    )
    .option('withFieldDefinitions', false)
    .option('fieldDefinitionTypes', ['String'])
    .attr(
      'fieldDefinitions',
      ['withFieldDefinitions', 'fieldDefinitionTypes', 'sequenceId'],
      (withFieldDefinitions, fieldDefinitionTypes, sequenceId) =>
        withFieldDefinitions
          ? createFieldDefinitions(fieldDefinitionTypes, sequenceId)
          : []
    );

  const Address = new Factory()
    .sequence('sequenceId')
    .attr('id', ['sequenceId'], sequenceId => `address-${sequenceId}`)
    .attr('city', 'New York')
    .attr('country', 'US')
    .attr('firstName', 'Tony')
    .attr('lastName', 'Stark')
    .attr('title', 'Mr.')
    .attr('postalCode', '9876')
    .attr('phone', '12345')
    .attr('mobile', '54321')
    .attr('email', 'stark@avengers.com')
    .attr('fax', '@123123');

  const CustomerGroup = new Factory()
    .sequence('sequenceId')
    .attr('id', () => faker.random.uuid())
    .attr('version', () => faker.random.number())
    .attr('name', () => faker.name.findName())
    .attr('key', () => faker.random.alphaNumeric(10))
    .attr('customFields', null)
    .attr('customFieldRaw', [])
    .attr('customFieldsList', [])
    .attr('createdAt', ['sequenceId'], createDate)
    .attr('lastModifiedAt', ['sequenceId'], sequenceId =>
      createDate(sequenceId, '2018')
    );

  const Customer = do {
    const address = Address.build();
    const addressList = [address, ...Address.buildList(5)];
    const customerGroup = CustomerGroup.build();
    new Factory()
      .sequence('sequenceId')
      .attr('id', () => faker.random.uuid())
      .attr('email', ['sequenceId'], sequenceId =>
        faker.internet.email(`customer-email-${sequenceId}`)
      )
      .attr('version', () => faker.random.number())
      .attr('password', () => faker.internet.password())
      .attr('isEmailVerified', true)
      .attr('customerNumber', null)
      .attr('customerGroup', customerGroup)
      .attr(
        'customerGroupRef',
        createRefFromEntity(customerGroup, 'customer-group')
      )
      .attr('externalId', () => faker.random.uuid())
      .attr('key', () => faker.random.alphaNumeric(10))
      .attr('companyName', () => faker.company.companyName())
      .attr('vatId', () => faker.random.alphaNumeric(10))
      .attr('firstName', () => faker.name.firstName())
      .attr('lastName', () => faker.name.lastName())
      .attr('locale', () => faker.random.locale())
      .attr('salutation', () => 'Dear')
      .attr('address', address)
      .attr('addresses', addressList)
      .attr('shippingAddresses', addressList)
      .attr('billingAddresses', addressList)
      .attr(
        'shippingAddressIds',
        addressList.map(a => a.id)
      )
      .attr(
        'billingAddressIds',
        addressList.map(a => a.id)
      )
      .attr('dateOfBirth', '2036-06-10')
      .attr('createdAt', ['sequenceId'], createDate)
      .attr('lastModifiedAt', ['sequenceId'], sequenceId =>
        createDate(sequenceId, '2018')
      )
      .attr('custom', null)
      .attr('stores', Store.buildList(5));
  };

  const State = new Factory()
    .sequence('sequenceId')
    .option('withTransitions', false)
    .attr('id', ['sequenceId'], sequenceId => `state-${sequenceId}`)
    .attr('key', ['sequenceId'], sequenceId => `state-key-${sequenceId}`)
    .attr('transitions', ['withTransitions'], withTransitions =>
      withTransitions ? State.buildList(10) : []
    )
    .attr('roles', ['ReviewIncludedInStatistics'])
    .attr('nameAllLocales', ['sequenceId'], sequenceId =>
      nameAllLocales(sequenceId, {
        en: 'State #',
        de: 'Der Zustand #',
      })
    );

  const DiscountCode = new Factory()
    .sequence('sequenceId')
    .attr('id', ['sequenceId'], sequenceId => `discount-code-${sequenceId}`)
    .attr('discount', ['sequenceId'], sequenceId => ({
      id: `discount-code-discount-obj-${sequenceId}`,
    }));

  const ProductType = new Factory()
    .sequence('sequenceId')
    .attr('id', ['sequenceId'], sequenceId => `product-type-${sequenceId}`)
    .attr('name', ['sequenceId'], sequenceId => `Product Type #${sequenceId}`);

  const PimSearchListView = new Factory()
    .sequence('sequenceId')
    .attr(
      'id',
      ['sequenceId'],
      sequenceId => `pim-search-list-view-${sequenceId}`
    );

  const PimSearchListViewInput = new Factory()
    .sequence('sequenceId')
    .attr(
      'id',
      ['sequenceId'],
      sequenceId => `pim-search-list-view-input-${sequenceId}`
    );

  const Category = new Factory()
    .sequence('sequenceId')
    .attr('id', ['sequenceId'], sequenceId => `category-${sequenceId}`)
    .attr('ancestors', () => [{ id: 'root-category', name: 'Root Category' }])
    .attr(
      'nameAllLocales',
      ['sequenceId'],
      sequenceId =>
        nameAllLocales(sequenceId, {
          en: 'Category #',
          de: 'Die Kategorie #',
        }) || []
    );

  const Product = new Factory()
    .sequence('sequenceId')
    .attr('id', ['sequenceId'], sequenceId => `product-${sequenceId}`)
    .attr('createdAt', ['sequenceId'], createDate)
    .attr('lastModifiedAt', ['sequenceId'], sequenceId =>
      createDate(sequenceId, '2018')
    )
    .attr('key', ['sequenceId'], sequenceId => `product-key-${sequenceId}`)
    .attr('masterData', ['sequenceId'], sequenceId => ({
      staged: {
        masterVariant: {
          sku: `product-sku-${sequenceId}`,
        },
        name: `Product #${sequenceId}`,
        slug: `product-slug-${sequenceId}`,
        nameAllLocales: [
          {
            locale: 'en',
            value: `Product #${sequenceId}`,
          },
          { locale: 'de', value: `Das Produkt #${sequenceId}` },
        ],
        categories: [Category.build({ sequenceId: sequenceId % 3 })],
      },
      published: sequenceId % 2 === 0,
      hasStagedChanges: sequenceId % 3 === 0,
    }))
    .sequence('productType', pt => ProductType.build({ n: pt }));

  const SyncInfo = new Factory()
    .sequence('sequenceId')
    .option('withChannel', false)
    .attr('syncedAt', ['sequenceId'], createDate)
    .attr(
      'externalId',
      ['sequenceId'],
      sequenceId => `external-id-${sequenceId}`
    )
    .attr('channel', ['withChannel', 'sequenceId'], (withChannel, sequenceId) =>
      withChannel
        ? {
            id: `sync-info-${sequenceId}`,
            nameAllLocales: nameAllLocales(sequenceId, {
              en: `en-channel-${sequenceId}`,
              de: `de-channel-${sequenceId}`,
            }),
          }
        : null
    );

  const LineItemReturnItem = new Factory()
    .sequence('sequenceId')
    .attr('type', 'LineItemReturnItem')
    .attr('lineItemId', ['sequenceId'], sequenceId => `line-item-${sequenceId}`)
    .attr('id', ['sequenceId'], sequenceId => `return-item-${sequenceId}`)
    .attr('quantity', 5)
    .attr('shipmentState', 'Returned')
    .attr('paymentState', 'Initial')
    .attr('__typename', 'LineItemReturnItem')
    .attr('createdAt', ['sequenceId'], createDate)
    .attr('lastModifiedAt', ['sequenceId'], sequenceId =>
      createDate(sequenceId, '2018')
    );

  const ReturnInfo = new Factory()
    .sequence('sequenceId')
    .option('withReturnItems', true)
    .attr(
      'returnTrackingId',
      ['sequenceId'],
      sequenceId => `return-info-tracking-${sequenceId}`
    )
    .attr('returnDate', ['sequenceId'], createDate)
    .attr('items', ['withReturnItems'], withReturnItems =>
      withReturnItems ? LineItemReturnItem.buildList(1) : []
    );

  const Transaction = new Factory()
    .sequence('sequenceId')
    .attr('id', ['sequenceId'], sequenceId => `transaction-${sequenceId}`)
    .attr(
      'interactionId',
      ['sequenceId'],
      sequenceId => `transaction-interaction-${sequenceId}`
    )
    .attr('type', 'Chargeback')
    .attr('state', 'Initial')
    .attr('amount', createMoney(1, 1000))
    .attr('timestamp', ['sequenceId'], createDate);

  const Payment = new Factory()
    .sequence('sequenceId')
    .option('withCustomerInPayment', true)
    .option('withInterfaceInteractionsInPayments', false)
    .option('withTransactionsInPayments', false)
    .option('withCustomFieldsInPayments', false)
    .option('withTransitionsInStateOfPayment', true)
    .option('withStateInPayment', true)
    .attr('id', ['sequenceId'], sequenceId => `payment-info-${sequenceId}`)
    .attr('version', 1)
    .attr(
      'interfaceId',
      ['sequenceId'],
      sequenceId => `payment-info-interface-${sequenceId}`
    )
    .attr('version', ['sequenceId'], sequenceId => sequenceId)
    .attr('createdAt', ['sequenceId'], createDate)
    .attr('lastModifiedAt', ['sequenceId'], sequenceId =>
      createDate(sequenceId, '2018')
    )
    .attr(
      'interfaceInteractionsRaw',
      ['withInterfaceInteractionsInPayments'],
      withInterfaceInteractionsInPayments => ({
        results: withInterfaceInteractionsInPayments
          ? [
              {
                type: TypeDefinition.build(null, {
                  withFieldDefinitions: true,
                }),
                fields: [
                  {
                    // This name is important so afterwards the UI render the
                    // correct value for this field
                    name: 'String-2',
                    value: 'This is an interface interaction',
                  },
                ],
              },
            ]
          : [],
      })
    )
    .attr(
      'customer',
      ['sequenceId', 'withCustomerInPayment'],
      (sequenceId, withCustomerInPayment) =>
        withCustomerInPayment
          ? {
              id: `payment-customer-${sequenceId}`,
            }
          : null
    )
    .attr('paymentMethodInfo', ['sequenceId'], sequenceId => ({
      paymentInterface: `payment-interface-${sequenceId}`,
      method: `payment-method-${sequenceId}`,
      nameAllLocales:
        nameAllLocales(sequenceId, {
          en: 'payment-method-info en',
          de: 'payment-method-info de',
        }) || [],
    }))
    .attr(
      'paymentStatus',
      ['sequenceId', 'withTransitionsInStateOfPayment', 'withStateInPayment'],
      (sequenceId, withTransitionsInStateOfPayment, withStateInPayment) => ({
        interfaceCode: `payment-state-interface-code-${sequenceId}`,
        interfaceText: `payment-state-interface-text-${sequenceId}`,
        state: withStateInPayment
          ? State.build(null, {
              withTransitions: withTransitionsInStateOfPayment,
            })
          : null,
      })
    )
    .attr(
      'transactions',
      ['withTransactionsInPayments'],
      withTransactionsInPayments =>
        withTransactionsInPayments ? Transaction.buildList(5) : []
    )
    .attr(
      'custom',
      ['withCustomFieldsInPayments'],
      withCustomFieldsInPayments =>
        withCustomFieldsInPayments
          ? createCustomType(
              TypeDefinition.build(null, {
                withFieldDefinitions: true,
              })
            )
          : null
    )
    .attr('amountRefunded', createMoney(0, 1000))
    .attr('amountPlanned', createMoney(0, 999))
    .attr('amountPaid', createMoney(0, 1))
    .attr('authorizedUntil', ['sequenceId'], createDate);

  const Parcel = new Factory()
    .sequence('sequenceId')
    // This is injected by `Derlivery` factory
    .option('items', [])
    .attr('id', ['sequenceId'], sequenceId => `parcel-${sequenceId}`)
    .attr('createdAt', ['sequenceId'], createDate)
    .attr('measurements', {
      lengthInMillimeter: getRandomInt(1, 1000),
      heightInMillimeter: getRandomInt(1, 1000),
      widthInMillimeter: getRandomInt(1, 1000),
      weightInGram: getRandomInt(1, 1000),
    })
    .attr('trackingData', ['sequenceId', 'items'], sequenceId => ({
      trackingId: `tracking-data-${sequenceId}`,
      carrier: 'any-carrier',
      provider: 'any-provider',
      providerTransaction: null,
      isReturn: getRandomInt(sequenceId, sequenceId ** 2) % 3 === 0,
    }))
    .attr('items', ['items']);

  const DerliveryItem = new Factory()
    .sequence('sequenceId')
    .attr('id', ['sequenceId'], sequenceId => `line-item-${sequenceId}`)
    .attr('quantity', getRandomInt(1, 1000));

  const Delivery = new Factory()
    .sequence('sequenceId')
    .option('items', DerliveryItem.buildList(2))
    .option('withParcelsInDeliveries', false)
    .attr('id', ['sequenceId'], sequenceId => `delivery-item-${sequenceId}`)
    .attr('createdAt', ['sequenceId'], createDate)
    .attr('lastModifiedAt', ['sequenceId'], sequenceId =>
      createDate(sequenceId, '2018')
    )
    .attr('address', Address.build())
    .attr('items', ['items'], identityFunc)
    .attr(
      'parcels',
      ['items', 'withParcelsInDeliveries'],
      (deliveryItems, withParcelsInDeliveries) =>
        withParcelsInDeliveries
          ? Parcel.buildList(2, {
              items: deliveryItems,
            })
          : []
    );

  const ShippingInfo = new Factory()
    .sequence('sequenceId')
    .attr('id', ['sequenceId'], sequenceId => `shipping-info-${sequenceId}`)
    .option('withDeliveries', false)
    .option('withParcelsInDeliveries', false)
    .attr('shippingMethodName', 'ShippingInfoShippingMethodName')
    .attr('price', createMoney(0, 11000))
    .attr('taxedPrice', {
      totalGross: createMoney(0, 1000),
      totalNet: createMoney(0, 1000),
    })
    .attr('discountedPrice', ['sequenceId'], sequenceId => ({
      value: createMoney(0, 10000),
      includedDiscounts: [
        {
          discount: { id: `shipping-info-discount-${sequenceId}` },
          discountedAmount: createMoney(0, 9999),
        },
      ],
    }))
    .attr(
      'deliveries',
      ['withDeliveries', 'withParcelsInDeliveries'],
      (withDeliveries, withParcelsInDeliveries) =>
        withDeliveries
          ? Delivery.buildList(5, null, { withParcelsInDeliveries })
          : []
    );

  const ProductDiscount = new Factory()
    .sequence('sequenceId')
    .attr('id', ['sequenceId'], sequenceId => `product-discount-${sequenceId}`)
    .attr(
      'nameAllLocales',
      ['sequenceId'],
      sequenceId =>
        nameAllLocales(sequenceId, {
          en: 'ProductDiscount #',
          de: 'ProductDiscount (DE) #',
        }) || []
    )
    .attr('value', {
      permyriad: 12,
      __typename: 'RelativeDiscountValue',
      type: 'relative',
    });

  const CartDiscount = new Factory()
    .sequence('sequenceId')
    .attr('id', ['sequenceId'], sequenceId => `cart-discount-${sequenceId}`)
    .attr('cartPredicate', 'where 1 = 1')
    .attr('validFrom', null)
    .attr('validUntil', null)
    .attr('stackingMode', 'Stacking')
    .attr('iActive', true)
    .attr('requiresDiscountCode', false)
    .attr('sortOrder', `${Math.random()}`)
    .attr(
      'nameAllLocales',
      ['sequenceId'],
      sequenceId =>
        nameAllLocales(sequenceId, {
          en: 'CartDiscount #',
          de: 'CartDiscount (DE) #',
        }) || []
    )
    .attr(
      'descriptionAllLocales',
      ['sequenceId'],
      sequenceId =>
        nameAllLocales(sequenceId, {
          en: 'CartDiscount Desc #',
          de: 'CartDiscount Desc (DE) #',
        }) || []
    )
    .attr('customFieldsRaw', [])
    .attr('customFields', null)
    .attr('value', {
      type: 'GiftLineItemValue',
      __typename: 'GiftLineItemValue',
    })
    .attr('target', null);

  const Variant = new Factory()
    .sequence('sequenceId')
    .attr(
      'sku',
      ['sequenceId'],
      sequenceId => `product-variant-sku-${sequenceId}`
    )
    .attr(
      'key',
      ['sequenceId'],
      sequenceId => `product-variant-key-${sequenceId}`
    )
    .attr(
      'attributesRaw',
      Array.from({ length: 10 }, (_, index) => ({
        name: `attr-${index}`,
        value: `attr-${index}`,
      }))
    );

  const TaxRate = new Factory()
    .sequence('sequenceId')
    .attr('id', ['sequenceId'], sequenceId => `tax-rate-id-${sequenceId}`)
    .attr('name', ['sequenceId'], sequenceId => `tax-rate-id-${sequenceId}`)
    .attr('includedInPrice', false)
    .attr('amount', 1);

  const LineItem = new Factory()
    .sequence('sequenceId')
    .attr('id', ['sequenceId'], sequenceId => `line-item-${sequenceId}`)
    .option('withCustomFields', true)
    .option('withDiscountedPrice', true)
    .option('withStates', false)
    .attr('productId', ['sequenceId'], sequenceId => `product-id-${sequenceId}`)
    .attr(
      'productSlug',
      ['sequenceId'],
      sequenceId => `line-item-product-slug-${sequenceId}`
    )
    .attr('quantity', 3)
    .attr('nameAllLocales', ['sequenceId'], id => [
      {
        locale: 'en',
        value: `LineItem #${id}`,
      },
      {
        locale: 'de',
        value: `LineItem (DE) #${id}`,
      },
    ])
    .attr(
      'custom',
      ['withCustomFields'],
      () =>
        createCustomType(
          TypeDefinition.build(null, {
            withFieldDefinitions: true,
          })
        ),
      [
        {
          name: 'String-1',
          value: 'string-1',
        },
      ]
    )
    .attr(
      'discountedPricePerQuantity',
      ['withDiscountedPrice'],
      withDiscountedPrice =>
        withDiscountedPrice
          ? [1, 2].map(() => ({
              quantity: 3,
              discountedPrice: {
                value: createMoney(0, 10000),
                includedDiscounts: CartDiscount.buildList(2).map(
                  cartDiscount => ({
                    discount: cartDiscount,
                    discountRef: createRefFromEntity(
                      cartDiscount,
                      'cartDiscount'
                    ),
                    discountedAmount: createMoney(0, 10000),
                  })
                ),
              },
            }))
          : []
    )
    .attr('state', ['withStates'], withStates =>
      withStates
        ? State.buildList(2).map(state => ({
            quantity: getRandomInt(0, 5),
            state,
          }))
        : []
    )
    .attr('totalPrice', createMoney(0, 100))
    .attr(
      'price',
      ['sequenceId', 'withDiscountedPrice'],
      (sequenceId, withDiscountedPrice) => {
        const productDiscount = ProductDiscount.build();
        return {
          value: createMoney(0, 50),
          discounted: withDiscountedPrice
            ? {
                value: createMoney(0, 20),
                discount: productDiscount,
                discountRef: createRefFromEntity(
                  productDiscount,
                  'product-discount'
                ),
              }
            : null,
        };
      }
    )
    .attr('variant', Variant.build())
    .attr('taxRate', TaxRate.build())
    .attr('taxedPrice', {
      totalNet: createMoney(0, 100),
      totalGross: createMoney(0, 120),
    });

  const TaxPortion = new Factory()
    .sequence('sequenceId')
    .attr('id', ['sequenceId'], sequenceId => `tax-portion-${sequenceId}`)
    .attr('amount', createMoney(0, 10000))
    .attr('rate', 0.2)
    .attr('name', ['id'], id => `order-taxedPrice-taxPortions-${id}`);

  const TaxedPrice = new Factory()
    .sequence('sequenceId')
    .attr('id', ['sequenceId'], sequenceId => `taxed-price-${sequenceId}`)
    .attr('taxPortions', TaxPortion.buildList(1))
    .attr('totalNet', createMoney(0, 10000))
    .attr('totalGross', createMoney(0, 10000));

  // Orders
  const Order = new Factory()
    .sequence('sequenceId')
    // options
    .option('shipmentState', 'Pending')
    .option('paymentState', 'Paid')
    .option('orderState', 'Open')
    .option('taxedPricePortionsName', 'any-taxed-price-portion')

    .option('withBillingAddress', false)
    .option('withShippingAddress', false)
    .option('customerEmail', 'customer-email-id')
    .option('customerId', 'customer-id')
    .option('withDiscountCodes', false)
    .option('withState', false)
    .option('withStateTransitions', false)
    .option('withLineItems', false)
    .option('withLineItemsCustomFields', false)
    .option('withLineItemStates', false)
    .option('withDiscountedPrice', false)
    .option('withPaymentInfo', false)
    .option('withCustomerInPayment', true)
    .option('withInterfaceInteractionsInPayments', false)
    .option('withTransactionsInPayments', false)
    .option('withCustomFieldsInPayments', false)
    .option('withTransitionsInStateOfPayment', true)
    .option('withStateInPayment', true)
    .option('withReturnInfo', false)
    .option('withShippingInfo', false)
    .option('withDeliveries', false)
    .option('withParcelsInDeliveries', false)
    .option('withSyncInfo', false)

    .attr('id', ['sequenceId'], sequenceId => `order-${sequenceId}`)

    .attr('totalPrice', createMoney(0, 100))

    .attr('createdAt', ['sequenceId'], createDate)
    .attr('lastModifiedAt', ['sequenceId'], sequenceId =>
      createDate(sequenceId, '2018')
    )
    .attr('store', ['sequenceId'], sequenceId => ({
      key: `store-${sequenceId}`,
      nameAllLocales:
        nameAllLocales(sequenceId, {
          en: `en-store-${sequenceId}`,
          de: `de-store-${sequenceId}`,
        }) || [],
    }))
    .attr('shipmentState', ['shipmentState'], identityFunc)
    .attr('paymentState', ['paymentState'], identityFunc)
    .attr('orderState', ['orderState'], identityFunc)
    .attr(
      'state',
      ['withState', 'withStateTransitions'],
      (withState, withStateTransitions) =>
        withState
          ? State.build(null, {
              withTransitions: withStateTransitions,
            })
          : null
    )
    .attr(
      'customerEmail',
      ['sequenceId', 'customerEmail'],
      (sequenceId, customerEmail) => `order-${sequenceId}-${customerEmail}`
    )
    .attr(
      'customerId',
      ['sequenceId', 'customerId'],
      (sequenceId, customerId) => `order-${sequenceId}-${customerId}`
    )
    .attr('taxedPrice', TaxedPrice.build())
    .attr('billingAddress', ['withBillingAddress'], withBillingAddress =>
      withBillingAddress ? Address.build() : null
    )
    .attr('shippingAddress', ['withShippingAddress'], withShippingAddress =>
      withShippingAddress ? Address.build() : null
    )
    // array fields
    .attr('syncInfo', ['withSyncInfo'], withSyncInfo =>
      withSyncInfo ? SyncInfo.buildList(3, null, { withChannel: true }) : []
    )
    .attr('returnInfo', ['withReturnInfo'], withReturnInfo =>
      withReturnInfo ? ReturnInfo.buildList(2) : []
    )
    .attr(
      'shippingInfo',
      ['withShippingInfo', 'withDeliveries', 'withParcelsInDeliveries'],
      (withShippingInfo, withDeliveries, withParcelsInDeliveries) =>
        withShippingInfo
          ? ShippingInfo.build(null, {
              withDeliveries,
              withParcelsInDeliveries,
            })
          : null
    )
    .attr(
      'paymentInfo',
      [
        'withPaymentInfo',
        'withCustomerInPayment',
        'withInterfaceInteractionsInPayments',
        'withTransactionsInPayments',
        'withCustomFieldsInPayments',
        'withTransitionsInStateOfPayment',
        'withStateInPayment',
      ],
      (
        withPaymentInfo,
        withCustomerInPayment,
        withInterfaceInteractionsInPayments,
        withTransactionsInPayments,
        withCustomFieldsInPayments,
        withTransitionsInStateOfPayment,
        withStateInPayment
      ) =>
        withPaymentInfo
          ? {
              payments: Payment.buildList(2, null, {
                withCustomerInPayment,
                withInterfaceInteractionsInPayments,
                withTransactionsInPayments,
                withCustomFieldsInPayments,
                withTransitionsInStateOfPayment,
                withStateInPayment,
              }),
            }
          : null
    )
    .attr('customLineItems', [])
    .attr(
      'lineItems',
      [
        'withLineItems',
        'withLineItemStates',
        'withDiscountedPrice',
        'withLineItemsCustomFields',
      ],
      (
        withLineItems,
        withLineItemStates,
        withDiscountedPrice,
        withLineItemsCustomFields
      ) =>
        withLineItems
          ? LineItem.buildList(2, null, {
              withDiscountedPrice,
              withStates: withLineItemStates,
              withCustomFields: withLineItemsCustomFields,
            })
          : []
    )
    .attr('discountCodes', ['withDiscountCodes'], withDiscountCodes =>
      withDiscountCodes ? DiscountCode.buildList(5) : []
    )
    .option('withCustomFields', false)
    .option('withFieldDefinitionsOnCustomFields', false)
    .attr(
      'custom',
      ['withCustomFields', 'withFieldDefinitionsOnCustomFields'],
      (withCustomFields, withFieldDefinitionsOnCustomFields) =>
        withCustomFields
          ? createCustomType(
              TypeDefinition.build(null, {
                withFieldDefinitions: withFieldDefinitionsOnCustomFields,
              })
            )
          : null
    );

  return {
    Product,
    State,
    ProductType,
    Category,
    TypeDefinition,
    Order,
    Parcel,
    Delivery,
    Address,
    ReturnInfo,
    LineItem,
    Customer,
    CustomerGroup,
    Store,
    PimSearchListView,
    PimSearchListViewInput,
  };
};
