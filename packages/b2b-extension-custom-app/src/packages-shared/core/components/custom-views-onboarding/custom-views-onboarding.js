import PropTypes from 'prop-types';
import React from 'react';
import { compose } from 'recompose';
import {
  InformationIcon,
  SearchIcon,
  ColumnsIcon,
  AngleDownIcon,
  Spacings,
  Text,
  IconButton,
} from '@commercetools-frontend/ui-kit';
import { InfoDialog } from '@commercetools-frontend/application-components';
import { injectIntl, FormattedMessage } from 'react-intl';
import { withModalState } from '../modal-state-container';
import messages from './messages';

export const CustomViewsOnboarding = props => (
  <React.Fragment>
    <IconButton
      label={props.intl.formatMessage(messages.buttonLabel)}
      icon={<InformationIcon />}
      size="medium"
      onClick={() =>
        props.onboardingModal.isOpen
          ? props.onboardingModal.handleClose()
          : props.onboardingModal.handleOpen()
      }
      isDisabled={props.isDisabled}
      data-track-component="Toggle"
      data-track-event="click"
    />
    {props.onboardingModal.isOpen && (
      <InfoDialog
        title={props.intl.formatMessage(messages.infoDialogTitle)}
        isOpen={true}
        onClose={props.onboardingModal.handleClose}
      >
        <Spacings.Stack scale="l">
          <Text.Body>
            <FormattedMessage {...messages.infoDialogIntroduction} />
          </Text.Body>
          <Spacings.Stack scale="m">
            <Text.Subheadline as="h4" isBold={true}>
              <FormattedMessage {...messages.infoDialogDetailsTitle} />
            </Text.Subheadline>
            <Spacings.Inline scale="l">
              <Spacings.Stack>
                <Spacings.Inline alignItems="center">
                  <SearchIcon />
                  <Text.Detail isBold={true}>
                    <FormattedMessage
                      {...messages.infoDialogDetailsSearchAndFiltersTitle}
                    />
                  </Text.Detail>
                </Spacings.Inline>
                <Text.Detail>
                  <FormattedMessage
                    {...messages.infoDialogDetailsSearchAndFiltersDescription}
                  />
                </Text.Detail>
              </Spacings.Stack>
              <Spacings.Stack>
                <Spacings.Inline alignItems="center">
                  <ColumnsIcon />
                  <Text.Detail isBold={true}>
                    <FormattedMessage
                      {...messages.infoDialogDetailsColumnManagerTitle}
                    />
                  </Text.Detail>
                </Spacings.Inline>
                <Text.Detail>
                  <FormattedMessage
                    {...messages.infoDialogDetailsColumnManagerDescription}
                  />
                </Text.Detail>
              </Spacings.Stack>
              <Spacings.Stack>
                <Spacings.Inline alignItems="center">
                  <AngleDownIcon />
                  <Text.Detail isBold={true}>
                    <FormattedMessage
                      {...messages.infoDialogDetailsTableSortingTitle}
                    />
                  </Text.Detail>
                </Spacings.Inline>
                <Text.Detail>
                  <FormattedMessage
                    {...messages.infoDialogDetailsTableSortingDescription}
                  />
                </Text.Detail>
              </Spacings.Stack>
            </Spacings.Inline>
          </Spacings.Stack>
        </Spacings.Stack>
      </InfoDialog>
    )}
  </React.Fragment>
);
CustomViewsOnboarding.displayName = 'CustomViewsOnboarding';

CustomViewsOnboarding.propTypes = {
  isDisabled: PropTypes.bool,
  // injectIntl
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
  // withModalState
  onboardingModal: PropTypes.shape({
    isOpen: PropTypes.bool.isRequired,
    handleOpen: PropTypes.func.isRequired,
    handleClose: PropTypes.func.isRequired,
  }).isRequired,
};

export default compose(
  injectIntl,
  withModalState('onboardingModal')
)(CustomViewsOnboarding);
