import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import { filterDataAttributes } from '@commercetools-local/utils/dataset';
import Button from '../button';
import customStyles from './button-group.mod.css';

export class ButtonGroup extends React.PureComponent {
  render() {
    return (
      <div
        className={customStyles['btn-group']}
        {...filterDataAttributes(this.props)}
      >
        {this.props.options.map((option, index) => (
          <Button
            data-track-component={`Button-${option.label}`}
            data-testid={`group-button-${option.value}`}
            data-track-event="click"
            type="button"
            data-track-label={option.label || option.value}
            key={index}
            isDisabled={option.disabled || this.props.value === option.value}
            onClick={() => this.props.onClick(option.value)}
            className={classnames({
              [customStyles.active]:
                !option.disabled && this.props.value === option.value,
              [customStyles.disabled]: option.disabled,
            })}
            {...filterDataAttributes(this.props)}
          >
            {option.icon ? (
              <div className={customStyles['icon-container']}>
                {option.icon}
              </div>
            ) : (
              <span>{option.label}</span>
            )}
          </Button>
        ))}
      </div>
    );
  }
}
ButtonGroup.displayName = 'ButtonGroup';
ButtonGroup.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      icon: PropTypes.node,
      value: PropTypes.string,
      disabled: PropTypes.bool,
    })
  ).isRequired,
  onClick: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

export default ButtonGroup;
