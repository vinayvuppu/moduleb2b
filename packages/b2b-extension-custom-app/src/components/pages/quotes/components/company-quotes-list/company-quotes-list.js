import React from 'react';
import PropTypes from 'prop-types';
import oneLineTrim from 'common-tags/lib/oneLineTrim';

import EmployeeDetailWrapper from '../../../my-company/components/employee-detail-wrapper';
import QuotesList from '../quotes-list';
import FetchQuotesQuery from '../../graphql/FetchQuotes.graphql';

export const CompanyQuotesList = props => {
  const generateDetailLink = id => oneLineTrim`
      /${props.projectKey}
      /b2b-extension
      /my-company
      /quotes
      /${id}
    `;

  return (
    <EmployeeDetailWrapper projectKey={props.projectKey}>
      {({ company }) => (
        <QuotesList
          query={FetchQuotesQuery}
          variables={{
            employeeId: undefined,
            companyId: company.id,
          }}
          columnsToExclude={['company']}
          filtersToExclude={['companyId']}
          generateDetailLink={generateDetailLink}
          includeAddRequestButton={true}
        />
      )}
    </EmployeeDetailWrapper>
  );
};

CompanyQuotesList.displayName = 'CompanyQuotesList';
CompanyQuotesList.propTypes = {
  projectKey: PropTypes.string.isRequired,
};
export default CompanyQuotesList;
