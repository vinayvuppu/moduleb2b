import React from 'react';
import PropTypes from 'prop-types';
import { CaretDownIcon, CaretUpIcon } from '@commercetools-frontend/ui-kit';
import styles from './custom-views-dropdown.mod.css';

export const CustomViewsDropdownChevron = props => (
  <div className={styles['dropdown-chevron']}>
    {props.isOpen ? (
      <CaretUpIcon
        size="small"
        color={props.isDisabled ? 'neutral60' : undefined}
      />
    ) : (
      <CaretDownIcon
        size="small"
        color={props.isDisabled ? 'neutral60' : undefined}
      />
    )}
  </div>
);

CustomViewsDropdownChevron.displayName = 'CustomViewsDropdownChevron';
CustomViewsDropdownChevron.propTypes = {
  isDisabled: PropTypes.bool,
  isOpen: PropTypes.bool.isRequired,
};

export default CustomViewsDropdownChevron;
