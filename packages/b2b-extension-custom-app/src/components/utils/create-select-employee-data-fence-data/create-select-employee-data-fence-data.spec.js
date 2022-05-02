import createSelectEmployeeDataFenceData from './create-select-employee-data-fence-data';

const createTestProps = custom => ({
  employee: {
    id: 'employee-id',
    stores: [
      {
        key: 'employee-store-key',
      },
    ],
  },
  ...custom,
});

const createDemandedDataFence = custom => ({
  type: 'store',
  group: 'customers',
  name: 'ManageCustomers',
  ...custom,
});

describe('with `employee.stores`', () => {
  let props;
  let selectDataFenceData;
  let demandedDataFence;
  describe('with `type=store`', () => {
    beforeEach(() => {
      props = createTestProps();
      selectDataFenceData = createSelectEmployeeDataFenceData(props);
      demandedDataFence = createDemandedDataFence();
    });
    it('should return `customer.stores`', () => {
      expect(selectDataFenceData(demandedDataFence)).toEqual([
        'employee-store-key',
      ]);
    });
  });
  describe('with `type=unsupported`', () => {
    beforeEach(() => {
      props = createTestProps();
      selectDataFenceData = createSelectEmployeeDataFenceData(props);
      demandedDataFence = createDemandedDataFence({
        type: 'unsupported',
      });
    });
    it('should return `null`', () => {
      expect(selectDataFenceData(demandedDataFence)).toEqual(null);
    });
  });
});

describe('without `employee.stores`', () => {
  let props;
  let selectDataFenceData;
  let demandedDataFence;
  describe('with `type=store`', () => {
    beforeEach(() => {
      props = createTestProps({
        employee: {
          stores: null,
        },
      });
      selectDataFenceData = createSelectEmployeeDataFenceData(props);
      demandedDataFence = createDemandedDataFence();
    });
    it('should return `[]`', () => {
      expect(selectDataFenceData(demandedDataFence)).toEqual([]);
    });
  });
});
