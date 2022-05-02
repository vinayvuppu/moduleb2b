import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import styles from './shadow.mod.css';

const Shadow = props => (
  <div className={classnames(styles[`shadow-${props.depth}`], props.className)}>
    {props.children}
  </div>
);
Shadow.displayName = 'Shadow';
Shadow.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  depth: PropTypes.oneOf(['1', '2', '3', '4', '5']).isRequired,
};

export default Shadow;
