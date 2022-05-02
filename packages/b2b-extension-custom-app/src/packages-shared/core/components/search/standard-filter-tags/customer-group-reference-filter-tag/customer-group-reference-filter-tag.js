import { injectIntl } from 'react-intl';
import { compose } from 'recompose';
import withDereferencedCustomerGroup from '../../standard-filters/with-dereferenced-customer-group';
import { ReferenceMultiFilterTag } from '../reference-filter-tag';

// CustomerGroupReferenceFilterTag
export default compose(
  injectIntl,
  withDereferencedCustomerGroup({ isMulti: true })
)(ReferenceMultiFilterTag);
