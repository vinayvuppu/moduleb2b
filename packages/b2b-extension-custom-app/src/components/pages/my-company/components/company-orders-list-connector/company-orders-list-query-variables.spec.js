/* eslint-disable no-shadow */
import oneLineTrim from 'common-tags/lib/oneLineTrim';
import {
  buildSearchQuery,
  buildPaymentFilterOptions,
  mapFiltersToPredicate,
} from './company-orders-list-query-variables';

const createOptions = options => ({
  page: 1,
  perPage: 20,
  sorting: { key: 'createdAt', order: 'asc' },
  ...options,
  filters: {},
  searchText: '',
  ...options,
});

describe('buildSearchQuery', () => {
  describe('when searchText is null', () => {
    it('should return empty string', () => {
      expect(buildSearchQuery(null)).toEqual('');
    });
  });
  describe('when projectKey is mtga', () => {
    describe('when searchText begins with MTGArena', () => {
      it('should return correctly formatted query', () => {
        expect(buildSearchQuery('MTGArena-5VWZER', 'mtga')).toEqual(
          `orderNumber = "MTGArena-5VWZER"`
        );
      });
    });
    describe('when searchText does not begin with MTGArena', () => {
      it('should return correctly formatted query', () => {
        expect(buildSearchQuery('fooBar')).toEqual(
          oneLineTrim`((customerEmail = "fooBar"
            or orderNumber = "fooBar"
            or shippingAddress(lastName in ("fooBar", "foobar", "Foobar"))
            or billingAddress(lastName in ("fooBar", "foobar", "Foobar"))
            or shippingAddress(email in ("fooBar", "foobar", "Foobar"))
            or billingAddress(email in ("fooBar", "foobar", "Foobar"))
            or shippingAddress(city in ("fooBar", "foobar", "Foobar"))
            or billingAddress(city in ("fooBar", "foobar", "Foobar"))
            or shippingAddress(postalCode="fooBar")
            or billingAddress(postalCode="fooBar")
            or lineItems(variant(sku="fooBar"))))`
        );
      });
    });
  });

  describe('when searchText is a lowercase email', () => {
    it('should return correctly formatted query', () => {
      expect(buildSearchQuery('mosalah@liverpoolfc.com')).toEqual(
        oneLineTrim`((customerEmail in ("mosalah@liverpoolfc.com"))
          or shippingAddress(email in ("mosalah@liverpoolfc.com"))
          or billingAddress(email in ("mosalah@liverpoolfc.com")))`
      );
    });
  });
  describe('when searchText is a mixed case email', () => {
    it('should return correctly formatted query', () => {
      expect(buildSearchQuery('Mosalah@liverpoolfc.com')).toEqual(
        oneLineTrim`((customerEmail in ("Mosalah@liverpoolfc.com", "mosalah@liverpoolfc.com"))
          or shippingAddress(email in ("Mosalah@liverpoolfc.com", "mosalah@liverpoolfc.com"))
          or billingAddress(email in ("Mosalah@liverpoolfc.com", "mosalah@liverpoolfc.com")))`
      );
    });
  });
  describe('when searchText is a string value (untrimmed)', () => {
    it('should return correctly formatted and trimmed query', () => {
      expect(buildSearchQuery(' fooBar  ')).toEqual(
        oneLineTrim`((customerEmail = "fooBar"
          or orderNumber = "fooBar"
          or shippingAddress(lastName in ("fooBar", "foobar", "Foobar"))
          or billingAddress(lastName in ("fooBar", "foobar", "Foobar"))
          or shippingAddress(email in ("fooBar", "foobar", "Foobar"))
          or billingAddress(email in ("fooBar", "foobar", "Foobar"))
          or shippingAddress(city in ("fooBar", "foobar", "Foobar"))
          or billingAddress(city in ("fooBar", "foobar", "Foobar"))
          or shippingAddress(postalCode="fooBar")
          or billingAddress(postalCode="fooBar")
          or lineItems(variant(sku="fooBar"))))`
      );
    });
  });
});

