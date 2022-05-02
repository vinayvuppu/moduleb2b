import { FILTER_TYPES } from '../../constants';
import isEmptyRange from './range';
import isEmptySingle from './single';

export default function isEmptyFilter({ type, value }) {
  if (type === FILTER_TYPES.range) return isEmptyRange({ value });

  return isEmptySingle({ value });
}
