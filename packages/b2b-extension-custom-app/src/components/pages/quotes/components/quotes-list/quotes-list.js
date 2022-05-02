import React, { useContext, useState } from 'react';
import { useQuery } from 'react-apollo';
import { useIntl } from 'react-intl';
import { Link, useHistory } from 'react-router-dom';

import PropTypes from 'prop-types';
import {
  LoadingSpinner,
  Spacings,
  Table,
  CartIcon,
  IconButton,
  SecondaryButton,
  PlusBoldIcon,
  EditIcon,
} from '@commercetools-frontend/ui-kit';
import oneLineTrim from 'common-tags/lib/oneLineTrim';

import { formatMoney } from '@commercetools-local/utils/formats/money';
import { NO_VALUE_FALLBACK } from '@commercetools-frontend/constants';
import Container from '@commercetools-local/core/components/container';
import Toolbar from '@commercetools-local/core/components/toolbar';
import TotalResults from '@commercetools-local/core/components/total-results';
import SearchView from '@commercetools-local/core/components/search/search-view';
import PageBottomSpacer from '@commercetools-local/core/components/page-bottom-spacer';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';

import { DEFAULT_PAGE_SIZES } from '../../../../constants/pagination';
import { ORDER_CREATE_TAB_NAMES } from '../../../my-company/components/order-create/constants';
import B2BApolloClientContext from '../../../../common/b2b-apollo-client-context';
import createColumnDefinitions from './column-definitions';
import createFilterDefinitions from './filter-definitions';
import { QUOTE_TYPES } from '../../constants';
import { subtraction } from '../../../../utils/money';

import messages from './messages';

const none = () => {};

