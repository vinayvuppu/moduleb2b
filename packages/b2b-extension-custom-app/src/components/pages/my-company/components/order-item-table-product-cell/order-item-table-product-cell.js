/**
  TECH DEBT:

  1. Can be replaced once `nameAllLocales` is available. Reference to GraphQL docs.
*/
import { PropTypes } from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { withApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import missingImageIconUri from '@commercetools-frontend/assets/images/diagonal-line.svg';
import { Spacings, Text } from '@commercetools-frontend/ui-kit';
import { filterDataAttributes } from '@commercetools-local/utils/dataset';
import localize from '@commercetools-local/utils/localize';
import truncate from '@commercetools-local/utils/truncate';
import ImageContainer from '@commercetools-local/core/components/image-container';
import messages from './messages';

const getImageUrl = ({ lineItem, isCustomLineItem }) => {
  if (isCustomLineItem) return missingImageIconUri;
  // We optionally select `Variant` from lineItem with the risk that
  // `lineItem.variant` could have been deleted from the project
  // through missync (multi project setup)
  return lineItem.variant && lineItem.variant?.images?.length > 0
    ? lineItem.variant.images[0].url
    : undefined;
};

export const OrderItemTableProductCell = props => {
  const imageUrl = getImageUrl(props);
  const PRODUCT_NAME_MAX_LENGTH = 30;
  const PRODUCT_SKU_MAX_LENGTH = 26;
  return (
    <Spacings.Inline alignItems="center" {...filterDataAttributes(props)}>
      <ImageContainer
        url={imageUrl}
        size="thumb"
        useExternalIconAsFallback={props.useExternalIconAsFallback}
      />
      <Spacings.Stack scale="xs">
        {/* // TECH DEBT: 1. */}
        <span>
          {truncate(
            typeof props.lineItem.name === 'string'
              ? props.lineItem.name
              : localize({
                  obj: props.lineItem,
                  key: 'name',
                  language: props.language,
                  fallback: props.lineItem.id,
                  fallbackOrder: props.languages,
                }),
            PRODUCT_NAME_MAX_LENGTH
          )}
        </span>
        {!props.isCustomLineItem && (
          <Text.Detail tone="secondary">
            <FormattedMessage
              {...messages.sku}
              values={{
                sku: truncate(
                  props.lineItem.variant.sku,
                  PRODUCT_SKU_MAX_LENGTH
                ),
              }}
            />
          </Text.Detail>
        )}
      </Spacings.Stack>
    </Spacings.Inline>
  );
};

OrderItemTableProductCell.displayName = 'OrderItemTableProductCell';
OrderItemTableProductCell.propTypes = {
  lineItem: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    productId: PropTypes.string,
    variant: PropTypes.shape({
      sku: PropTypes.string,
      images: PropTypes.array.isRequired,
    }),
  }),
  isCustomLineItem: PropTypes.bool.isRequired,
  language: PropTypes.string.isRequired,
  languages: PropTypes.arrayOf(PropTypes.string).isRequired,
  useExternalIconAsFallback: PropTypes.bool.isRequired,
};

OrderItemTableProductCell.defaultProps = {
  useExternalIconAsFallback: false,
};

export default withApplicationContext(applicationContext => ({
  language: applicationContext.dataLocale,
  languages: applicationContext.project.languages,
}))(OrderItemTableProductCell);
