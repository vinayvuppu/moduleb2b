import React from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import { useIntl } from 'react-intl';
import {
  Spacings,
  SecondaryButton,
  PrimaryButton,
  IconButton,
  BinFilledIcon,
  MultilineTextField,
  Constraints,
  TextField,
} from '@commercetools-frontend/ui-kit';
import { FormModalPage } from '@commercetools-frontend/application-components';
import { useIsAuthorized } from '@commercetools-frontend/permissions';
import { PERMISSIONS } from '../../../../../../constants';
import PredicateDescriptionModal from '../predicate-description-modal';

import messages from './messages';
import validate from './validations';
import './predicate-modal-form.mod.css';

const PredicateModalForm = ({
  initialValues,
  handleSubmit,
  handleRemove,
  isOpen,
  close,
}) => {
  const { formatMessage } = useIntl();

  const isAuthorized = useIsAuthorized({
    demandedPermissions: [PERMISSIONS.ManageCompanies],
  });

  const renderRulesError = key => {
    switch (key) {
      case 'invalid':
        return formatMessage(messages.invalidPredicate);
      default:
        return null;
    }
  };

  const formik = useFormik({
    initialValues,
    onSubmit: handleSubmit,
    validate,
  });
  return (
    <FormModalPage
      title={formatMessage(messages.addRulePredicateButton)}
      isOpen={isOpen}
      onClose={close}
      customControls={
        <Spacings.Inline>
          <IconButton
            icon={<BinFilledIcon />}
            isDisabled={!isAuthorized || !String(formik.values.index)}
            label={formatMessage(messages.removePredicate)}
            onClick={() => handleRemove(formik.values.index)}
          />
          <SecondaryButton
            label={formatMessage(messages.cancel)}
            onClick={close}
          />
          <PrimaryButton
            label={formatMessage(messages.confirm)}
            onClick={formik.handleSubmit}
            isDisabled={!isAuthorized || !formik.dirty}
          />
        </Spacings.Inline>
      }
    >
      <Constraints.Horizontal>
        <Spacings.Stack scale="s">
          <TextField
            title={formatMessage(messages.ruleName)}
            name="name"
            isDisabled={!isAuthorized}
            value={formik.values.name}
            onChange={formik.handleChange}
            touched={formik.touched.name}
            errors={formik.errors.name}
          />
          <MultilineTextField
            title={formatMessage(messages.rulePredicate)}
            isRequired={true}
            placeholder={formatMessage(messages.rulePredicatePlaceHolder)}
            name="value"
            isDisabled={!isAuthorized}
            value={formik.values.value}
            defaultExpandMultilineText={true}
            onChange={formik.handleChange}
            touched={formik.touched.value}
            errors={formik.errors.value}
            renderError={renderRulesError}
          />
        </Spacings.Stack>
      </Constraints.Horizontal>
      <br />
      <PredicateDescriptionModal />
    </FormModalPage>
  );
};

PredicateModalForm.displayName = 'BudgetModalForm';

PredicateModalForm.propTypes = {
  initialValues: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.string,
  }).isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  handleRemove: PropTypes.func.isRequired,
};

export default PredicateModalForm;
