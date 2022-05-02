import React from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import { useIntl } from 'react-intl';
import {
  SelectField,
  MoneyField,
  MoneyInput,
  Spacings,
  SecondaryButton,
  ErrorMessage,
  PrimaryButton,
  IconButton,
  BinFilledIcon,
} from '@commercetools-frontend/ui-kit';
import { FormModalPage } from '@commercetools-frontend/application-components';
import { useIsAuthorized } from '@commercetools-frontend/permissions';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';

import { getRoles } from '../../../../../utils/roles';
import messages from '../messages';
import { PERMISSIONS } from '../../../../../../constants';
import './amount-rol-modal-form.css';

const AmmountRolModalForm = ({
  initialValues,
  handleSubmit,
  handleRemove,
  isOpen,
  close,
  validate,
  title,
}) => {
  const { formatMessage } = useIntl();
  const { currencies } = useApplicationContext(({ project }) => ({
    currencies: project.currencies,
  }));

  const isAuthorized = useIsAuthorized({
    demandedPermissions: [PERMISSIONS.ManageCompanies],
  });

  const onSubmit = ({ amount, ...values }) => {
    handleSubmit({
      ...values,
      amount: MoneyInput.convertToMoneyValue(amount),
    });
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
    validate,
  });
  return (
    <FormModalPage
      title={title}
      isOpen={isOpen}
      onClose={close}
      customControls={
        <Spacings.Inline>
          <IconButton
            icon={<BinFilledIcon />}
            isDisabled={!isAuthorized || !String(formik.values.index)}
            label={formatMessage(messages.removeBudget)}
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
      <Spacings.Inline>
        <div className="budget-modal-form-field">
          <SelectField
            title={formatMessage(messages.rolLabel)}
            name="rol"
            value={formik.values.rol}
            isRequired
            onChange={formik.handleChange}
            isMulti={false}
            options={getRoles(formatMessage)}
            isDisabled={!isAuthorized}
            menuPortalTarget={document.body}
            menuPortalZIndex={1200}
            data-testid="rol-field"
            touched={formik.touched.rol}
          />
          {formik.errors.rol && formik.touched.rol && (
            <ErrorMessage>{formik.errors.rol}</ErrorMessage>
          )}
        </div>
        <div className="budget-modal-form-field">
          <MoneyField
            title={formatMessage(messages.labelRequiredApprovalAmount)}
            name="amount"
            currencies={currencies}
            value={formik.values.amount}
            onChange={formik.handleChange}
            isDisabled={!isAuthorized}
            menuPortalTarget={document.body}
            menuPortalZIndex={1200}
            data-testid="amount-field"
            touched={formik.touched.amount}
          />
          {formik.errors.amount && formik.touched.amount && (
            <ErrorMessage>{formik.errors.amount}</ErrorMessage>
          )}
        </div>
      </Spacings.Inline>
    </FormModalPage>
  );
};

AmmountRolModalForm.displayName = 'BudgetModalForm';

AmmountRolModalForm.propTypes = {
  initialValues: PropTypes.shape({
    rol: PropTypes.string,
    amount: PropTypes.shape({
      currencyCode: PropTypes.string.isRequired,
      amount: PropTypes.string.isRequired,
      index: PropTypes.number,
    }).isRequired,
  }).isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  handleRemove: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  validate: PropTypes.func.isRequired,
};

export default AmmountRolModalForm;
