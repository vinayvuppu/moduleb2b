import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { compose } from 'recompose';
import classnames from 'classnames';
import {
  CaretDownIcon,
  CaretUpIcon,
  IconButton,
} from '@commercetools-frontend/ui-kit';
import { filterDataAttributes } from '@commercetools-local/utils/dataset';
import keepDisplayName from '../../keep-display-name';
import styles from './dropdown.mod.css';
import messages from './messages';

export default function dropdown(DropdownMenu) {
  class DropDownComponent extends React.PureComponent {
    static displayName = 'Dropdown';

    static propTypes = {
      // styles for the dropdown-container
      containerClassName: PropTypes.string,
      // styles for the actionable-label
      labelClassName: PropTypes.string,
      menuClassName: PropTypes.string,
      dropdownName: PropTypes.string.isRequired,
      dropdownMenuPosition: PropTypes.oneOf([
        'top',
        'right',
        'bottom',
        'left',
        'top-right',
        'top-left',
        'bottom-right',
        'bottom-left',
      ]),
      shouldClose: PropTypes.bool,
      onFocus: PropTypes.func,
      onClose: PropTypes.func,
      label: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
      buttonIcon: PropTypes.element,
      // An object holding props to be passed to the
      // menu component.
      dropdownMenuProps: PropTypes.object.isRequired,
      disabled: PropTypes.bool,
      intl: PropTypes.shape({ formatMessage: PropTypes.func.isRequired })
        .isRequired,
    };

    static defaultProps = {
      dropdownMenuPosition: 'bottom-right',
      shouldClose: false,
      disabled: false,
    };

    state = { isOpen: false, topOffset: 0 };

    componentDidMount() {
      window.addEventListener('click', this.shouldCloseDropdownMenu, true);
    }

    componentWillUnmount() {
      window.removeEventListener('click', this.shouldCloseDropdownMenu, true);
    }

    // eslint-disable-next-line camelcase
    UNSAFE_componentWillReceiveProps(nextProps) {
      if (this.state.isOpen && nextProps.shouldClose) {
        this.setState({ isOpen: false });
        if (this.props.onClose) this.props.onClose();
      }
    }

    componentDidUpdate() {
      // TODO: find a better way to do it!
      /* eslint-disable react/no-did-update-set-state */
      if (this.props.dropdownMenuPosition.includes('top-')) {
        const menuOffset = -this.dropdownMenu.offsetHeight;
        if (this.state.topOffset !== menuOffset)
          this.setState({ topOffset: menuOffset });
      }
      /* eslint-enable react/no-did-update-set-state */
    }

    shouldCloseDropdownMenu = event => {
      const currentSelector = `dropdown-${this.props.dropdownName}`;

      if (this.state.isOpen !== true) return;
      if (
        !(this.node.classList && this.node.classList.contains(currentSelector))
      )
        return;

      if (!this.node.contains(event.target)) {
        this.setState({ isOpen: false });
        if (this.props.onClose) this.props.onClose();
      }
    };

    toggleDropdown = () => {
      const nextIsOpen = !this.state.isOpen;

      if (nextIsOpen && this.props.onFocus) this.props.onFocus();
      if (!nextIsOpen && this.props.onClose) this.props.onClose();

      this.setState({ isOpen: nextIsOpen });
    };

    renderLabel = () => {
      if (!this.props.label) return <FormattedMessage {...messages.select} />;

      if (typeof this.props.label === 'string')
        return <span>{this.props.label}</span>;

      return this.props.label;
    };

    render() {
      // Pass only `data-*` props
      const dropdownProps = filterDataAttributes(this.props);

      return (
        <div
          ref={node => {
            this.node = node;
          }}
          {...dropdownProps}
          className={classnames(
            `dropdown-${this.props.dropdownName}`,
            this.props.containerClassName,
            styles.container,
            {
              [styles.open]: this.state.isOpen,
              [styles.disabled]: this.props.disabled,
            }
          )}
        >
          {this.props.buttonIcon ? (
            <div data-track-component="Dropdown" data-track-event="click">
              <IconButton
                label={this.props.intl.formatMessage(messages.openDropdown)}
                isToggled={this.state.isOpen}
                isToggleButton={true}
                icon={this.props.buttonIcon}
                onClick={this.toggleDropdown}
                isDisabled={this.props.disabled}
              />
            </div>
          ) : (
            <div
              className={classnames(
                this.props.labelClassName,
                styles['label-container']
              )}
              data-track-component="Dropdown"
              data-track-event="click"
              onClick={this.props.disabled ? undefined : this.toggleDropdown}
            >
              {this.renderLabel()}
              {this.state.isOpen ? (
                <CaretUpIcon
                  size="medium"
                  color={this.props.disabled ? 'neutral60' : 'solid'}
                />
              ) : (
                <CaretDownIcon
                  size="medium"
                  color={this.props.disabled ? 'neutral60' : 'solid'}
                />
              )}
            </div>
          )}

          <div
            ref={node => {
              this.dropdownMenu = node;
            }}
            className={classnames(
              this.props.menuClassName,
              styles.menu,
              styles[`menu-position-${this.props.dropdownMenuPosition}`]
            )}
            style={this.state.topOffset ? { top: this.state.topOffset } : null}
          >
            <DropdownMenu {...this.props.dropdownMenuProps} />
          </div>
        </div>
      );
    }
  }

  return compose(
    keepDisplayName(DropDownComponent),
    injectIntl
  )(DropDownComponent);
}
