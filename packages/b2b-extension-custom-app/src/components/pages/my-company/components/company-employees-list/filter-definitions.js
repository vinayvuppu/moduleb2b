import memoize from 'memoize-one';
import { createTextDefinitionsMap } from '@commercetools-local/core/components/search/standard-filter-definitions';
import messages from './messages';

export default memoize(({ intl }) => ({
  firstName: {
    label: intl.formatMessage(messages.firstNameFilter),
    filterTypes: createTextDefinitionsMap(intl),
  },
  lastName: {
    label: intl.formatMessage(messages.lastNameFilter),
    filterTypes: createTextDefinitionsMap(intl),
  },
  // middleName: {
  //   label: intl.formatMessage(messages.middleNameFilter),
  //   filterTypes: createTextDefinitionsMap(intl),
  // },
  // vatId: {
  //   label: intl.formatMessage(messages.vatIdFilter),
  //   filterTypes: createTextDefinitionsMap(intl),
  // },
  // createdAt: {
  //   label: intl.formatMessage(messages.createdAtFilter),
  //   filterTypes: createDateDefinitionsMap(intl),
  // },
  // lastModifiedAt: {
  //   label: intl.formatMessage(messages.lastModifiedAtFilter),
  //   filterTypes: createDateDefinitionsMap(intl),
  // },
}));
