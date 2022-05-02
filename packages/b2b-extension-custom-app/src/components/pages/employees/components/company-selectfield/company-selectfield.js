import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { SelectField } from '@commercetools-frontend/ui-kit';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { getCompanies } from '../../../companies/api';
import messages from './messages';

const query = {
  perPage: 500,
  page: 1,
  all: true,
  sortBy: 'createdAt',
  sortDirection: 'desc',
};

const CompanySelectField = props => {
  const { formatMessage } = useIntl();
  const [companies, setCompanies] = useState([]);
  const [companiesOptions, setCompaniesOptions] = useState([]);
  const {
    environment: { apiUrl },
  } = useApplicationContext();

  useEffect(() => {
    const fetchCompanies = async () => {
      const comp = await getCompanies({ url: apiUrl, query });

      setCompanies(comp.results);
      setCompaniesOptions(
        comp.results.map(c => ({ value: c.id, label: c.name }))
      );
    };
    fetchCompanies();
  }, [apiUrl]);

  const handleChange = event => {
    props.onChange(companies.find(c => c.id === event.target.value));
  };

  return (
    <SelectField
      data-testid="company"
      id="company"
      name="company"
      title={formatMessage(messages.labelCompany)}
      value={props.value}
      options={companiesOptions}
      onChange={handleChange}
      isRequired={props.isRequired}
      errors={props.errors}
      touched={props.touched}
      isDisabled={props.isDisabled}
    />
  );
};

CompanySelectField.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  isRequired: PropTypes.bool.isRequired,
  isDisabled: PropTypes.bool,
  touched: PropTypes.bool,
  errors: PropTypes.object,
};
CompanySelectField.displayName = 'CompanySelectField';

export default CompanySelectField;
