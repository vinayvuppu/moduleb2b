import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useIntl } from 'react-intl';
import {
  PlusBoldIcon,
  LoadingSpinner,
  SecondaryButton,
  Spacings,
  Table,
  Text,
} from '@commercetools-frontend/ui-kit';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import oneLineTrim from 'common-tags/lib/oneLineTrim';
import { NO_VALUE_FALLBACK } from '@commercetools-frontend/constants';
import { RestrictedByPermissions } from '@commercetools-frontend/permissions';
import Pagination from '@commercetools-local/core/components/search/pagination';
import Toolbar from '@commercetools-local/core/components/toolbar';
import Container from '@commercetools-local/core/components/container';
import TotalResults from '@commercetools-local/core/components/total-results';
import NoImageIcon from '@commercetools-frontend/assets/images/camera.svg';

import { PERMISSIONS } from '../../../../../constants';
import messages from './messages';
import createColumnDefinitions from './column-definitions';
import { getCompanies } from '../../api';

const QUERY = {
  perPage: 20,
  page: 1,
  sortBy: 'createdAt',
  sortDirection: 'desc',
};

const CompanyList = () => {
  const [companies, setCompanies] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState(QUERY);
  const { formatMessage, formatTime, formatDate } = useIntl();
  const { push } = useHistory();
  const {
    project: { key },
    environment: { apiUrl },
  } = useApplicationContext();

  useEffect(() => {
    const fetchCompanies = async () => {
      setIsLoading(true);
      try {
        const comp = await getCompanies({ url: apiUrl, query });
        setCompanies(comp);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCompanies();
  }, [apiUrl, query]);

  const handleRowClick = (rowIndex, companyPageQueryResults) => {
    const company = companyPageQueryResults.results[rowIndex];

    push(oneLineTrim`
      /${key}
      /b2b-extension
      /companies
      /${company.id}
    `);
  };

  const renderCompanyRow = (
    { rowIndex, columnKey },
    companyPageQueryResults
  ) => {
    const company = companyPageQueryResults.results[rowIndex];
    const columnValue = company[columnKey];

    if (columnValue === undefined) return NO_VALUE_FALLBACK;
    if (columnKey === 'logo') {
      const img = columnValue || NoImageIcon;
      return <img src={img} alt="logo" width={64} height={64} />;
    }

    if (columnKey === 'createdAt' || columnKey === 'lastModifiedAt')
      return `${formatDate(columnValue)} ${formatTime(columnValue)}`;

    if (columnKey === 'addresses') {
      if (!columnValue.length) return NO_VALUE_FALLBACK;
      let address =
        company.defaultBillingAddress ||
        company.defaultShippingAddress ||
        company.addresses[0];
      if (typeof address === 'string')
        address = company.addresses.find(({ id }) => id === address);
      return (
        <Spacings.Inline>
          {address.firstName && <Text.Body>{address.firstName}</Text.Body>}
          {address.lastName && <Text.Body>{address.lastName}</Text.Body>}
          {address.streetName && <Text.Body>{address.streetName}</Text.Body>}
          {address.streetNumber && (
            <Text.Body>{address.streetNumber}</Text.Body>
          )}
          {address.city && <Text.Body>{address.city}</Text.Body>}
          {address.postalCode && <Text.Body>{address.postalCode}</Text.Body>}
          {address.state && <Text.Body>{address.state}</Text.Body>}
          {address.region && <Text.Body>{address.region}</Text.Body>}
          <Text.Body>{address.country}</Text.Body>
        </Spacings.Inline>
      );
    }

    return columnValue;
  };

  return (
    <div>
      <Spacings.Inline alignItems="center" justifyContent="space-between">
        <Toolbar
          title={
            <div>
              {formatMessage(messages.title)}
              <TotalResults total={isLoading ? 0 : companies.total} />
            </div>
          }
        />
        <Spacings.Inset scale="m">
          <RestrictedByPermissions permissions={[PERMISSIONS.ManageCompanies]}>
            <Link
              to={oneLineTrim`
                        /${key}
                        /b2b-extension
                        /companies
                        /new
                      `}
            >
              <SecondaryButton
                iconLeft={<PlusBoldIcon />}
                label={formatMessage(messages.addCompany)}
                onClick={() => {}}
              />
            </Link>
          </RestrictedByPermissions>
        </Spacings.Inset>
      </Spacings.Inline>
      <Container>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <Spacings.Stack scale="m">
            {companies.total === 0 ? (
              <div>{formatMessage(messages.noResultsTitle)}</div>
            ) : (
              <Table
                columns={createColumnDefinitions(formatMessage)}
                rowCount={companies.count}
                items={companies.results}
                itemRenderer={row => renderCompanyRow(row, companies)}
                shouldFillRemainingVerticalSpace={true}
                onRowClick={(_, rowIndex) =>
                  handleRowClick(rowIndex, companies)
                }
                onSortChange={(columnKey, sortDirection) =>
                  setQuery({
                    ...query,
                    sortBy: columnKey,
                    sortDirection: sortDirection.toLowerCase(),
                  })
                }
                sortBy={query.sortBy}
                sortDirection={query.sortDirection.toUpperCase()}
              >
                <Pagination
                  totalItems={companies.total}
                  perPage={query.perPage}
                  page={query.page}
                  onPerPageChange={nextPerPage =>
                    setQuery({
                      ...query,
                      perPage: nextPerPage,
                    })
                  }
                  onPageChange={nextPage =>
                    setQuery({
                      ...query,
                      page: nextPage,
                    })
                  }
                />
              </Table>
            )}
          </Spacings.Stack>
        )}
      </Container>
    </div>
  );
};

CompanyList.displayName = 'CompanyList';

export default CompanyList;
