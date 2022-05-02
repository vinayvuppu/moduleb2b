import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import requiredIf from 'react-required-if';
import {
  Spacings,
  PrimaryButton,
  SelectField,
  Card,
  Constraints,
  Text,
} from '@commercetools-frontend/ui-kit';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import ImageContainer from '@commercetools-local/core/components/image-container';
import { formatMoney } from '@commercetools-local/utils/formats/money';
import { PRECISION_TYPES } from '@commercetools-local/utils/constants';

import QuantitySelector from '../quantity-selector';
import { getAttributeValueByType } from '../../utils/attributes';

import styles from './order-create-products-list-item.mod.css';
import messages from './messages';

export const getImageUrl = variant => {
  return variant && variant?.images?.length > 0
    ? variant.images[0].url
    : undefined;
};

export const getVariantAttributes = productType =>
  productType?.obj.attributes.filter(
    attr => attr.attributeConstraint === 'CombinationUnique'
  );

export const getAttributeValues = (product, attributeName) => {
  const variants = [product.masterVariant, ...product.variants];
  const values = [];
  variants.forEach(variant => {
    const attribute = variant.attributes.find(
      attr => attr.name === attributeName
    );
    if (attribute) {
      values.push(attribute.value);
    }
  });
  return values;
};

export const getVariantSelectors = (product, dataLocale) => {
  const selectors = {};

  const variantAttributes = getVariantAttributes(product.productType);

  variantAttributes.forEach(attr => {
    const type = attr.type.name;
    const values = getAttributeValues(product, attr.name);
    if (values?.length) {
      selectors[attr.label[dataLocale]] = values.map(value =>
        getAttributeValueByType(value, type, dataLocale)
      );
    }
  });

  return selectors;
};

export const isSingleVariant = product => product.variants.length === 0;

export const selectVariant = (product, attributesSelected, dataLocale) => {
  const variants = [product.masterVariant, ...product.variants];

  if (isSingleVariant(product)) {
    return product.masterVariant;
  }

  const variant = variants.find(v => {
    return Object.keys(attributesSelected).every(attrSelected =>
      v.attributes.find(
        attr =>
          attr.name ===
            product.productType.obj.attributes.find(
              ptAttr => ptAttr.label[dataLocale] === attrSelected
            ).name &&
          (attr.value === attributesSelected[attrSelected] ||
            attr.value.key === attributesSelected[attrSelected])
      )
    );
  });

  return variant;
};

const initAttributes = (product, variantSelectors, dataLocale) => {
  const attributesSelected = {};

  Object.keys(variantSelectors).every(selector => {
    const attribute = product.productType.obj.attributes.find(
      attr => attr.label[dataLocale] === selector
    );

    const masterVariatnAttribute = product.masterVariant.attributes.find(
      attr => attr.name === attribute.name
    );
    attributesSelected[selector] = masterVariatnAttribute.value;
  });
  return attributesSelected;
};

const OrderCreateProductsListItem = props => {
  const { dataLocale } = useApplicationContext(applicationContext => ({
    dataLocale: applicationContext.dataLocale,
  }));

  const intl = useIntl();

  const [quantitySelected, setQuantitySelected] = useState('1');

  const variantSelectors = getVariantSelectors(props, dataLocale);

  const [attributesSelected, setAttributesSelected] = useState(
    initAttributes(props, variantSelectors, dataLocale)
  );

  const variantSelected = selectVariant(props, attributesSelected, dataLocale);

  return (
    <Card className={styles.card} theme="dark">
      <Spacings.Inset scale="xl">
        <Constraints.Horizontal>
          <Spacings.Stack scale="m">
            <div className={styles.title}>{props.name[dataLocale]}</div>
            <ImageContainer
              url={getImageUrl(variantSelected)}
              size="medium"
              imageContainerClassName={styles['image-container']}
              useExternalIconAsFallback={false}
            />
            {variantSelected && (
              <Text.Subheadline as="h5" truncate={true} isBold={true}>
                {variantSelected.sku}
              </Text.Subheadline>
            )}
            {variantSelected ? (
              <div>
                {formatMoney(
                  variantSelected.price?.value ||
                    variantSelected.prices[0].value,
                  intl
                )}
              </div>
            ) : (
              <div>--</div>
            )}
            <Spacings.Inline scale="s">
              <QuantitySelector
                onChange={setQuantitySelected}
                quantity={quantitySelected}
                maxValue={10}
              />
              <PrimaryButton
                label={intl.formatMessage(messages.addButton)}
                onClick={() => {
                  props.onAddVariantToCart({
                    sku: variantSelected.sku,
                    quantity: quantitySelected,
                  });
                }}
                isDisabled={!variantSelected || props.isAddingVariant}
              />
            </Spacings.Inline>
            {!isSingleVariant(props) &&
              Object.keys(variantSelectors).map(variantSelector => (
                <SelectField
                  key={variantSelector}
                  title={variantSelector}
                  options={variantSelectors[variantSelector]}
                  value={attributesSelected[variantSelector]}
                  onChange={event => {
                    setAttributesSelected({
                      ...attributesSelected,
                      [variantSelector]: event.target.value,
                    });
                  }}
                />
              ))}
          </Spacings.Stack>
        </Constraints.Horizontal>
      </Spacings.Inset>
    </Card>
  );
};

OrderCreateProductsListItem.displayName = 'OrderCreateProductsListItem';
OrderCreateProductsListItem.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.object.isRequired,
  masterVariant: PropTypes.shape({
    id: PropTypes.number.isRequired,
    sku: PropTypes.string.isRequired,
    images: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string,
      })
    ).isRequired,
    price: PropTypes.shape({
      value: PropTypes.shape({
        currencyCode: PropTypes.string.isRequired,
        centAmount: requiredIf(
          PropTypes.number,
          props => props.type === PRECISION_TYPES.centPrecision
        ),
        preciseAmount: requiredIf(
          PropTypes.number,
          props => props.type === PRECISION_TYPES.highPrecision
        ),
      }),
    }),
  }).isRequired,
  variants: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      sku: PropTypes.string.isRequired,
      images: PropTypes.arrayOf(
        PropTypes.shape({
          url: PropTypes.string,
        })
      ).isRequired,
      price: PropTypes.shape({
        value: PropTypes.shape({
          currencyCode: PropTypes.string.isRequired,
          centAmount: requiredIf(
            PropTypes.number,
            props => props.type === PRECISION_TYPES.centPrecision
          ),
          preciseAmount: requiredIf(
            PropTypes.number,
            props => props.type === PRECISION_TYPES.highPrecision
          ),
        }),
      }),
    })
  ),
  productType: PropTypes.object.isRequired,
  onAddVariantToCart: PropTypes.func.isRequired,
  isAddingVariant: PropTypes.bool.isRequired,
};
export default OrderCreateProductsListItem;
