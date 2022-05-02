import { cartDraftToDoc } from './conversions';

const createAddressDraft = custom => ({
  id: 'test-id',
  firstName: 'Jon',
  lastName: 'Snow',
  phone: '1234',
  mobile: '1234',
  fax: '1234',
  email: 'jon@snow.targaryen.com',
  company: 'Night watch',
  streetName: 'Castle Black',
  streetNumber: '2',
  city: 'The Wall',
  postalCode: '00000',
  region: 'North',
  country: 'Westeros',
  additionalAddressInfo: 'Snow',
  ...custom,
});

describe('cartDraftToDoc', () => {
  let cartDraft;
  let doc;
  beforeEach(() => {
    cartDraft = {
      shippingAddress: createAddressDraft(),
      billingAddress: createAddressDraft(),
    };
    doc = cartDraftToDoc(cartDraft);
  });

  describe('shippingAddress', () => {
    it('should add `id` attribute', () => {
      expect(doc.shippingAddress).toHaveProperty('id', doc.shippingAddress.id);
    });
    it('should add `firstName` attribute', () => {
      expect(doc.shippingAddress).toHaveProperty(
        'firstName',
        cartDraft.shippingAddress.firstName
      );
    });
    it('should add `lastName` attribute', () => {
      expect(doc.shippingAddress).toHaveProperty(
        'lastName',
        cartDraft.shippingAddress.lastName
      );
    });
    it('should add `company` attribute', () => {
      expect(doc.shippingAddress).toHaveProperty(
        'company',
        cartDraft.shippingAddress.company
      );
    });
    it('should add `streetName` attribute', () => {
      expect(doc.shippingAddress).toHaveProperty(
        'streetName',
        cartDraft.shippingAddress.streetName
      );
    });
    it('should add `streetNumber` attribute', () => {
      expect(doc.shippingAddress).toHaveProperty(
        'streetNumber',
        cartDraft.shippingAddress.streetNumber
      );
    });
    it('should add `city` attribute', () => {
      expect(doc.shippingAddress).toHaveProperty(
        'city',
        cartDraft.shippingAddress.city
      );
    });
    it('should add `postalCode` attribute', () => {
      expect(doc.shippingAddress).toHaveProperty(
        'postalCode',
        cartDraft.shippingAddress.postalCode
      );
    });
    it('should add `country` attribute', () => {
      expect(doc.shippingAddress).toHaveProperty(
        'country',
        cartDraft.shippingAddress.country
      );
    });
    it('should add `region` attribute', () => {
      expect(doc.shippingAddress).toHaveProperty(
        'region',
        cartDraft.shippingAddress.region
      );
    });
    it('should add `additionalAddressInfo` attribute', () => {
      expect(doc.shippingAddress).toHaveProperty(
        'additionalAddressInfo',
        cartDraft.shippingAddress.additionalAddressInfo
      );
    });
    it('should add `phone` attribute', () => {
      expect(doc.shippingAddress).toHaveProperty(
        'phone',
        cartDraft.shippingAddress.phone
      );
    });
    it('should add `fax` attribute', () => {
      expect(doc.shippingAddress).toHaveProperty(
        'fax',
        cartDraft.shippingAddress.fax
      );
    });
    it('should add `mobile` attribute', () => {
      expect(doc.shippingAddress).toHaveProperty(
        'mobile',
        cartDraft.shippingAddress.mobile
      );
    });
    it('should add `email` attribute', () => {
      expect(doc.shippingAddress).toHaveProperty(
        'email',
        cartDraft.shippingAddress.email
      );
    });
  });
  describe('billingAddress', () => {
    it('should add `id` attribute', () => {
      expect(doc.billingAddress).toHaveProperty('id', doc.billingAddress.id);
    });
    it('should add `firstName` attribute', () => {
      expect(doc.billingAddress).toHaveProperty(
        'firstName',
        cartDraft.billingAddress.firstName
      );
    });
    it('should add `lastName` attribute', () => {
      expect(doc.billingAddress).toHaveProperty(
        'lastName',
        cartDraft.billingAddress.lastName
      );
    });
    it('should add `company` attribute', () => {
      expect(doc.billingAddress).toHaveProperty(
        'company',
        cartDraft.billingAddress.company
      );
    });
    it('should add `streetName` attribute', () => {
      expect(doc.billingAddress).toHaveProperty(
        'streetName',
        cartDraft.billingAddress.streetName
      );
    });
    it('should add `streetNumber` attribute', () => {
      expect(doc.billingAddress).toHaveProperty(
        'streetNumber',
        cartDraft.billingAddress.streetNumber
      );
    });
    it('should add `city` attribute', () => {
      expect(doc.billingAddress).toHaveProperty(
        'city',
        cartDraft.billingAddress.city
      );
    });
    it('should add `postalCode` attribute', () => {
      expect(doc.billingAddress).toHaveProperty(
        'postalCode',
        cartDraft.billingAddress.postalCode
      );
    });
    it('should add `country` attribute', () => {
      expect(doc.billingAddress).toHaveProperty(
        'country',
        cartDraft.billingAddress.country
      );
    });
    it('should add `region` attribute', () => {
      expect(doc.billingAddress).toHaveProperty(
        'region',
        cartDraft.billingAddress.region
      );
    });
    it('should add `additionalAddressInfo` attribute', () => {
      expect(doc.billingAddress).toHaveProperty(
        'additionalAddressInfo',
        cartDraft.billingAddress.additionalAddressInfo
      );
    });
    it('should add `phone` attribute', () => {
      expect(doc.billingAddress).toHaveProperty(
        'phone',
        cartDraft.billingAddress.phone
      );
    });
    it('should add `fax` attribute', () => {
      expect(doc.billingAddress).toHaveProperty(
        'fax',
        cartDraft.billingAddress.fax
      );
    });
    it('should add `mobile` attribute', () => {
      expect(doc.billingAddress).toHaveProperty(
        'mobile',
        cartDraft.billingAddress.mobile
      );
    });
    it('should add `email` attribute', () => {
      expect(doc.billingAddress).toHaveProperty(
        'email',
        cartDraft.billingAddress.email
      );
    });
  });
});
