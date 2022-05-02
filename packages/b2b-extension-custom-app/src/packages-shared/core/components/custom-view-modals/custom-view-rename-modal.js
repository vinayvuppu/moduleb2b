import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Text, Spacings } from '@commercetools-frontend/ui-kit';
import { FormDialog } from '@commercetools-frontend/application-components';
import CustomViewForm from '../custom-view-form';
import messages from './messages';
import {
  docToFormValues,
  formValuesToDoc,
} from '../custom-view-form/conversions';

export const CustomViewRenameModal = props => {
  if (!props.isOpen) return null;
  return (
    <CustomViewForm
      initialValues={docToFormValues(props.draft)}
      onSubmit={formValues => {
        props.onConfirm(formValuesToDoc(formValues));
      }}
    >
      {({ form, handleSubmit, isSubmitting }) => (
        <FormDialog
          title={
            props.customTitle ||
            props.intl.formatMessage(messages.renamingModalTitle)
          }
          isOpen={true}
          onClose={props.onCancel}
          onSecondaryButtonClick={props.onCancel}
          onPrimaryButtonClick={handleSubmit}
          isPrimaryButtonDisabled={isSubmitting}
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
CustomViewRenameModal.displayName = 'CustomViewRenameModal';
CustomViewRenameModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  customInfoMessage: PropTypes.string,
  customTitle: PropTypes.string,
  draft: PropTypes.shape({
    name: PropTypes.object,
  }),
  // injectIntl
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
};

export default injectIntl(CustomViewRenameModal);
