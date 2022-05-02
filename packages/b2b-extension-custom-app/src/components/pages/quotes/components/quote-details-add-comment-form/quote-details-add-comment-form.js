import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { useFormik } from 'formik';
import {
  MultilineTextInput,
  PrimaryButton,
  Spacings,
} from '@commercetools-frontend/ui-kit';
import styles from './quote-details-add-comment-form.mod.css';
import messages from './messages';

const initialValues = {
  text: '',
};

const validate = ({ text }) => {
  const errors = {};

  if (!text) errors.text = 'Missing';

  return errors;
};

const QuoteDetailsAddCommentForm = ({ onSubmit }) => {
  const { formatMessage } = useIntl();
  const handleOnSubmit = async (values, formikHelpers) => {
    await onSubmit(values);
    formikHelpers.resetForm();
  };
  const {
    values,
    handleChange,
    handleSubmit,
    isValid,
    dirty,
    isSubmitting,
  } = useFormik({
    initialValues,
    validate,
    onSubmit: handleOnSubmit,
  });

  return (
    <form onSubmit={handleSubmit}>
      <Spacings.Inline>
        <div className={styles['remove-margin']}>
          <MultilineTextInput
            value={values.text}
            onChange={handleChange}
            name="text"
            placeholder={formatMessage(messages.textPlaceholder)}
            isDisabled={isSubmitting}
            isAutofocussed
          />
        </div>
        <PrimaryButton
          onClick={() => {}}
          label={formatMessage(messages.sendLabel)}
          isDisabled={!dirty || !isValid || isSubmitting}
          type="submit"
        />
      </Spacings.Inline>
    </form>
  );
};

QuoteDetailsAddCommentForm.displayName = 'QuoteDetailsAddCommentForm';

QuoteDetailsAddCommentForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default QuoteDetailsAddCommentForm;
