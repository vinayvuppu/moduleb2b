import PropTypes from 'prop-types';
import React from 'react';
import { Tag } from '@commercetools-frontend/ui-kit';
import styles from './single-filter-tag.mod.css';

const SingleFilterTag = props => (
  <Tag onRemove={props.onRemove} onClick={props.onClick}>
    <div className={styles.tagBody}>
      <div className={styles.bold}>
        {props.fieldLabel}
        {':'}
      </div>
      <div>{props.filterTypeLabel}</div>
      <div className={styles.bold}>{props.renderValue(props.value)}</div>
    </div>
  </Tag>
);

SingleFilterTag.displayName = 'SingleFilterTag';
SingleFilterTag.propTypes = {
  fieldLabel: PropTypes.string.isRequired,
  filterTypeLabel: PropTypes.string.isRequired,
  value: PropTypes.any,
  renderValue: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onClick: PropTypes.func,
};

export default SingleFilterTag;
