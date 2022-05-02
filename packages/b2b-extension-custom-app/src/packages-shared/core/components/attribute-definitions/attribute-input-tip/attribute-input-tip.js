import React from 'react';
import PropTypes from 'prop-types';
import localize from '@commercetools-local/utils/localize';
import { Text } from '@commercetools-frontend/ui-kit';

const AttributeInputTip = ({ inputTip, language, languages }) => {
  if (!inputTip) return null;

  const text = localize({
    obj: { inputTip },
    key: 'inputTip',
    language,
    fallback: '',
    fallbackOrder: languages,
  });
  if (text) return <Text.Detail>{text}</Text.Detail>;
  return null;
};

AttributeInputTip.displayName = 'AttributeInputTip';

AttributeInputTip.propTypes = {
  inputTip: PropTypes.objectOf(PropTypes.string),
  language: PropTypes.string.isRequired,
  languages: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default AttributeInputTip;
