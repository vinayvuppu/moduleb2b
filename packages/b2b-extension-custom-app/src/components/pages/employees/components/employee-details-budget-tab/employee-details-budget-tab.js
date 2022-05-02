import PropTypes from 'prop-types';
import React from 'react';
import {
  CollapsiblePanel,
  LoadingSpinner,
  Spacings,
  Text,
} from '@commercetools-frontend/ui-kit';
import { formatMoney } from '@commercetools-local/utils/formats/money';
import FormBox from '@commercetools-local/core/components/form-box';
import { Pie } from 'react-chartjs-2';

import { useIntl } from 'react-intl';
import AmountValue from './AmountValue';
import messages from './messages';
import { sum, convertToNumber } from '../../../../utils/money';

const EmployeeDetailsBudgetTab = props => {
  const intl = useIntl();

  const setZeroIfNegative = number => (number < 0 ? 0 : number);

  return props.employeeFetcher.isLoading ? (
    <LoadingSpinner />
  ) : (
    <CollapsiblePanel
      data-testid="employee-budget-details"
      header={
        <CollapsiblePanel.Header>
          {intl.formatMessage(messages.panelTitle)}
        </CollapsiblePanel.Header>
      }
    >
      <FormBox>
        <AmountValue
          label={intl.formatMessage(messages.amountRemaining)}
          amount={props.employeeFetcher.employee.amountRemaining}
          noValueLabel={intl.formatMessage(messages.unlimited)}
          errorOnNegative
        />
      </FormBox>
      <FormBox>
        <AmountValue
          label={intl.formatMessage(messages.amountExpended)}
          amount={props.employeeFetcher.employee.amountExpended}
          noValueLabel={intl.formatMessage(messages.unlimited)}
        />
      </FormBox>
      {props.employeeFetcher.employee.amountRemaining && (
        <FormBox>
          <Spacings.Stack alignItems="center">
            <Pie
              data={{
                labels: [
                  intl.formatMessage(messages.amountRemaining),
                  intl.formatMessage(messages.amountExpended),
                ],
                datasets: [
                  {
                    data: [
                      setZeroIfNegative(
                        convertToNumber(
                          props.employeeFetcher.employee.amountRemaining
                        )
                      ),
                      setZeroIfNegative(
                        convertToNumber(
                          props.employeeFetcher.employee.amountExpended
                        )
                      ),
                    ],
                    backgroundColor: ['#F5A72F', '#01B39E'],
                  },
                ],
              }}
            />
            <Text.Body>
              {intl.formatMessage(messages.totalBudget, {
                total: formatMoney(
                  sum(
                    props.employeeFetcher.employee.amountRemaining,
                    props.employeeFetcher.employee.amountExpended
                  ),
                  intl
                ),
              })}
            </Text.Body>
          </Spacings.Stack>
        </FormBox>
      )}
    </CollapsiblePanel>
  );
};

EmployeeDetailsBudgetTab.propTypes = {
  employeeFetcher: PropTypes.shape({
    isLoading: PropTypes.bool.isRequired,
    employee: PropTypes.object,
  }),
};

EmployeeDetailsBudgetTab.displayName = 'EmployeeDetailsBudgetTab';

export default EmployeeDetailsBudgetTab;
