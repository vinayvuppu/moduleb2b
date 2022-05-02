import React from 'react';
import { useIntl } from 'react-intl';
import { Text, Spacings } from '@commercetools-frontend/ui-kit';
import messages from './messages';

const PredicateDescriptionModal = () => {
  const { formatMessage } = useIntl();

  return (
    <Spacings.Stack>
      <Text.Headline as="h3">
        {formatMessage(messages.predicateArgumentsLabel)}
      </Text.Headline>
      <Text.Subheadline as="h5">
        {formatMessage(messages.argumentOrder)}
      </Text.Subheadline>
      <Text.Detail>
        <ul>
          <li>
            {formatMessage(messages.argumentTotalPrice)}
            {': '}
            <strong>{'order.totalPrice'}</strong>
          </li>
          <li>
            {formatMessage(messages.argumentShippingPrice)}
            {': '}
            <strong>{'order.shippingInfo.price'}</strong>
          </li>
          <li>
            {formatMessage(messages.argumentOrderEmployeeEmail)}
            {': '}
            <strong>{'order.employeeEmail'}</strong>
          </li>
          <li>
            {formatMessage(messages.argumentCreationDate)}
            {': '}
            <strong>{'order.createdAt'}</strong>
          </li>
        </ul>
      </Text.Detail>
      <Text.Subheadline as="h5">
        {formatMessage(messages.argumentEmployee)}
      </Text.Subheadline>
      <Text.Detail>
        <ul>
          <li>
            {formatMessage(messages.argumentRole)}
            {': '}
            <strong>{'employee.role'}</strong>
          </li>
          <li>
            {formatMessage(messages.argumentEmployeeEmail)}
            {': '}
            <strong>{'employee.email'}</strong>
          </li>
        </ul>
      </Text.Detail>

      <Text.Headline as="h3">
        {formatMessage(messages.predicateOperatorsLabel)}
      </Text.Headline>
      <Text.Detail isBold={true}>
        <ul>
          <li>{'>'}</li>
          <li>{'>='}</li>
          <li>{'<'}</li>
          <li>{'<='}</li>
          <li>{'='}</li>
          <li>{'contains'}</li>
        </ul>
      </Text.Detail>

      <Text.Headline as="h3">
        {formatMessage(messages.predicateLogicalOperatorsLabel)}
      </Text.Headline>
      <Text.Detail isBold={true}>
        <ul>
          <li>{'and'}</li>
          <li>{'or'}</li>
        </ul>
      </Text.Detail>

      <Text.Headline as="h3">
        {formatMessage(messages.predicateExamples)}
      </Text.Headline>
      <Text.Detail>
        <ul>
          <li>
            {formatMessage(messages.predicateExampleOne)}
            {': '}
            <strong>
              {'order.totalPrice > 10000.00 or order.shippingInfo.price >= 200'}
            </strong>
          </li>
          <li>
            {formatMessage(messages.predicateExampleTwo)}
            {': '}
            <strong>
              {
                'order.createdAt > 2020-03-01T00:00:00.000Z and employee.role contains b2b-company-employee'
              }
            </strong>
          </li>
        </ul>
      </Text.Detail>
    </Spacings.Stack>
  );
};
PredicateDescriptionModal.displayName = 'PredicateDescriptionModal';
PredicateDescriptionModal.propTypes = {};

export default PredicateDescriptionModal;
