import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Spacings, Text } from '@commercetools-frontend/ui-kit';
import { InfoDialog } from '@commercetools-frontend/application-components';
import messages from './messages';

export const HighPrecisonInfoDialog = props => (
  <InfoDialog
    title={props.intl.formatMessage(messages.priceInputHint)}
    isOpen={props.isOpen}
    onClose={props.onClose}
    zIndex={2000}
  >
    <Spacings.Stack scale="m">
      <ul>
        <li>
          <Text.Body>
            <FormattedMessage
              {...messages.highPrecisionInfoModalDescription}
              values={{
                subCents: (
                  <Text.Body isBold={true} as="span">
                    <FormattedMessage {...messages.subCentsText} />
                  </Text.Body>
                ),
                amountOfFractionDigits: (
                  <Text.Body isBold={true} as="span">
                    <FormattedMessage {...messages.fractionDigitCount} />
                  </Text.Body>
                ),
              }}
            />
          </Text.Body>
        </li>
      </ul>
      <ul>
        <li>
          <Text.Body>
            <FormattedMessage
              {...messages.highPrecisionInfoModalUsage}
              values={{
                lowUnitPrice: (
                  <Text.Body isBold={true} as="span">
                    <FormattedMessage {...messages.lowUnitPrice} />
                  </Text.Body>
                ),
              }}
            />
          </Text.Body>
        </li>
      </ul>
      {props.showTierPriceInfo ? (
        <ul>
          <li>
            <Text.Body>
              <FormattedMessage
                {...messages.highPrecisionInfoModalTier}
                values={{
                  tieredPrices: (
                    <Text.Body isBold={true} as="span">
                      <FormattedMessage {...messages.tieredPrices} />
                    </Text.Body>
                  ),
                }}
              />
            </Text.Body>
          </li>
        </ul>
      ) : null}
    </Spacings.Stack>
  </InfoDialog>
);

HighPrecisonInfoDialog.displayName = 'HighPrecisionInfoDialog';
HighPrecisonInfoDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  showTierPriceInfo: PropTypes.bool,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
};

export default injectIntl(HighPrecisonInfoDialog);
