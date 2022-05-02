import PropTypes from 'prop-types';
import React from 'react';
import { withApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import localize from '@commercetools-local/utils/localize';

export const Localize = props => (
  <span>
    {localize({
      obj: props.object,
      key: props.objectKey,
      language: props.language,
      fallbackOrder: props.languages,
      fallback: props.fallback,
    })}
  </span>
);
Localize.displayName = 'Localize';
Localize.propTypes = {
  object: PropTypes.object.isRequired,
  objectKey: PropTypes.string.isRequired,
  fallback: PropTypes.string,

  // HoC
  language: PropTypes.string.isRequired,
  languages: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default withApplicationContext(applicationContext => ({
  language: applicationContext.dataLocale,
  languages: applicationContext.project.languages,
}))(Localize);
