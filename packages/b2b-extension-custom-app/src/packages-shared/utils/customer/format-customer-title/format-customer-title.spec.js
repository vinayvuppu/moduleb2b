import formatCustomerTitle from './format-customer-title';

describe('formatCustomerTitle', () => {
  describe('when title available', () => {
    it('should render the title over the salutation', () => {
      expect(formatCustomerTitle({ title: 'Dr', salutation: 'Sl' })).toBe('Dr');
    });
  });
  describe('when no title available and salutation available', () => {
    it('should render the salutation when no title set', () => {
      expect(formatCustomerTitle({ title: undefined, salutation: 'Sl' })).toBe(
        'Sl'
      );
    });
  });
  describe('when no title and salutation available', () => {
    it('should return empty value when no title and salutation set', () => {
      expect(
        formatCustomerTitle({ title: undefined, salutation: undefined })
      ).toBe('');
    });
  });
});
