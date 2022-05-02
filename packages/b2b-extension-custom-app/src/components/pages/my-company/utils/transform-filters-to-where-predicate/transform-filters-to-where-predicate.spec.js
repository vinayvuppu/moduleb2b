import customFieldsTransformer from '@commercetools-local/utils/filters/custom-fields';
import transformFiltersToWherePredicate from './transform-filters-to-where-predicate';

describe('createFilterPredicate', () => {
  describe('orderStatus', () => {
    it('should return config for a "orderStatus" single filter', () => {
      expect(
        transformFiltersToWherePredicate({
          target: 'orderState',
          value: [{ value: { value: 'foo' } }],
        })
      ).toMatchSnapshot();
    });
    it('should return config for a "orderStatus" multi filter', () => {
      expect(
        transformFiltersToWherePredicate({
          target: 'orderState',
          value: [{ value: ['foo', 'bar'] }],
        })
      ).toMatchSnapshot();
    });
  });
  describe('orderState', () => {
    it('should return config for a "orderState" single filter', () => {
      expect(
        transformFiltersToWherePredicate({
          target: 'state.id',
          value: [{ value: ['foo'] }],
        })
      ).toMatchSnapshot();
    });
    it('should return config for a "orderState" multi filter', () => {
      expect(
        transformFiltersToWherePredicate({
          target: 'state.id',
          value: [{ value: ['foo', 'bar'] }],
        })
      ).toMatchSnapshot();
    });
  });
  describe('shipmentState', () => {
    it('should return config for a "shipmentState" single filter', () => {
      expect(
        transformFiltersToWherePredicate({
          target: 'shipmentState',
          value: [{ value: { value: 'foo' } }],
        })
      ).toMatchSnapshot();
    });
    it('should return config for a "shipmentState" multi filter', () => {
      expect(
        transformFiltersToWherePredicate({
          target: 'shipmentState',
          value: [{ value: ['foo', 'bar'] }],
        })
      ).toMatchSnapshot();
    });
  });
  describe('paymentState', () => {
    it('should return config for a "paymentState" single filter', () => {
      expect(
        transformFiltersToWherePredicate({
          target: 'paymentState',
          value: [{ value: { value: 'foo' } }],
        })
      ).toMatchSnapshot();
    });
    it('should return config for a "paymentState" multi filter', () => {
      expect(
        transformFiltersToWherePredicate({
          target: 'paymentState',
          value: [{ value: ['foo', 'bar'] }],
        })
      ).toMatchSnapshot();
    });
  });
  describe('createdAt', () => {
    it('should return config for a "createdAt" single filter', () => {
      expect(
        transformFiltersToWherePredicate({
          target: 'createdAt',
          value: [
            {
              type: 'lessThan',
              value: '2017-11-01',
            },
          ],
        })
      ).toMatchSnapshot();
    });
    describe('when the filter is `range` or `on`', () => {
      let filterDateToDatePredicate;
      beforeEach(() => {
        filterDateToDatePredicate = transformFiltersToWherePredicate({
          target: 'createdAt',
          value: [
            {
              type: 'range',
              value: { from: '2017-11-01', to: '2017-11-09' },
            },
          ],
        });
      });
      it('should contain the start date for the filter', () => {
        expect(filterDateToDatePredicate).toContain('2017-11-01T00:00:00.000');
      });
      it('should contain the finish date for the filter', () => {
        expect(filterDateToDatePredicate).toContain('2017-11-09T23:59:59.999');
      });
    });
  });
  describe('lineItemState', () => {
    it('should return config for a "lineItemState" single filter', () => {
      expect(
        transformFiltersToWherePredicate({
          target: 'paymentState',
          value: [{ value: { value: 'foo' } }],
        })
      ).toMatchSnapshot();
    });
    it('should return config for a "lineItemState" multi filter', () => {
      expect(
        transformFiltersToWherePredicate({
          target: 'paymentState',
          value: [{ value: ['foo', 'bar'] }],
        })
      ).toMatchSnapshot();
    });
  });
  describe('customer first name', () => {
    it('should return config for a "firstName" single filter', () => {
      expect(
        transformFiltersToWherePredicate({
          target: 'firstName',
          value: [
            {
              type: 'equalTo',
              value: 'test',
            },
          ],
        })
      ).toMatchSnapshot();
    });

    it('should return config for a "firstName" single filter when composed name', () => {
      expect(
        transformFiltersToWherePredicate({
          target: 'firstName',
          value: [
            {
              type: 'equalTo',
              value: 'name secondname',
            },
          ],
        })
      ).toMatchSnapshot();
    });
  });
  describe('order predicate', () => {
    it('should return config for a "orderPredicate" filter', () => {
      expect(
        transformFiltersToWherePredicate({
          target: 'orderPredicate',
          value: [{ value: { value: 'foo' } }],
        })
      ).toMatchSnapshot();
    });
  });
  describe('payment predicate', () => {
    it('should return config for a "paymentPredicate" filter', () => {
      expect(
        transformFiltersToWherePredicate({
          target: 'paymentPredicate',
          value: [{ value: { value: 'foo' } }],
        })
      ).toMatchSnapshot();
    });
  });
  describe('customer last name', () => {
    it('should return config for a "lastName" single filter', () => {
      expect(
        transformFiltersToWherePredicate({
          target: 'lastName',
          value: [
            {
              type: 'equalTo',
              value: 'surnametest',
            },
          ],
        })
      ).toMatchSnapshot();
    });
    it('should return config for a "lastName" single filter when composed last name', () => {
      expect(
        transformFiltersToWherePredicate({
          target: 'lastName',
          value: [
            {
              type: 'equalTo',
              value: 'surnametest surname',
            },
          ],
        })
      ).toMatchSnapshot();
    });
  });
  describe('item SKU', () => {
    it('should return config for a "skuFilter" single filter', () => {
      expect(
        transformFiltersToWherePredicate({
          target: 'skuFilter',
          value: [{ type: 'equalTo', value: 'test' }],
        })
      ).toMatchSnapshot();
    });
  });
  describe('billing address city', () => {
    it('should return config for a "billingAddressCityFilter" single filter', () => {
      expect(
        transformFiltersToWherePredicate({
          target: 'billingAddressCityFilter',
          value: [{ type: 'equalTo', value: 'test' }],
        })
      ).toMatchSnapshot();
    });
  });
  describe('billing address postal code', () => {
    it('should return config for a "billingAddressPostalCodeFilter" single filter', () => {
      expect(
        transformFiltersToWherePredicate({
          target: 'billingAddressPostalCodeFilter',
          value: [{ type: 'equalTo', value: 'test' }],
        })
      ).toMatchSnapshot();
    });
  });
  describe('shipping address city', () => {
    it('should return config for a "shippingAddressCityFilter" single filter', () => {
      expect(
        transformFiltersToWherePredicate({
          target: 'shippingAddressCityFilter',
          value: [{ type: 'equalTo', value: 'test' }],
        })
      ).toMatchSnapshot();
    });
  });
  describe('shipping address postal code', () => {
    it('should return config for a "shippingAddressPostalCodeFilter" single filter', () => {
      expect(
        transformFiltersToWherePredicate({
          target: 'shippingAddressPostalCodeFilter',
          value: [{ type: 'equalTo', value: 'test' }],
        })
      ).toMatchSnapshot();
    });
  });
  describe('payment transaction ID', () => {
    it('should return config for a "paymentTransactionId" single filter', () => {
      expect(
        transformFiltersToWherePredicate({
          target: 'paymentTransactionId',
          value: [{ type: 'equalTo', value: 'test' }],
        })
      ).toMatchSnapshot();
    });
  });
  describe('payment interaction ID', () => {
    it('should return config for a "paymentInteractionId" single filter', () => {
      expect(
        transformFiltersToWherePredicate({
          target: 'paymentInteractionId',
          value: [{ type: 'equalTo', value: 'test' }],
        })
      ).toMatchSnapshot();
    });
  });
  describe('payment custom field', () => {
    it('should return config for a "paymentCustomField" single filter', () => {
      expect(
        transformFiltersToWherePredicate({
          target: 'paymentCustomField',
          value: [{ type: 'equalTo', value: 'test' }],
        })
      ).toMatchSnapshot();
    });
  });
  describe('orderNumber', () => {
    it('should return config for a "orderNumber" single filter', () => {
      expect(
        transformFiltersToWherePredicate({
          target: 'orderNumber',
          value: [
            {
              type: 'equalTo',
              value: [{ value: 'Foo123bar', label: 'Foo123bar' }],
            },
          ],
        })
      ).toMatchSnapshot();
    });
  });
  describe('customerGroup.id', () => {
    it('should return config for a "customerGroup.id" single filter', () => {
      expect(
        transformFiltersToWherePredicate({
          target: 'customerGroup.id',
          value: [
            {
              type: 'equalTo',
              value: ['companyId'],
            },
          ],
        })
      ).toMatchSnapshot();
    });
  });
  describe('orderCustomField', () => {
    it('should return config for a "orderCustomField" single filter', () => {
      expect(
        customFieldsTransformer([
          {
            value: {
              target: 'orderCustomField',
              value: 'Foo123bar',
              label: 'Foo123bar',
              type: { name: 'String' },
            },
          },
        ])
      ).toMatchSnapshot();
    });
  });
});
