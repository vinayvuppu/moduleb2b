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
import { PERMISSIONS } from '../../../../../../constants';
import columnDefinition from './column-definition';

const AmountRolesSection = ({
  label,
  addLabel,
  values,
  setValues,
  validate,
  additionalActions,
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
      const currentAmountRol = values.filter((_, i) => index !== i);
      setValues([...currentAmountRol, rest]);
    } else {
      setValues([...values, rest]);
    }
    handleCloseModal();
  };

  const handleRemoveAmountRol = index => {
    if (typeof index === 'number') {
      const currentAmountRol = values.filter((_, i) => index !== i);
      setValues(currentAmountRol);
      setOpenCreateModal(false);
    }
    handleCloseModal();
  };

  return (
    <Fragment>
      <CollapsiblePanel
        header={<CollapsiblePanel.Header>{label}</CollapsiblePanel.Header>}
      >
        <Spacings.Inline>
          <SecondaryButton
            label={addLabel}
            iconLeft={<PlusBoldIcon />}
            onClick={() => setOpenCreateModal(true)}
            isDisabled={!isAuthorized}
          />
          {additionalActions}
        </Spacings.Inline>
        <Constraints.Horizontal>
          {values.length > 0 && (
            <Fragment>
              <br />
              <Table
                columns={columnDefinition(formatMessage)}
                rowCount={values.length}
                items={values}
                itemRenderer={rowData => renderRow(rowData, values)}
                shouldFillRemainingVerticalSpace={false}
                onRowClick={(_, rowIndex) => {
                  const currentAmountRol = values[rowIndex];
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
            </Fragment>
          )}
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

AmountRolesSection.propTypes = {
  values: PropTypes.arrayOf(
    PropTypes.shape({
      rol: PropTypes.string.isRequired,
      amount: PropTypes.object,
    })
  ),
  setValues: PropTypes.func.isRequired,
  validate: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  addLabel: PropTypes.string.isRequired,
  additionalActions: PropTypes.node,
};

AmountRolesSection.displayName = 'AmountRolesSection';

export default AmountRolesSection;
