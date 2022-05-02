import PropTypes from 'prop-types';
import React, { isValidElement } from 'react';
import classnames from 'classnames';
import { filterDataAttributes } from '@commercetools-local/utils/dataset';
import Button from '../button';
import styles from '../button/button.mod.css';

/**
 * Button-Typed
 *
 * This module generates button components based on a name, type and several
 * default options.
 *
 * Each button has a TYPE (save, confirm, cancel, add) and may have a STYLE
 * (default, alternative)
 *
 * Each button may or may not have a default label and icon. If no default label
 * is provided, then label becomes a required prop. If no default icon is
 * provided then icon is still an optional prop.
 *
 * If the option hasAlternativeStyle is true, then the `style` prop may be either
 * "default" or "alternative", otherwise the style prop will default to "default"
 * and can not be set to anything else.
 */

export default function(name, options) {
  const {
    defaultLabel,
    defaultIcon,
    type,
    hasAlternativeStyle,
    buttonWrapperClassName,
  } = options;
  const validTypes = ['save', 'cancel', 'confirm', 'add'];

  if (!validTypes.includes(type))
    throw new Error('Invalid button type provided to ButtonTyped');

  const ButtonTyped = props => {
    const {
      label,
      onClick,
      isDisabled,
      fullWidth,
      style,
      icon,
      url,
      className,
    } = props;

    const isAlternativeStyle = hasAlternativeStyle && style === 'alternative';
    const hasIcon = defaultIcon || icon;

    const classNames = classnames(
      { [styles.full]: fullWidth },
      isAlternativeStyle ? styles[`${type}-alt`] : styles[type],
      className
    );
    const computedLabel = label || defaultLabel;
    const dataAttrs = filterDataAttributes(props);

    return (
      <Button
        onClick={isDisabled ? null : onClick}
        url={url}
        isDisabled={isDisabled}
        className={classNames}
        {...dataAttrs}
      >
        {/* this wrapper div is necessary because the html button element can't
        be a flex container in some browsers */}
        <div className={buttonWrapperClassName}>
          {isValidElement(computedLabel) ? (
            computedLabel
          ) : (
            <span>{computedLabel}</span>
          )}
          {hasIcon ? icon || defaultIcon : null}
        </div>
      </Button>
    );
  };

  ButtonTyped.displayName = name;

  ButtonTyped.propTypes = {
    label: defaultLabel
      ? PropTypes.oneOfType([PropTypes.string, PropTypes.element])
      : PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
    url: PropTypes.string,
    onClick: PropTypes.func,
    isDisabled: PropTypes.bool,
    fullWidth: PropTypes.bool,
    icon: PropTypes.element,
    className: PropTypes.string,
    style: props => {
      if (!hasAlternativeStyle && props.style !== 'default')
        return new Error(
          `Invalid prop for ${name}. 'style' is not a valid property`
        );
      if (!['default', 'alternative'].includes(props.style))
        return new Error(
          `Invalid prop for ${name}.` +
            "'style' must be either 'default' or 'alternative'"
        );

      return null;
    },
  };

  ButtonTyped.defaultProps = {
    isDisabled: false,
    fullWidth: false,
    style: 'default',
    icon: null,
    className: null,
  };

  return ButtonTyped;
}
