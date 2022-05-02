import React from 'react';
import oneLineTrim from 'common-tags/lib/oneLineTrim';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';

import QuotesList from '../quotes-list';

import FetchQuotesQuery from '../../graphql/FetchQuotes.graphql';

export const AdminQuotesList = () => {
  const {
    project: { key },
  } = useApplicationContext();

  const generateDetailLink = id => oneLineTrim`
      /${key}
      /b2b-extension
      /quotes
      /${id}
    `;
  return (
    <QuotesList
      query={FetchQuotesQuery}
      variables={{
        employeeId: undefined,
        companyId: undefined,
      }}
      columnsToExclude={['actions']}
      generateDetailLink={generateDetailLink}
      includeAddRequestButton={false}
    />
  );
};

AdminQuotesList.displayName = 'AdminQuotesList';
AdminQuotesList.propTypes = {};
export default AdminQuotesList;
