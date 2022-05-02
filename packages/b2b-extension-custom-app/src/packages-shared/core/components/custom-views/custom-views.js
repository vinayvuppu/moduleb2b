import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Text, Spacings } from '@commercetools-frontend/ui-kit';
import { DOMAINS } from '@commercetools-frontend/constants';
import * as globalActions from '@commercetools-frontend/actions-global';
import injectTracking from '../tracking/inject-tracking';
import CustomViewsOnboarding from '../custom-views-onboarding';
import CustomViewsDropdown from '../custom-views-dropdown';
import { withModalState } from '../modal-state-container';

import {
  CustomViewCreateModal,
  CustomViewRenameModal,
  CustomViewDeleteModal,
} from '../custom-view-modals';
import messages from './messages';
import trackingEvents from './tracking-events';
import styles from './custom-views.mod.css';

export const CustomViews = props => {
  const Onboarding = props.components?.Onboarding || CustomViewsOnboarding;

  return (
    <React.Fragment>
      <Spacings.Inline alignItems="center" scale="s">
        <Onboarding isDisabled={props.disableInfoIcon} />
        <Spacings.Inline alignItems="center" scale="s">
          <div className={styles['no-shrink-wrapper']}>
            <Text.Body isBold={true}>
              <FormattedMessage {...messages.selectCustomView} />
            </Text.Body>
          </div>
          <CustomViewsDropdown
            projectKey={props.projectKey}
            value={props.view}
            options={props.views}
            isDirty={props.hasUnsavedChanges}
            onSelect={props.onSelect}
            onCreate={props.creationModal.handleOpen}
            onEdit={props.editingModal.handleOpen}
            onDelete={props.deletionModal.handleOpen}
            onSave={props.onSave}
            onReset={props.onReset}
          />
        </Spacings.Inline>
      </Spacings.Inline>
      <CustomViewCreateModal
        draft={props.view}
        isOpen={props.creationModal.isOpen}
        onCancel={props.creationModal.handleClose}
        customInfoMessage={props.customCreateModalInfoMessage}
        customTitle={props.customCreateModalTitle}
        onConfirm={formValues => {
          props.onCreate({ ...props.view, ...formValues }).then(() => {
            props.creationModal.handleClose();

            const { category, action, label } = trackingEvents.createCustomView;
            props.track(category, action, label);

            props.showNotification({
              kind: 'success',
              domain: DOMAINS.SIDE,
              text: props.intl.formatMessage(
                messages.successfulCreationNotification
              ),
            });
          });
        }}
      />
      <CustomViewRenameModal
        draft={props.view}
        isOpen={props.editingModal.isOpen}
        onCancel={props.editingModal.handleClose}
        onConfirm={formValues => {
          props.onSave({ ...props.view, ...formValues }).then(() => {
            props.editingModal.handleClose();
          });
        }}
        customInfoMessage={props.customRenameModalInfoMessage}
        customTitle={props.customRenameModalTitle}
      />
      <CustomViewDeleteModal
        view={props.view}
        isOpen={props.deletionModal.isOpen}
        onCancel={props.deletionModal.handleClose}
        onConfirm={() => {
          props.onDelete().then(() => {
            props.deletionModal.handleClose();
          });
        }}
        customInfoMessage={props.customDeleteModalInfoMessage}
        customConfirmButtonLabel={props.customDeleteModalConfirmButtonLabel}
      />
    </React.Fragment>
  );
};
CustomViews.displayName = 'CustomViews';

CustomViews.propTypes = {
  projectKey: PropTypes.string.isRequired,
  customCreateModalInfoMessage: PropTypes.string,
  customCreateModalTitle: PropTypes.string,
  customRenameModalInfoMessage: PropTypes.string,
  customRenameModalTitle: PropTypes.string,
  customDeleteModalInfoMessage: PropTypes.array,
  customDeleteModalConfirmButtonLabel: PropTypes.string,
  hasUnsavedChanges: PropTypes.bool.isRequired,
  disableInfoIcon: PropTypes.bool,
  view: PropTypes.shape({
    id: PropTypes.string,
  }),
  views: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.objectOf(PropTypes.string).isRequired,
    })
  ),
  components: PropTypes.shape({
    Onboarding: PropTypes.component,
  }),
  onSelect: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  // withModalState
  creationModal: PropTypes.shape({
    isOpen: PropTypes.bool.isRequired,
    handleOpen: PropTypes.func.isRequired,
    handleClose: PropTypes.func.isRequired,
  }).isRequired,
  // withModalState
  editingModal: PropTypes.shape({
    isOpen: PropTypes.bool.isRequired,
    handleOpen: PropTypes.func.isRequired,
    handleClose: PropTypes.func.isRequired,
  }).isRequired,
  // withModalState
  deletionModal: PropTypes.shape({
    isOpen: PropTypes.bool.isRequired,
    handleOpen: PropTypes.func.isRequired,
    handleClose: PropTypes.func.isRequired,
  }).isRequired,
  // connect
  showNotification: PropTypes.func.isRequired,
  // injectIntl
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
  // injectTracking
  track: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  showNotification: globalActions.showNotification,
};

export default compose(
  connect(null, mapDispatchToProps),
  injectIntl,
  withModalState('creationModal'),
  withModalState('editingModal'),
  withModalState('deletionModal'),
  injectTracking
)(CustomViews);
