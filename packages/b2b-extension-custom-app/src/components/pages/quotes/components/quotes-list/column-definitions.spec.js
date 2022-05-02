import createColumnDefinitions from './column-definitions';

const formatMessage = data => data.id;

describe('createColumnDefinitions', () => {
  let columns;
  describe('when no columns to exclude', () => {
    beforeEach(() => {
      columns = createColumnDefinitions(formatMessage, []);
    });

    it('quoteState column should exist', () => {
      expect(columns).toEqual(
        expect.arrayContaining([expect.objectContaining({ key: 'quoteState' })])
      );
    });
    it('totalPrice column should exist', () => {
      expect(columns).toEqual(
        expect.arrayContaining([expect.objectContaining({ key: 'totalPrice' })])
      );
    });
    it('totalLineItemCount column should exist', () => {
      expect(columns).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ key: 'totalLineItemCount' }),
        ])
      );
    });
    it('company column should exist', () => {
      expect(columns).toEqual(
        expect.arrayContaining([expect.objectContaining({ key: 'company' })])
      );
    });
    it('employeeEmail column should exist', () => {
      expect(columns).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ key: 'employeeEmail' }),
        ])
      );
    });
    it('actions column should exist', () => {
      expect(columns).toEqual(
        expect.arrayContaining([expect.objectContaining({ key: 'actions' })])
      );
    });
  });

  describe('when columns to exclude', () => {
    beforeEach(() => {
      columns = createColumnDefinitions(formatMessage, ['company', 'actions']);
    });

    it('quoteState column should exist', () => {
      expect(columns).toEqual(
        expect.arrayContaining([expect.objectContaining({ key: 'quoteState' })])
      );
    });
    it('totalPrice column should exist', () => {
      expect(columns).toEqual(
        expect.arrayContaining([expect.objectContaining({ key: 'totalPrice' })])
      );
    });
    it('totalLineItemCount column should exist', () => {
      expect(columns).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ key: 'totalLineItemCount' }),
        ])
      );
    });
    it('company column should not exist', () => {
      expect(columns).not.toEqual(
        expect.arrayContaining([expect.objectContaining({ key: 'company' })])
      );
    });
    it('actions column should not exist', () => {
      expect(columns).not.toEqual(
        expect.arrayContaining([expect.objectContaining({ key: 'actions' })])
      );
    });
    it('employeeEmail column should exist', () => {
      expect(columns).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ key: 'employeeEmail' }),
        ])
      );
    });
  });
});
