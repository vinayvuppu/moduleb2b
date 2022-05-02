import PropTypes from 'prop-types';
import React from 'react';
import { ListIcon, BackIcon, LinkButton } from '@commercetools-frontend/ui-kit';

export const BackToList = ({ iconType, ...props }) => {
  const icon =
    iconType === 'list' ? (
      <ListIcon size="medium" color="primary" />
    ) : (
      <BackIcon size="medium" color="primary" />
    );
  return <LinkButton {...props} iconLeft={icon} />;
};

BackToList.displayName = 'BackToList';
BackToList.propTypes = {
  to: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      pathname: PropTypes.string.isRequired,
      search: PropTypes.string,
      query: PropTypes.objectOf(PropTypes.string),
    }),
  ]).isRequired,
  label: PropTypes.node.isRequired,
  iconType: PropTypes.oneOf(['list', 'arrow']),
};
BackToList.defaultProps = {
  iconType: 'list',
};

export default BackToList;
