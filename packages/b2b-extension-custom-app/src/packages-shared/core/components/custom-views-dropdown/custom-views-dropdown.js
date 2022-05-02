import PropTypes from 'prop-types';
import React from 'react';
import { compose } from 'recompose';
import Downshift from 'downshift';
import classnames from 'classnames';
import { injectIntl, FormattedMessage } from 'react-intl';
import {
  RefreshIcon,
  EditIcon,
  RevertIcon,
  PlusBoldIcon,
  BinFilledIcon,
  FlatButton,
  Spacings,
  LoadingSpinner,
} from '@commercetools-frontend/ui-kit';
import injectTracking from '../tracking/inject-tracking';

import { nameLocale } from '../custom-view-form/conversions';
import Options from './custom-views-dropdown-options';
import styles from './custom-views-dropdown.mod.css';
import trackingEvents from './tracking-events';
import messages from './messages';

const getDropdownHeadStyles = ({ isDisabled, isOpen }) => {
  if (isDisabled) return styles['dropdown-head-disabled'];
  if (isOpen) return styles['dropdown-head-active'];

  return styles['dropdown-head-default'];
};

export const CustomViewDropdownOptionGroup = props => (
  <div className={styles['dropdown-option-group']}>{props.children}</div>
);

CustomViewDropdownOptionGroup.displayName = 'CustomViewDropdownOptionGroup';
CustomViewDropdownOptionGroup.propTypes = {
  children: PropTypes.node.isRequired,
};

