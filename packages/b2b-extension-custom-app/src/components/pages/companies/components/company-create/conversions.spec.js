import { formValuesToDoc } from './conversions';

const createFormValues = custom => ({
  name: 'name',
  logo: 'logo',
  channels: [],
  addresses: [{ id: 'address-id-1' }],
  requiredApprovalRoles: [
    { rol: 'role1', amount: { amount: '393.33', currencyCode: 'USD' } },
  ],
  ...custom,
});

describe('formValuesToDoc', () => {
  let formValues;
  let doc;

  beforeEach(() => {
    formValues = createFormValues();
    doc = formValuesToDoc(formValues);
  });

  it('should convert to company draft', () => {
    expect(doc).toEqual({
      addresses: [{ id: 'address-id-1' }],
      channels: [],
      logo: 'logo',
      name: 'name',
      requiredApprovalRoles: [
        {
          rol: 'role1',
          amount: {
            centAmount: 39333,
            currencyCode: 'USD',
            fractionDigits: 2,
            type: 'centPrecision',
          },
        },
      ],
    });
  });

  describe('when the requiredApprovalRoles is empty array', () => {
    beforeEach(() => {
      formValues = createFormValues({ requiredApprovalRoles: [] });
      doc = formValuesToDoc(formValues);
    });

    it('should convert to company draft', () => {
      expect(doc).toEqual({
        addresses: [{ id: 'address-id-1' }],
        channels: [],
        logo: 'logo',
        name: 'name',
        requiredApprovalRoles: [],
      });
    });
  });
});
