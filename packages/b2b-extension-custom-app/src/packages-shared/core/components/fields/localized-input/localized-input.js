import PropTypes from 'prop-types';
import React from 'react';
import localizedField from '../localized-field';
import ThrottledField from '../throttled-field';

const LocalizedInput = props => <ThrottledField {...props} onKeyUp={noop} />;
LocalizedInput.displayName = 'LocalizedInput';
LocalizedInput.propTypes = {
  value: PropTypes.string,
  definition: PropTypes.object,
};

LocalizedInput.defaultProps = {
  // text inputs don't respond to changes with null or undefined
  // https://github.com/facebook/react/issues/2533
  value: '',
};

export default localizedField(LocalizedInput);

function noop() {}