export class CustomViewsDropdown extends React.Component {
  static displayName = 'CustomViewsDropdown';
  static propTypes = {
    isDisabled: PropTypes.bool,
    isDirty: PropTypes.bool.isRequired,
    projectKey: PropTypes.string.isRequired,
    onSelect: PropTypes.func.isRequired,
    onCreate: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired,
    value: PropTypes.shape({
      id: PropTypes.string,
      isImmutable: PropTypes.bool,
      name: PropTypes.objectOf(PropTypes.string).isRequired,
    }),
    options: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.objectOf(PropTypes.string).isRequired,
        icon: PropTypes.node,
      })
    ),
    // injectIntl
    intl: PropTypes.shape({
      formatMessage: PropTypes.func.isRequired,
    }).isRequired,
    // injectTracking
    track: PropTypes.func.isRequired,
  };

  render() {
    return (
      <Downshift>
        {({ isOpen, toggleMenu }) => (
          <div
            className={getDropdownHeadStyles({
              isDisabled: this.props.isDisabled,
              isOpen,
            })}
          >
            <div
              className={styles['dropdown-content']}
              data-testid="custom-views-dropdown"
            >
              <Options.Selected
                key={this.props.value.id}
                isDirty={this.props.isDirty}
                isImmutable={this.props.value.isImmutable}
                onClick={() => {
                  toggleMenu();
                  this.props.track(
                    trackingEvents.selectView.event,
                    trackingEvents.selectView.category,
                    trackingEvents.selectView.label
                  );
                }}
                name={this.props.value.name[nameLocale]}
                isOpen={isOpen}
              />
            </div>
            {isOpen && (
              <div className={styles['options-wrapper']}>
                <div className={styles['options-border']}>
                  <CustomViewDropdownOptionGroup>
                    <div className={styles['dropdown-items']}>
                      {(() => {
                        if (!this.props.options)
                          return (
                            <Spacings.Stack alignItems="center">
                              <LoadingSpinner />
                            </Spacings.Stack>
                          );
                        if (
                          this.props.options &&
                          this.props.options.length === 0
                        )
                          return (
                            <Spacings.Stack alignItems="center">
                              <FormattedMessage {...messages.noOptions} />
                            </Spacings.Stack>
                          );

                        return this.props.options.map(option => {
                          const isOptionActive =
                            option.id === this.props.value.id;
                          return (
                            <div
                              key={option.id}
                              className={classnames({
                                [styles['option-is-selected']]: isOptionActive,
                              })}
                            >
                              <Options.Selectable
                                onClick={
                                  isOptionActive
                                    ? null
                                    : () => {
                                        this.props.onSelect(option);
                                        toggleMenu();
                                        this.props.track(
                                          trackingEvents.selectView.event,
                                          trackingEvents.selectView.category,
                                          trackingEvents.selectView.label
                                        );
                                      }
                                }
                                isActive={isOptionActive}
                                isImmutable={option.isImmutable}
                                isDirty={this.props.isDirty && isOptionActive}
                                name={option.name[nameLocale]}
                                icon={option.icon}
                              />
                              {this.props.value.id === option.id && (
                                <div
                                  className={classnames(
                                    styles['option-actions'],
                                    {
                                      [styles['option-actions-exist']]:
                                        this.props.isDirty ||
                                        !this.props.value.isImmutable,
                                    }
                                  )}
                                >
                                  <Spacings.Stack>
                                    {this.props.isDirty &&
                                      !this.props.value.isImmutable && (
                                        <FlatButton
                                          name="update"
                                          tone="secondary"
                                          icon={<RefreshIcon />}
                                          label={this.props.intl.formatMessage(
                                            messages.saveOptionLabel
                                          )}
                                          isDisabled={this.props.isDisabled}
                                          onClick={() => {
                                            toggleMenu();
                                            this.props.onSave(this.props.value);
                                            this.props.track(
                                              trackingEvents.updateView.event,
                                              trackingEvents.updateView
                                                .category,
                                              trackingEvents.updateView.label
                                            );
                                          }}
                                        />
                                      )}
                                    {this.props.value &&
                                      !this.props.value.isImmutable && (
                                        <FlatButton
                                          name="edit"
                                          tone="secondary"
                                          icon={<EditIcon />}
                                          label={this.props.intl.formatMessage(
                                            messages.renameOptionLabel
                                          )}
                                          isDisabled={
                                            this.props.isDisabled ||
                                            this.props.isDirty
                                          }
                                          onClick={() => {
                                            toggleMenu();
                                            this.props.onEdit();
                                            this.props.track(
                                              trackingEvents.renameView.event,
                                              trackingEvents.renameView
                                                .category,
                                              trackingEvents.renameView.label
                                            );
                                          }}
                                        />
                                      )}
                                    {this.props.isDirty && (
                                      <FlatButton
                                        name="reset"
                                        tone="secondary"
                                        icon={<RevertIcon />}
                                        label={this.props.intl.formatMessage(
                                          messages.discardChangesOptionLabel
                                        )}
                                        isDisabled={this.props.isDisabled}
                                        onClick={() => {
                                          toggleMenu();
                                          this.props.onReset();
                                          this.props.track(
                                            trackingEvents.resetView.event,
                                            trackingEvents.resetView.category,
                                            trackingEvents.resetView.label
                                          );
                                        }}
                                      />
                                    )}
                                    {!this.props.value.isImmutable && (
                                      <FlatButton
                                        name="delete"
                                        tone="secondary"
                                        icon={<BinFilledIcon />}
                                        label={this.props.intl.formatMessage(
                                          messages.deleteOptionLabel
                                        )}
                                        isDisabled={this.props.isDisabled}
                                        onClick={() => {
                                          toggleMenu();
                                          this.props.onDelete();
                                          this.props.track(
                                            trackingEvents.deleteView.event,
                                            trackingEvents.deleteView.category,
                                            trackingEvents.deleteView.label
                                          );
                                        }}
                                      />
                                    )}
                                  </Spacings.Stack>
                                </div>
                              )}
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </CustomViewDropdownOptionGroup>
                  <CustomViewDropdownOptionGroup>
                    <div className={styles['option-create']}>
                      <FlatButton
                        name="create"
                        tone="secondary"
                        data-testid="save-new-custom-view-button"
                        icon={<PlusBoldIcon />}
                        isDisabled={this.props.isDisabled}
                        label={this.props.intl.formatMessage(
                          messages.saveAsOptionLabel
                        )}
                        onClick={() => {
                          toggleMenu();
                          this.props.onCreate();
                          this.props.track(
                            trackingEvents.createView.event,
                            trackingEvents.createView.category,
                            trackingEvents.createView.label
                          );
                        }}
                      />
                    </div>
                  </CustomViewDropdownOptionGroup>
                </div>
              </div>
            )}
          </div>
        )}
      </Downshift>
    );
  }
}

export default compose(injectIntl, injectTracking)(CustomViewsDropdown);
