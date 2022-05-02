import PropTypes from 'prop-types';
import React from 'react';
import styles from './container.mod.css';

const Container = ({ children }) => (
  <div className={styles.container}>{children}</div>
);
Container.displayName = 'Container';
Container.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Container;
