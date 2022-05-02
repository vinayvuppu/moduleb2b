import React, { useState, Fragment } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import {
  CollapsiblePanel,
  SecondaryButton,
  PlusBoldIcon,
  MoneyInput,
  Table,
  Constraints,
  Spacings,
} from '@commercetools-frontend/ui-kit';
import { useIsAuthorized } from '@commercetools-frontend/permissions';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { formatMoney } from '@commercetools-local/utils/formats/money';
import { getRolByValue } from '../../../../../utils/roles';
import AmountRolModalForm from '../amount-rol-modal-form';
import CompanyPredicateRules from '../company-predicate-rules';
import { PERMISSIONS } from '../../../../../../constants';

import columnDefinition from './column-definition';

const RequiresApprovalRuleSection = ({
  label,
  addLabel,
  validate,
  additionalActions,
  formik,
}) => {
  const {
    project: { currencies },
  } = useApplicationContext();

  const { formatMessage, locale, formatNumber } = useIntl();
  const defaultActiveRol = {
    rol: '',
    amount: MoneyInput.parseMoneyValue(
      { currencyCode: currencies[0], centAmount: 0 },
      locale
    ),
  };

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [activeAmountRol, setActiveAmountRol] = useState(defaultActiveRol);
  const isAuthorized = useIsAuthorized({
    demandedPermissions: [PERMISSIONS.ManageCompanies],
  });

  const handleCloseModal = () => {
    setActiveAmountRol(defaultActiveRol);
    setOpenCreateModal(false);
  };

  const renderRow = ({ columnKey, rowIndex }, budgetData) => {
    const value = budgetData[rowIndex][columnKey];

    switch (columnKey) {
      case 'amount':
        return formatMoney(value, { formatNumber });
      case 'rol':
        return getRolByValue(value, formatMessage).label;
      default:
        return value;
    }
  };

  const handleAmountRolesSubmit = ({ index, ...rest }) => {
    if (typeof index === 'number') {
      const currentAmountRol = formik.values.requiredApprovalRoles.filter(
        (_, i) => index !== i
      );
      formik.setFieldValue('requiredApprovalRoles', [
        ...currentAmountRol,
        rest,
      ]);
    } else {
      formik.setFieldValue('requiredApprovalRoles', [
        ...formik.values.requiredApprovalRoles,
        rest,
      ]);
    }
    handleCloseModal();
  };

  const handleRemoveAmountRol = index => {
    if (typeof index === 'number') {
      const currentAmountRol = formik.values.requiredApprovalRoles.filter(
        (_, i) => index !== i
      );
      formik.setFieldValue('requiredApprovalRoles', currentAmountRol);
      setOpenCreateModal(false);
    }
    handleCloseModal();
  };

  return (
    <Fragment>
      <CollapsiblePanel
        header={<CollapsiblePanel.Header>{label}</CollapsiblePanel.Header>}
      >
        <Constraints.Horizontal>
          <Spacings.Stack scale="s">
            <Spacings.Inline>
              <SecondaryButton
                label={addLabel}
                iconLeft={<PlusBoldIcon />}
                onClick={() => setOpenCreateModal(true)}
                isDisabled={!isAuthorized}
              />
              {additionalActions}
            </Spacings.Inline>
            {formik.values.requiredApprovalRoles.length > 0 && (
              <Fragment>
                <Table
                  columns={columnDefinition(formatMessage)}
                  rowCount={formik.values.requiredApprovalRoles.length}
                  items={formik.values.requiredApprovalRoles}
                  itemRenderer={rowData =>
                    renderRow(rowData, formik.values.requiredApprovalRoles)
                  }
                  shouldFillRemainingVerticalSpace={false}
                  onRowClick={(_, rowIndex) => {
                    const currentAmountRol =
                      formik.values.requiredApprovalRoles[rowIndex];
                    setActiveAmountRol({
                      ...currentAmountRol,
                      index: rowIndex,
                      amount: MoneyInput.parseMoneyValue(
                        currentAmountRol.amount,
                        locale
                      ),
                    });
                    setOpenCreateModal(true);
                  }}
                />
                <br />
              </Fragment>
            )}

            <CompanyPredicateRules
              formik={formik}
              isAuthorized={isAuthorized}
            />
          </Spacings.Stack>
        </Constraints.Horizontal>
      </CollapsiblePanel>
      {openCreateModal && (
        <AmountRolModalForm
          title={addLabel}
          initialValues={activeAmountRol}
          handleSubmit={handleAmountRolesSubmit}
          isOpen={openCreateModal}
          close={handleCloseModal}
          handleRemove={handleRemoveAmountRol}
          validate={validate}
        />
      )}
    </Fragment>
  );
};

RequiresApprovalRuleSection.propTypes = {
  validate: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  addLabel: PropTypes.string.isRequired,
  additionalActions: PropTypes.node,
  formik: PropTypes.object.isRequired,
};

RequiresApprovalRuleSection.displayName = 'RequiresApprovalRuleSection';

export default RequiresApprovalRuleSection;
