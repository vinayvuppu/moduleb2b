import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Spacings, Text } from '@commercetools-frontend/ui-kit';
import { FormDialog } from '@commercetools-frontend/application-components';
import CustomViewForm from '../custom-view-form';
import messages from './messages';
import {
  docToFormValues,
  formValuesToDoc,
} from '../custom-view-form/conversions';

export const CustomViewCreateModal = props => {
  if (!props.isOpen) return null;
  return (
    <CustomViewForm
      initialValues={docToFormValues()}
      onSubmit={formValues => {
        props.onConfirm(formValuesToDoc(formValues));
      }}
    >
      {({ form, handleSubmit, isSubmitting }) => (
        <FormDialog
          title={
            props.customTitle ||
            props.intl.formatMessage(messages.creationModalTitle)
          }
          isOpen={true}
          onClose={props.onCancel}
          onSecondaryButtonClick={props.onCancel}
          onPrimaryButtonClick={handleSubmit}
          isPrimaryButtonDisabled={isSubmitting}
          dataAttributesPrimaryButton={{
            'data-testid': 'custom-view-create-modal-button-save',
          }}
        >
          <Spacings.Stack scale="m">
            <Text.Body>
              {props.customInfoMessage || (
                <FormattedMessage {...messages.creationModalInfoMessage} />
              )}
            </Text.Body>
            {form}
          </Spacings.Stack>
        </FormDialog>
      )}
    </CustomViewForm>
  );
};
CustomViewCreateModal.displayName = 'CustomViewCreateModal';
CustomViewCreateModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  draft: PropTypes.object,
  customInfoMessage: PropTypes.string,
  customTitle: PropTypes.string,
  // injectIntl
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
};

export default injectIntl(CustomViewCreateModal);