export const QuotesList = props => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [filters, setFilters] = useState({
    employeeId: props.variables.employeeId,
    companyId: props.variables.companyId,
  });

  const [initialFiltersQuoteState, setInitialFiltersQuoteState] = useState({
    quoteState: [
      {
        type: 'in',
        value: {
          value: [
            QUOTE_TYPES.SUBMITTED,
            QUOTE_TYPES.APPROVED,
            QUOTE_TYPES.CLOSED,
            QUOTE_TYPES.DECLINED,
            QUOTE_TYPES.EXPIRED,
            QUOTE_TYPES.PLACED,
          ],
        },
      },
    ],
  });

  const [searchText, setSearchText] = useState('');

  const intl = useIntl();
  const { formatMessage, formatNumber } = intl;

  const { push } = useHistory();
  const {
    project: { key, currencies },
  } = useApplicationContext();

  const b2bApolloClientContext = useContext(B2BApolloClientContext.Context);

  const handleRowClick = (rowIndex, quotes) => {
    const quote = quotes[rowIndex];

    push(props.generateDetailLink(quote.id));
  };

  const handleOnFilterChange = data => {
    if (data.fieldName) {
      setInitialFiltersQuoteState({
        ...initialFiltersQuoteState,
        [data.fieldName]: [data.fieldValue],
      });
    }
  };

  const handleTransformSearchFilter = data => {
    setPerPage(data.perPage);
    setPage(data.page);
    setSearchText(data.searchText);
    if (!data.filters.quoteState) {
      setInitialFiltersQuoteState({});
    }

    setFilters({
      ...filters,
      ...(data.filters.companyId && {
        companyId: data.filters.companyId[0].value,
      }),
      ...(!data.filters.companyId && { companyId: props.variables.companyId }),
      ...(data.filters.quoteState && {
        quoteState: data.filters.quoteState[0].value.value,
      }),
      ...(!data.filters.quoteState && {
        quoteState: undefined,
      }),
    });
  };

  const { data, loading } = useQuery(props.query, {
    variables: {
      ...filters,
      searchTerm: searchText,
      limit: perPage,
      offset: (page - 1) * perPage,
    },
    fetchPolicy: 'cache-and-network',
    client: b2bApolloClientContext.apolloClient,
  });

  const renderRow = ({ rowIndex, columnKey }, quotes) => {
    const columnValue = quotes[rowIndex][columnKey];

    switch (columnKey) {
      case 'totalPrice':
        return quotes[rowIndex].originalTotalPrice
          ? formatMoney(columnValue, { formatNumber })
          : NO_VALUE_FALLBACK;
      case 'originalTotalPrice':
        return formatMoney(columnValue || quotes[rowIndex].totalPrice, {
          formatNumber,
        });
      case 'discount':
        return formatMoney(
          quotes[rowIndex].originalTotalPrice
            ? subtraction(
                quotes[rowIndex].originalTotalPrice,
                quotes[rowIndex].totalPrice
              )
            : { currencyCode: currencies[0], centAmount: 0 },
          { formatNumber }
        );
      case 'company':
        return columnValue.name;
      case 'quoteState':
        return formatMessage(messages[columnValue]);
      case 'totalLineItemCount':
        return quotes[rowIndex].lineItems.length;
      case 'actions':
        if (quotes[rowIndex].quoteState === QUOTE_TYPES.APPROVED) {
          return (
            <Spacings.Inline scale="m">
              <IconButton
                icon={<CartIcon />}
                label={formatMessage(messages.placeOrder)}
                onClick={event => {
                  event.stopPropagation();
                  event.nativeEvent.stopImmediatePropagation();
                  push(
                    oneLineTrim`
                  /${key}
                  /b2b-extension
                  /my-company
                  /orders
                  /new
                  /${ORDER_CREATE_TAB_NAMES.ADD_LINE_ITEMS}
                `,
                    { quote: quotes[rowIndex] }
                  );
                }}
              />
            </Spacings.Inline>
          );
        }
        if (quotes[rowIndex].quoteState === QUOTE_TYPES.INITIAL) {
          return (
            <IconButton
              icon={<EditIcon />}
              label={formatMessage(messages.quoteEdit)}
              onClick={event => {
                event.stopPropagation();
                event.nativeEvent.stopImmediatePropagation();
                push(
                  oneLineTrim`
                  /${key}
                  /b2b-extension
                  /my-company
                  /quotes/new
                  /${ORDER_CREATE_TAB_NAMES.ADD_LINE_ITEMS}
                  `,
                  { quote: quotes[rowIndex] }
                );
              }}
            />
          );
        }
        return NO_VALUE_FALLBACK;

      default:
        return columnValue || NO_VALUE_FALLBACK;
    }
  };

  const filterDefinitions = createFilterDefinitions(
    intl,
    props.filtersToExclude
  );

  return (
    <div>
      <Spacings.Inline justifyContent="space-between" alignItems="center">
        <Toolbar
          title={
            <div>
              {formatMessage(messages.title)}
              <TotalResults total={loading ? 0 : data?.quotes?.total} />
            </div>
          }
        />
        {props.includeAddRequestButton && (
          <Spacings.Inset scale="m">
            <Link to={`/${key}/b2b-extension/my-company/quotes/new`}>
              <SecondaryButton
                iconLeft={<PlusBoldIcon />}
                label={formatMessage(messages.requestQuote)}
                onClick={() => {}}
              />
            </Link>
          </Spacings.Inset>
        )}
      </Spacings.Inline>
      <Container>
        <SearchView
          onSearch={none}
          onFilterChange={handleOnFilterChange}
          transformSearchFilterStateBeforeSet={handleTransformSearchFilter}
          setSearchFiltersState={none}
          searchText={searchText}
          sorting={{
            key: 'quoteState',
            order: 'asc',
          }}
          pageSizes={DEFAULT_PAGE_SIZES}
          page={page}
          perPage={perPage}
          areFiltersVisible={true}
          filterDefinitions={filterDefinitions}
          filters={initialFiltersQuoteState}
          count={data?.quotes?.count || 0}
          total={data?.quotes?.total || 0}
          results={data?.quotes?.results || []}
          noResultsText={formatMessage(messages.noResultsTitle)}
          searchInputPlaceholder={formatMessage(messages.searchPlaceholder)}
        >
          {({ rowCount, results, measurementResetter, footer }) =>
            loading ? (
              <Spacings.Stack scale="m" alignItems="center">
                <LoadingSpinner />
              </Spacings.Stack>
            ) : (
              <Spacings.Stack scale="m">
                <Table
                  columns={createColumnDefinitions(
                    formatMessage,
                    props.columnsToExclude
                  )}
                  itemRenderer={row => renderRow(row, data.quotes.results)}
                  rowCount={rowCount}
                  onRowClick={(_, rowIndex) =>
                    handleRowClick(rowIndex, data.quotes.results)
                  }
                  measurementResetter={measurementResetter}
                  shouldFillRemainingVerticalSpace={true}
                  items={results}
                >
                  {footer}
                  <PageBottomSpacer />
                </Table>
              </Spacings.Stack>
            )
          }
        </SearchView>
      </Container>
    </div>
  );
};

QuotesList.displayName = 'QuotesList';
QuotesList.propTypes = {
  query: PropTypes.object.isRequired,
  variables: PropTypes.shape({
    employeeId: PropTypes.string,
    companyId: PropTypes.string,
  }).isRequired,
  columnsToExclude: PropTypes.arrayOf(PropTypes.string),
  filtersToExclude: PropTypes.arrayOf(PropTypes.string),
  includeAddRequestButton: PropTypes.bool.isRequired,
  generateDetailLink: PropTypes.func.isRequired,
};
export default QuotesList;
