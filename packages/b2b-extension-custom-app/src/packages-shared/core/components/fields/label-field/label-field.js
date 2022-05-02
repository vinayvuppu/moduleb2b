// NOTE: this component is duplicated in `app-shell/from-core`.
// It's a temporary solution to avoid importing `core` components from AppShell.
// Be careful when you change something here, remember to duplicate the changes.
import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import RequiredIndicator from '../../required-indicator';
import deprecateComponent from '../../deprecate-component';
import styles from './label-field.mod.css';

export const LabelField = ({ title, subtitle, isRequired, className }) => (
  <div>
    <label className={classnames(className, styles['label-wrapper'])}>
      <span className={styles.label}>
        <span>{title}</span>
        {isRequired ? <RequiredIndicator /> : null}
      </span>
    </label>
    {subtitle && (
      <div className={styles.description}>
        <span className={styles.text}>{subtitle}</span>
      </div>
    )}
  </div>
);
LabelField.displayName = 'LabelField';
LabelField.defaultProps = {
  isRequired: false,
};
LabelField.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  isRequired: PropTypes.bool,

  // for custom styles
  className: PropTypes.string,
};

export default deprecateComponent({
  message: 'Use `FieldLabel` from UI-Kit instead.',
})(LabelField);
