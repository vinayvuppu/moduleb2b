import React from 'react';
import PropTypes from 'prop-types';
import { useIntl, FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import {
  Spacings,
  CollapsiblePanel,
  IconButton,
  Tooltip,
  UserLinearIcon,
  ConnectedSquareIcon,
  MailIcon,
  Text,
} from '@commercetools-frontend/ui-kit';

import messages from './messages';

export const QuoteEmployeePanel = props => {
  const intl = useIntl();

  const { formatMessage } = intl;

  // eslint-disable-next-line react/display-name
  const renderLinks = () => (
    <Spacings.Inline>
      <Link
        to={`/${props.projectKey}/b2b-extension/employees/${props.quote.employeeId}`}
        id="employee-panel-employee-link"
      >
        <Tooltip placement="left" title={formatMessage(messages.goToEmployee)}>
          <IconButton
            data-track-component="IconButton"
            data-track-label="go-to-employee"
            data-track-event="click"
            label={formatMessage(messages.goToEmployee)}
            icon={<UserLinearIcon />}
          />
        </Tooltip>
      </Link>
      <Link
        to={`/${props.projectKey}/b2b-extension/companies/${props.quote.company.id}`}
        id="employee-panel-company-link"
      >
        <Tooltip placement="left" title={formatMessage(messages.goToCompany)}>
          <IconButton
            data-track-component="IconButton"
            data-track-label="go-to-company"
            data-track-event="click"
            label={formatMessage(messages.goToCompany)}
            icon={<ConnectedSquareIcon />}
          />
        </Tooltip>
      </Link>
    </Spacings.Inline>
  );

  return (
    <CollapsiblePanel
      data-testid="quote-employee-panel"
      header={
        <CollapsiblePanel.Header>
          <FormattedMessage {...messages.panelTitle} />
        </CollapsiblePanel.Header>
      }
      headerControls={props.isAuthorized && renderLinks()}
    >
      <Spacings.Stack scale="xs">
        <Spacings.Inline
          data-testid="employee-panel-employeeEmail"
          alignItems="center"
        >
          <Text.Detail>
            <FormattedMessage
              {...messages.employeeEmailLabel}
              values={{ email: props.quote.employeeEmail }}
            />
          </Text.Detail>
          <MailIcon />
        </Spacings.Inline>
        <Spacings.Inline
          data-testid="employee-panel-companyName"
          alignItems="center"
        >
          <Text.Detail>
            <FormattedMessage
              {...messages.companylabel}
              values={{ name: props.quote.company.name }}
            />
          </Text.Detail>
        </Spacings.Inline>
      </Spacings.Stack>
    </CollapsiblePanel>
  );
};

QuoteEmployeePanel.displayName = 'QuoteEmployeePanel';
QuoteEmployeePanel.propTypes = {
  quote: PropTypes.object,
  projectKey: PropTypes.string.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
};

export default QuoteEmployeePanel;
