import { injectIntl } from 'react-intl';
import { compose } from 'recompose';
import withDereferencedStore from '../../standard-filters/with-dereferenced-store';
import { ReferenceMultiFilterTag } from '../reference-filter-tag';

// StoreReferenceFilterTag
export default compose(
  injectIntl,
  withDereferencedStore({ isMulti: true })
)(ReferenceMultiFilterTag);
