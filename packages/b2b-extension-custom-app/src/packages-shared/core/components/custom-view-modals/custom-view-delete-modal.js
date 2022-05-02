import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { ConfirmationDialog } from '@commercetools-frontend/application-components';
import { Text } from '@commercetools-frontend/ui-kit';
import { nameLocale } from '../custom-view-form/conversions';
import messages from './messages';

export const CustomViewDeleteModal = props => {
  if (!props.isOpen) return null;
  return (
    <ConfirmationDialog
      title={props.intl.formatMessage(messages.deletionModalTitle)}
      isOpen={true}
      onClose={props.onCancel}
      onCancel={props.onCancel}
      onConfirm={props.onConfirm}
      labelPrimary={props.customConfirmButtonLabel}
    >
      <Text.Body>
        {props.customInfoMessage || (
          <FormattedMessage
            {...messages.deletionModalInfoMessage}
            values={{
              name: props.view.name[nameLocale],
            }}
          />
        )}
      </Text.Body>
    </ConfirmationDialog>
  );
};
CustomViewDeleteModal.displayName = 'CustomViewDeleteModal';
CustomViewDeleteModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  customInfoMessage: PropTypes.array,
  customConfirmButtonLabel: PropTypes.string,
  view: PropTypes.shape({
    name: PropTypes.object.isRequired,
  }).isRequired,
  // injectIntl
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
};

export default injectIntl(CustomViewDeleteModal);