describe('buildPaymentFilterOptions', () => {
  describe('paymentPredicate', () => {
    it('should return options with new paymentPredicate filter', () => {
      expect(
        buildPaymentFilterOptions(
          createOptions({
            filters: {
              paymentPredicate: [
                {
                  value: 'id is defined',
                  key: 'paymentPredicate',
                },
              ],
            },
          }),
          [{ id: 'p1' }, { id: 'p2' }]
        )
      ).toEqual(
        expect.objectContaining({
          filters: expect.objectContaining({
            paymentPredicate: [
              {
                target: 'paymentPredicate',
                value: { value: ['p1', 'p2'] },
              },
            ],
          }),
        })
      );
    });
  });

  describe('paymentTransactionId', () => {
    it('should return options with new paymentTransactionId filter', () => {
      expect(
        buildPaymentFilterOptions(
          createOptions({
            filters: {
              paymentTransactionId: [
                {
                  value: 'test-transaction-id',
                  key: 'paymentTransactionId',
                },
              ],
            },
          }),
          [{ id: 'p1' }, { id: 'p2' }]
        )
      ).toEqual(
        expect.objectContaining({
          filters: expect.objectContaining({
            paymentTransactionId: [
              {
                target: 'paymentTransactionId',
                value: { value: ['p1', 'p2'] },
              },
            ],
          }),
        })
      );
    });
  });

  describe('paymentInteractionId', () => {
    it('should return options with new paymentInteractionId filter', () => {
      expect(
        buildPaymentFilterOptions(
          createOptions({
            filters: {
              paymentInteractionId: [
                {
                  value: 'test-transaction-id',
                  key: 'paymentInteractionId',
                },
              ],
            },
          }),
          [{ id: 'p1' }, { id: 'p2' }]
        )
      ).toEqual(
        expect.objectContaining({
          filters: expect.objectContaining({
            paymentInteractionId: [
              {
                target: 'paymentInteractionId',
                value: { value: ['p1', 'p2'] },
              },
            ],
          }),
        })
      );
    });
  });

  describe('paymentCustomField', () => {
    it('should return options with new paymentCustomField filter', () => {
      expect(
        buildPaymentFilterOptions(
          createOptions({
            filters: {
              paymentCustomField: [
                {
                  value: {
                    value: 'test-transaction-id',
                    target: 'paymentCustomField',
                    type: {
                      name: 'Boolean',
                    },
                  },
                  key: 'paymentCustomField',
                },
              ],
            },
          }),
          [{ id: 'p1' }, { id: 'p2' }]
        )
      ).toEqual(
        expect.objectContaining({
          filters: expect.objectContaining({
            paymentCustomField: [
              {
                target: 'paymentCustomField',
                value: { value: ['p1', 'p2'] },
              },
            ],
          }),
        })
      );
    });
  });
});

describe('mapFiltersToPredicate', () => {
  it('should return a valid predicate for orderState filter', () => {
    expect(
      mapFiltersToPredicate({
        orderState: [
          {
            value: { value: ['id1', 'id2'] },
            key: 'orderState',
          },
        ],
      })
    ).toEqual(['orderState in ("id1","id2")']);
  });
  it('should return a valid predicate for shipmentState filter', () => {
    expect(
      mapFiltersToPredicate({
        shipmentState: [
          {
            value: { value: ['id1', 'id2'] },
            key: 'shipmentState',
          },
        ],
      })
    ).toEqual(['shipmentState in ("id1","id2")']);
  });
  it('should return a valid predicate for paymentState filter', () => {
    expect(
      mapFiltersToPredicate({
        paymentState: [
          {
            value: { value: ['id1', 'id2'] },
            key: 'paymentState',
          },
        ],
      })
    ).toEqual(['paymentState in ("id1","id2")']);
  });
  it('should return a valid predicate for order status filter', () => {
    expect(
      mapFiltersToPredicate({
        'state.id': [
          {
            value: ['id1', 'id2'],
            key: 'state.id',
          },
        ],
      })
    ).toEqual(['state(id in ("id1","id2"))']);
  });
  describe('createdAt filter', () => {
    let filterToDatePredicate;
    beforeEach(() => {
      filterToDatePredicate = mapFiltersToPredicate({
        createdAt: [
          {
            value: '2017-01-01',
            type: 'equalTo',
            key: 'createdAt',
          },
        ],
      })[0];
    });
    it('should contain the start date for the filter', () => {
      expect(filterToDatePredicate).toContain('2017-01-01T00:00:00.000');
    });
    it('should contain the finish date for the filter', () => {
      expect(filterToDatePredicate).toContain('2017-01-01T23:59:59.999');
    });
  });

  it('should return a valid predicate for lineItemState filter', () => {
    expect(
      mapFiltersToPredicate({
        lineItemState: [
          {
            value: ['id1', 'id2'],
            key: 'lineItemState',
          },
        ],
      })
    ).toEqual([
      'lineItems(state(state(id in ("id1","id2")))) or customLineItems(state(state(id in ("id1","id2"))))',
    ]);
  });
  it('should return a valid predicate for orderPredicate filter', () => {
    expect(
      mapFiltersToPredicate({
        orderPredicate: [
          {
            value: 'id is defined',
            key: 'orderPredicate',
          },
        ],
      })
    ).toEqual(['id is defined']);
  });
  it('should return a valid predicate for paymentPredicate filter', () => {
    expect(
      mapFiltersToPredicate({
        paymentPredicate: [
          {
            value: { value: ['id1', 'id2'] },
            key: 'paymentPredicate',
          },
        ],
      })
    ).toEqual(['paymentInfo(payments(id in ("id1","id2")))']);
  });
  it('should return a valid predicate for firstName filter', () => {
    expect(
      mapFiltersToPredicate({
        firstName: [
          {
            value: 'Jon',
            key: 'firstName',
          },
        ],
      })
    ).toEqual([
      '(billingAddress(firstName in ("Jon", "jon", "Jon"))or shippingAddress(firstName in ("Jon", "jon", "Jon")))',
    ]);
  });
  it('should return a valid predicate for lastName filter', () => {
    expect(
      mapFiltersToPredicate({
        lastName: [
          {
            value: 'Snow',
            key: 'lastName',
          },
        ],
      })
    ).toEqual([
      '(billingAddress(lastName in ("Snow", "snow", "Snow"))or shippingAddress(lastName in ("Snow", "snow", "Snow")))',
    ]);
  });
});
