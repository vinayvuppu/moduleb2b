import React, { useState, Fragment } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import {
  SecondaryButton,
  PlusBoldIcon,
  Table,
  Constraints,
  Spacings,
} from '@commercetools-frontend/ui-kit';

import PredicateModalForm from '../predicate-modal-form';
import messages from './messages';

const createColumnDefinition = formatMessage => [
  { key: 'name', label: formatMessage(messages.predicateRuleName) },
  {
    key: 'value',
    flexGrow: 1,
    label: formatMessage(messages.rulePredicate),
  },
];

const CompanyPredicateRules = ({ formik, isAuthorized }) => {
  const { formatMessage } = useIntl();

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [activePredicateRule, setActivePredicateRule] = useState({
    name: '',
    value: '',
  });

  const handleAddRulePredicateButton = () => setOpenCreateModal(true);
  const handleCloseModal = () => {
    setActivePredicateRule({ name: '', value: '' });
    setOpenCreateModal(false);
  };

  const renderRow = ({ columnKey, rowIndex }, predicateRuleData) => {
    const value = predicateRuleData[rowIndex][columnKey];

    switch (columnKey) {
      default:
        return value;
    }
  };

  const handlePredicateRuleSubmit = ({ index, ...rest }) => {
    if (typeof index === 'number') {
      const rules = formik.values.rules.filter((_, i) => index !== i);
      formik.setFieldValue('rules', [...rules, rest]);
    } else {
      formik.setFieldValue('rules', [...formik.values.rules, rest]);
    }
    handleCloseModal();
  };

  const handlePredicateRuleRemove = index => {
    if (typeof index === 'number') {
      const rules = formik.values.rules.filter((_, i) => index !== i);
      formik.setFieldValue('rules', rules);
      setOpenCreateModal(false);
    }
    handleCloseModal();
  };

  return (
    <Constraints.Horizontal>
      <Spacings.Stack scale="s">
        <Spacings.Inline alignItems="center">
          <SecondaryButton
            label={formatMessage(messages.addRulePredicateButton)}
            iconLeft={<PlusBoldIcon />}
            onClick={handleAddRulePredicateButton}
            isDisabled={!isAuthorized}
          />
        </Spacings.Inline>
        {formik.values.rules.length > 0 && (
          <Fragment>
            <Table
              columns={createColumnDefinition(formatMessage)}
              rowCount={formik.values.rules.length}
              items={formik.values.rules}
              itemRenderer={rowData => renderRow(rowData, formik.values.rules)}
              shouldFillRemainingVerticalSpace={false}
              onRowClick={(_, rowIndex) => {
                const currentPredicaterule = formik.values.rules[rowIndex];
                setActivePredicateRule({
                  ...currentPredicaterule,
                  index: rowIndex,
                });
                setOpenCreateModal(true);
              }}
            />
          </Fragment>
        )}
      </Spacings.Stack>
      {openCreateModal && (
        <PredicateModalForm
          initialValues={activePredicateRule}
          handleSubmit={handlePredicateRuleSubmit}
          isOpen={openCreateModal}
          close={handleCloseModal}
          handleRemove={handlePredicateRuleRemove}
        />
      )}
    </Constraints.Horizontal>
  );
};

CompanyPredicateRules.displayName = 'CompanyPredicateRules';
CompanyPredicateRules.propTypes = {
  formik: PropTypes.object.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
};

export default CompanyPredicateRules;
