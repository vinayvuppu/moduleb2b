import transformFiltersToWherePredicate from './transform-filters-to-where-predicate';

describe('createFilterPredicate', () => {
  describe('customerGroup.id', () => {
    it('should return config for a "customerGroup.id" single filter', () => {
      expect(
        transformFiltersToWherePredicate({
          target: 'customerGroup.id',
          value: [{ value: { value: 'CG-1' } }],
        })
      ).toMatchSnapshot();
    });
    it('should return config for a "customerGroup.id" multi filter', () => {
      expect(
        transformFiltersToWherePredicate({
          target: 'customerGroup.id',
          value: [{ value: ['CG-1', 'CG-2'] }],
        })
      ).toMatchSnapshot();
    });
  });
  describe('dateOfBirth', () => {
    it('should return config for a "dateOfBirth" single filter', () => {
      expect(
        transformFiltersToWherePredicate({
          target: 'dateOfBirth',
          value: [
            {
              type: 'lessThan',
              value: '2017-11-01',
            },
          ],
        })
      ).toMatchSnapshot();
    });
    it('should return config for a "dateOfBirth" range filter', () => {
      expect(
        transformFiltersToWherePredicate({
          target: 'dateOfBirth',
          value: [
            {
              type: 'range',
              value: { from: '2017-11-01', to: '2017-11-09' },
            },
          ],
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
      it('should contain the start date for the filter', () => {
        expect(
          transformFiltersToWherePredicate({
            target: 'createdAt',
            value: [
              {
                type: 'range',
                value: { from: '2017-11-01', to: '2017-11-09' },
              },
            ],
          })
        ).toContain('2017-11-01T00:00:00.000');
      });
      it('should contain the finish date for the filter', () => {
        expect(
          transformFiltersToWherePredicate({
            target: 'createdAt',
            value: [
              {
                type: 'range',
                value: { from: '2017-11-01', to: '2017-11-09' },
              },
            ],
          })
        ).toContain('2017-11-09T23:59:59.999');
      });
    });
  });
  describe('lastModifiedAt', () => {
    it('should return config for a "lastModifiedAt" single filter', () => {
      expect(
        transformFiltersToWherePredicate({
          target: 'lastModifiedAt',
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
      it('should contain the start date for the filter', () => {
        expect(
          transformFiltersToWherePredicate({
            target: 'lastModifiedAt',
            value: [
              {
                type: 'range',
                value: { from: '2017-11-01', to: '2017-11-09' },
              },
            ],
          })
        ).toContain('2017-11-01T00:00:00.000');
      });
      it('should contain the finish date for the filter', () => {
        expect(
          transformFiltersToWherePredicate({
            target: 'lastModifiedAt',
            value: [
              {
                type: 'range',
                value: { from: '2017-11-01', to: '2017-11-09' },
              },
            ],
          })
        ).toContain('2017-11-09T23:59:59.999');
      });
    });
  });
  describe('first name', () => {
    it('should return config for a "firstName" single filter', () => {
      expect(
        transformFiltersToWherePredicate({
          target: 'firstName',
          value: [
            {
              type: 'equalTo',
              value: 'surnametest',
            },
          ],
        })
      ).toMatchSnapshot();
    });
  });
  describe('last name', () => {
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
  });
  describe('middle name', () => {
    it('should return config for a "middleName" single filter', () => {
      expect(
        transformFiltersToWherePredicate({
          target: 'middleName',
          value: [
            {
              type: 'equalTo',
              value: 'surnametest',
            },
          ],
        })
      ).toMatchSnapshot();
    });
  });
  describe('VAT ID', () => {
    it('should return config for a "vatId" single filter', () => {
      expect(
        transformFiltersToWherePredicate({
          target: 'vatId',
          value: [
            {
              type: 'equalTo',
              value: 'surnametest',
            },
          ],
        })
      ).toMatchSnapshot();
    });
  });
});
