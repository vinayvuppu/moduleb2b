import { injectIntl } from 'react-intl';
import { compose } from 'recompose';
import withDereferencedCategory from '../../standard-filters/with-dereferenced-category';
import ReferenceSingleFilterTag from '../reference-filter-tag';

// CategoryReferenceFilterTag
export default compose(
  injectIntl,
  withDereferencedCategory({ isMulti: false })
)(ReferenceSingleFilterTag);
