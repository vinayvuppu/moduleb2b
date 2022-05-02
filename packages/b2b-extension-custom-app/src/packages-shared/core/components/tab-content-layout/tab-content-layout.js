import PropTypes from 'prop-types';
import React from 'react';
import { filterDataAttributes } from '@commercetools-local/utils/dataset';
import styles from './tab-content-layout.mod.css';

const TabContentLayout = ({ header, description, children, ...rest }) => (
  <div className={styles.container} {...filterDataAttributes(rest)}>
    {(header || description) && (
      <div className={styles.header}>
        {header && <div>{header}</div>}
        {description && <div className={styles.description}>{description}</div>}
      </div>
    )}
    <div className={styles.content}>{children}</div>
  </div>
);
TabContentLayout.displayName = 'TabContentLayout';
TabContentLayout.propTypes = {
  header: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  children: PropTypes.node.isRequired,
};

export default TabContentLayout;
