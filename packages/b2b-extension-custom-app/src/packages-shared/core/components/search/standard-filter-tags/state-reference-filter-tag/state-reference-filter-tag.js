import { injectIntl } from 'react-intl';
import { compose } from 'recompose';
import withDereferencedState from '../../standard-filters/with-dereferenced-state';
import { ReferenceMultiFilterTag } from '../reference-filter-tag';

export default function createStateFilterTag(stateType) {
  return compose(
    injectIntl,
    withDereferencedState({ isMulti: true, stateType })
  )(ReferenceMultiFilterTag);
}
