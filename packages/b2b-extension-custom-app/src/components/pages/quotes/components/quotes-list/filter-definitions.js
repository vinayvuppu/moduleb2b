import memoize from 'memoize-one';
import omit from 'lodash.omit';

import {
  createReferenceDefinitionsMap,
  createSingleTypesDefinitionsMap,
} from '@commercetools-local/core/components/search/standard-filter-definitions';

import { QUOTE_TYPES } from '../../constants';
import messages from './messages';
import styles from './quotes-list.mod.css';

export default memoize((intl, filtersToExclude = []) => {
  const filters = {
    companyId: {
      label: intl.formatMessage(messages.company),
      filterTypes: createReferenceDefinitionsMap(intl, {
        type: 'company',
        isMulti: false,
        className: styles['customer-group-reference'],
      }),
    },
    quoteState: {
      label: intl.formatMessage(messages.quoteState),
      filterTypes: createSingleTypesDefinitionsMap(intl, {
        options: [
          {
            label: intl.formatMessage(messages[QUOTE_TYPES.INITIAL]),
            value: QUOTE_TYPES.INITIAL,
          },
          {
            label: intl.formatMessage(messages[QUOTE_TYPES.SUBMITTED]),
            value: QUOTE_TYPES.SUBMITTED,
          },
          {
            label: intl.formatMessage(messages[QUOTE_TYPES.APPROVED]),
            value: QUOTE_TYPES.APPROVED,
          },
          {
            label: intl.formatMessage(messages[QUOTE_TYPES.CLOSED]),
            value: QUOTE_TYPES.CLOSED,
          },
          {
            label: intl.formatMessage(messages[QUOTE_TYPES.DECLINED]),
            value: QUOTE_TYPES.DECLINED,
          },
          {
            label: intl.formatMessage(messages[QUOTE_TYPES.EXPIRED]),
            value: QUOTE_TYPES.EXPIRED,
          },
          {
            label: intl.formatMessage(messages[QUOTE_TYPES.PLACED]),
            value: QUOTE_TYPES.PLACED,
          },
        ],
      }),
    },
  };
  return omit(filters, filtersToExclude);
});
