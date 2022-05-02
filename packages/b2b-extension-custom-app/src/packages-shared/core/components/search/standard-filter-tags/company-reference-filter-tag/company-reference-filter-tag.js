import { injectIntl } from 'react-intl';
import { compose } from 'recompose';
import withDereferencedStore from '../../standard-filters/with-dereferenced-store';
import ReferenceSingleFilterTag from '../reference-filter-tag';

// CompanyReferenceFilterTag
export default compose(
  injectIntl,
  withDereferencedStore({ isMulti: false })
)(ReferenceSingleFilterTag);
