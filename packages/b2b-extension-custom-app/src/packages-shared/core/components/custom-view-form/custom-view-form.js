import React from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { injectIntl, FormattedMessage } from 'react-intl';
import { TextField, Spacings } from '@commercetools-frontend/ui-kit';
import validate from './validations';
import messages from './messages';

export const CustomViewForm = props => (
  <Formik
    initialValues={props.initialValues}
    enableReinitialize={true}
    validate={validate}
    onSubmit={values => props.onSubmit(values)}
    render={formikProps => {
      const form = (
        <Spacings.Stack scale="m">
          <TextField
            name="name"
            title={<FormattedMessage {...messages.labelName} />}
            isRequired={true}
            value={formikProps.values.name}
            touched={formikProps.touched.name}
            errors={formikProps.errors.name}
            onChange={formikProps.handleChange}
            onBlur={formikProps.handleBlur}
            isDisabled={formikProps.isSubmitting}
            horizontalConstraint="xl"
            data-testid="custom-view-modal-text-field"
          />
        </Spacings.Stack>
      );

      return props.children({
        form,
        isDirty: formikProps.dirty,
        isSubmitting: formikProps.isSubmitting,
        handleSubmit: formikProps.handleSubmit,
        // Ensure to call `resetForm` without arguments, otherwise the value passed
        // will be used as the new initial state.
        // https://jaredpalmer.com/formik/docs/api/formik#resetform-nextvalues-values-void
        handleCancel: () => formikProps.resetForm(),
      });
    }}
  />
);
CustomViewForm.displayName = 'CustomViewForm';
CustomViewForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }),
  children: PropTypes.func.isRequired,
  // injectIntl
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
};

export default injectIntl(CustomViewForm);
