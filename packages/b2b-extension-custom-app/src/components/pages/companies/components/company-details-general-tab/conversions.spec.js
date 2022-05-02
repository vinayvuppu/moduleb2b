import { docToFormValues, formValuesToDoc } from './conversions';

describe('docToFormValues', () => {
  let formValues;

  describe('when the company has custom rules', () => {
    beforeEach(() => {
      formValues = docToFormValues(
        {
          id: 'company-id',
          name: 'foo-name',
          logo: 'logo-1',
          defaultShippingAddress: 'id-1',
          defaultBillingAddress: 'id-1',
          channels: [],
          addresses: [{ id: 'id-1' }],
          requiredApprovalRoles: [],
          rules: [{ value: 'custom-rule' }],
        },
        'en'
      );
    });

    it('should convert the formValues', () => {
      expect(formValues).toEqual({
        addresses: [{ id: 'id-1' }],
        channels: [],
        id: 'company-id',
        logo: 'logo-1',
        budget: [],
        defaultShippingAddress: 'id-1',
        defaultBillingAddress: 'id-1',
        name: 'foo-name',
        requiredApprovalRoles: [],
        rules: [{ value: 'custom-rule' }],
      });
    });
  });

  describe('when the company has rol amount rule', () => {
    beforeEach(() => {
      formValues = docToFormValues(
        {
          id: 'company-id',
          name: 'foo-name',
          logo: 'logo-1',
          defaultShippingAddress: 'id-1',
          defaultBillingAddress: 'id-1',
          channels: [],
          addresses: [{ id: 'id-1' }],
          requiredApprovalRoles: ['role1'],
        },
        'en'
      );
    });

    it('should convert the formValues', () => {
      expect(formValues).toEqual({
        addresses: [{ id: 'id-1' }],
        channels: [],
        id: 'company-id',
        logo: 'logo-1',
        budget: [],
        defaultShippingAddress: 'id-1',
        defaultBillingAddress: 'id-1',
        name: 'foo-name',
        requiredApprovalRoles: ['role1'],
        rules: [],
      });
    });
  });
});

describe('formValuesToDoc', () => {
  let doc;

  beforeEach(() => {
    doc = formValuesToDoc({
      id: 'company-id',
      name: 'foo-name',
      logo: 'logo-1',
      channels: [],
      budget: [],
      addresses: [{ id: 'id-1' }],
      requiredApprovalRoles: ['role1'],
    });
  });

  it('should convert the formValues', () => {
    expect(doc).toEqual({
      addresses: [{ id: 'id-1' }],
      id: 'company-id',
      logo: 'logo-1',
      budget: [],
      name: 'foo-name',
      requiredApprovalRoles: ['role1'],
      channels: [],
    });
  });

  describe('when a custom rule is set', () => {
    beforeEach(() => {
      doc = formValuesToDoc({
        id: 'company-id',
        name: 'foo-name',
        logo: 'logo-1',
        channels: [],
        budget: [],
        addresses: [{ id: 'id-1' }],
        requiredApprovalRoles: ['role1'],
        rules: [
          {
            value:
              'order.totalPrice > 10000.00 or order.shippingInfo.price >= 10',
          },
        ],
      });
    });

    it('should convert the formValues', () => {
      expect(doc).toEqual({
        addresses: [{ id: 'id-1' }],
        id: 'company-id',
        logo: 'logo-1',
        budget: [],
        name: 'foo-name',
        requiredApprovalRoles: ['role1'],
        channels: [],
        rules: [
          {
            name: undefined,
            parsedValue:
              '{"any":[{"all":[{"fact":"totalPrice","path":"$.centAmount","operator":"greaterThan","value":1000000}]},{"all":[{"fact":"shippingInfo","path":"$.price.centAmount","operator":"greaterThanInclusive","value":1000}]}]}',
            value:
              'order.totalPrice > 10000.00 or order.shippingInfo.price >= 10',
          },
        ],
      });
    });
  });

  describe('when there is budget', () => {
    beforeEach(() => {
      doc = formValuesToDoc({
        budget: [
          {
            rol: 'admin',
            amount: {
              centAmount: '100.00',
              currencyCode: 'USD',
            },
          },
        ],
      });
    });
    it('should convert the formValues', () => {
      expect(doc).toEqual({
        budget: [
          {
            amount: { centAmount: '100.00', currencyCode: 'USD' },
            rol: 'admin',
          },
        ],
      });
    });
  });
});
