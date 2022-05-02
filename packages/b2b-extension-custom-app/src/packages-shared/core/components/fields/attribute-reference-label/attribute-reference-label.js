import PropTypes from 'prop-types';
import React from 'react';
import { getReferenceTypeId } from '@commercetools-local/utils/type-definitions';
import getReferenceSearchComponentByType from '../../attribute-definitions/reference-search';
import styles from './attribute-reference-label.mod.css';

const AttributeReferenceLabel = ({
  definition,
  definition: {
    type: { name },
  },
}) => {
  if (
    name === 'reference' ||
    (name === 'set' && definition.type.elementType.name === 'reference')
  ) {
    const typeId = getReferenceTypeId(definition);
    const isSearchable = getReferenceSearchComponentByType(typeId);
    return (
      <span className={styles['attribute-reference']}>
        {typeId}
        {!isSearchable && ' ID'}
      </span>
    );
  }

  return null;
};
AttributeReferenceLabel.displayName = 'AttributeReferenceLabel';
AttributeReferenceLabel.propTypes = {
  definition: PropTypes.shape({
    type: PropTypes.shape({
      name: PropTypes.string,
      elementType: PropTypes.shape({ name: PropTypes.string }),
    }).isRequired,
  }).isRequired,
};

export default AttributeReferenceLabel;
