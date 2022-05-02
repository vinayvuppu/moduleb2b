import moment from 'moment-timezone';
import messages from './messages';

export const QUICK_FILTERS = {
  CREATED_AT: 'createdAt',
};

export const QUICK_FILTERS_FOR_DATES = {
  none: 'none',
  lastThirtyDays: 'lastThirtyDays',
  lastThreeMonths: 'lastThreeMonths',
  lastSixMonths: 'lastSixMonths',
  lastTwelveMonths: 'lastTwelveMonths',
};

const createTodayDate = () => moment().format('YYYY-MM-DD');

const substractFromDate = (durationSteps, durationType) =>
  moment()
    .subtract(durationSteps, durationType)
    .format('YYYY-MM-DD');

const createEmptyAppliedFilter = () => ({
  fieldName: QUICK_FILTERS.CREATED_AT,
  index: 0,
});

const createAppliedQuickFilterForMonths = (
  numberOfMonths,
  quickFilterValue
) => ({
  fieldName: QUICK_FILTERS.CREATED_AT,
  index: 0,
  filter: {
    type: 'range',
    value: {
      // This is the attribute that we use for distinguish the quick filter
      // from the regular one
      quickFilterValue,
      from: substractFromDate(numberOfMonths, 'months'),
      to: createTodayDate(),
    },
  },
});

const createAppliedQuickFilterForDays = (numberOfDays, quickFilterValue) => ({
  fieldName: QUICK_FILTERS.CREATED_AT,
  index: 0,
  filter: {
    type: 'range',
    value: {
      // This is the attribute that we use for distinguish the quick filter
      // from the regular one
      quickFilterValue,
      from: substractFromDate(numberOfDays, 'days'),
      to: createTodayDate(),
    },
  },
});

// eslint-disable-next-line import/prefer-default-export
export function createOptionsForDateQuickFilters(intl) {
  return [
    {
      label: intl.formatMessage(messages.none),
      value: QUICK_FILTERS_FOR_DATES.none,
      filter: createEmptyAppliedFilter(),
    },
    {
      label: intl.formatMessage(messages.lastThirtyDays),
      value: QUICK_FILTERS_FOR_DATES.lastThirtyDays,
      filter: createAppliedQuickFilterForDays(
        30,
        QUICK_FILTERS_FOR_DATES.lastThirtyDays
      ),
    },
    {
      label: intl.formatMessage(messages.lastThreeMonths),
      value: QUICK_FILTERS_FOR_DATES.lastThreeMonths,
      filter: createAppliedQuickFilterForMonths(
        3,
        QUICK_FILTERS_FOR_DATES.lastThreeMonths
      ),
    },
    {
      label: intl.formatMessage(messages.lastSixMonths),
      value: QUICK_FILTERS_FOR_DATES.lastSixMonths,
      filter: createAppliedQuickFilterForMonths(
        6,
        QUICK_FILTERS_FOR_DATES.lastSixMonths
      ),
    },
    {
      label: intl.formatMessage(messages.lastTwelveMonths),
      value: QUICK_FILTERS_FOR_DATES.lastTwelveMonths,
      filter: createAppliedQuickFilterForMonths(
        12,
        QUICK_FILTERS_FOR_DATES.lastTwelveMonths
      ),
    },
  ];
}

export const defaultFilters = {
  [QUICK_FILTERS.CREATED_AT]: [
    {
      type: 'range',
      value: {
        quickFilterValue: QUICK_FILTERS_FOR_DATES.lastThirtyDays,
        from: substractFromDate(30, 'days'),
        to: createTodayDate(),
      },
    },
  ],
};
