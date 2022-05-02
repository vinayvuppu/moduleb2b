import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import { filterDataAttributes } from '@commercetools-local/utils/dataset';
import styles from './form-box.mod.css';

const getStyles = props =>
  classnames(styles[`${props.width}-width-form-box`], {
    [styles['has-warning']]: props.hasWarning,
  });

const FormBox = props => (
  <div className={getStyles(props)} {...filterDataAttributes(props)}>
    {props.children}
  </div>
);
FormBox.displayName = 'FormBox';
FormBox.propTypes = {
  children: PropTypes.node.isRequired,
  width: PropTypes.oneOf(['single', 'double', 'full']),
  hasWarning: PropTypes.bool,
};
FormBox.defaultProps = {
  hasWarning: false,
  width: 'single',
};

export default FormBox;
