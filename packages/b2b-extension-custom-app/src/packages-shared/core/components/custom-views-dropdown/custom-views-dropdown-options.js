import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {
  Text,
  AccessibleButton,
  DotIcon,
  Spacings,
} from '@commercetools-frontend/ui-kit';
import CustomViewsDropdownChevron from './custom-views-dropdown-chevron';
import styles from './custom-views-dropdown.mod.css';

const getTextTone = ({ isDisabled }) => (isDisabled ? 'secondary' : undefined);

export const SelectedOption = props => (
  <AccessibleButton
    label={props.name}
    className={styles['option-button']}
    onClick={props.onClick}
    isDisabled={props.isDisabled}
  >
    <div
      className={classnames(styles['selected-option-text'], {
        [styles['selected-option-text-is-dirty']]: props.isDirty,
      })}
    >
      <Spacings.Inline scale="s" alignItems="center" justifyContent="center">
        <div className={styles['option-name-text']}>
          <Text.Detail
            truncate
            isItalic={props.isImmutable}
            tone={getTextTone({
              isDisabled: props.isDisabled,
            })}
          >
            {props.name}
          </Text.Detail>
        </div>
        {props.isDirty && (
          <div className={classnames(styles['option-is-dirty-icon'])}>
            <DotIcon size="scale" color="warning" />
          </div>
        )}
      </Spacings.Inline>
      <CustomViewsDropdownChevron
        isOpen={props.isOpen}
        isDisabled={props.isDisabled}
      />
    </div>
  </AccessibleButton>
);

SelectedOption.defaultProps = {
  isDirty: false,
};
SelectedOption.displayName = 'SelectedOption';
SelectedOption.propTypes = {
  isDisabled: PropTypes.bool,
  isOpen: PropTypes.bool,
  isImmutable: PropTypes.bool,
  isDirty: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
};

export const SelectableOption = props => (
  <div
    className={classnames(styles['option-selectable'], {
      [styles['option-selectable-is-active']]: props.isActive,
    })}
  >
    <AccessibleButton
      label={props.name}
      className={styles['option-button']}
      onClick={props.onClick}
      isDisabled={props.isDisabled}
    >
      <div
        className={classnames(styles['option-text'], {
          [styles['option-text-is-dirty']]: props.isDirty,
        })}
      >
        <Spacings.Inline scale="s" alignItems="center" justifyContent="center">
          <div className={styles['option-name-text']}>
            <Text.Detail
              truncate
              isBold={props.isActive}
              isItalic={props.isImmutable}
              tone={getTextTone({
                isDisabled: props.isDisabled,
              })}
            >
              {props.name}
            </Text.Detail>
          </div>
          {props.isDirty && (
            <div className={classnames(styles['option-is-dirty-icon'])}>
              <DotIcon size="scale" color="warning" />
            </div>
          )}
          {!props.isDirty && props.icon && (
            <div className={classnames(styles['option-mode-icon'])}>
              {props.icon}
            </div>
          )}
        </Spacings.Inline>
      </div>
    </AccessibleButton>
  </div>
);

SelectableOption.displayName = 'SelectableOption';
SelectableOption.propTypes = {
  isDisabled: PropTypes.bool,
  isActive: PropTypes.bool,
  isImmutable: PropTypes.bool,
  onClick: PropTypes.func,
  isDirty: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  icon: PropTypes.node,
};

export default {
  Selectable: SelectableOption,
  Selected: SelectedOption,
};
