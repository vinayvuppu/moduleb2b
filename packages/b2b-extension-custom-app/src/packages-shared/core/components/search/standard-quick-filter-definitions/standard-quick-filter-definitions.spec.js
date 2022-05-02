import {
  QUICK_FILTERS,
  QUICK_FILTERS_FOR_DATES,
  createOptionsForDateQuickFilters,
  defaultFilters,
} from './standard-quick-filter-definitions';

jest.mock('moment-timezone', () => () => ({
  format: () => '12/31/2016',
  subtract: jest.fn(() => ({
    format: jest.fn(() => '12/31/2016'),
  })),
}));

const intl = { formatMessage: message => message.id };

describe('constants', () => {
  it('export available quick filters', () => {
    expect(QUICK_FILTERS).toMatchSnapshot();
  });
  it('export available quick filters for dates', () => {
    expect(QUICK_FILTERS_FOR_DATES).toMatchSnapshot();
  });
});

describe('createOptionsForDateQuickFilters', () => {
  it('should return available options for date quic filters', () => {
    expect(createOptionsForDateQuickFilters(intl)).toMatchSnapshot();
  });
});

describe('defaultFilters', () => {
  it('should return default filter for `createdAt`', () => {
    expect(defaultFilters.createdAt).toMatchSnapshot();
  });
});
