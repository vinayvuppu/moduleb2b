import PropTypes from 'prop-types';
import React from 'react';
import { useQuery } from 'react-apollo';
import { defineMessages, FormattedMessage } from 'react-intl';
import { LoadingSpinner } from '@commercetools-frontend/ui-kit';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import { QUERY_MAX_LIMIT } from '../../../constants';
import ThrottledField from '../../fields/throttled-field';
import validatedInput, { VALIDATOR_REQUIRED } from '../../validated-input';
import getReferenceSearchComponentByType from '../reference-search';
import { CartDiscountsCount } from '../../../actions/reference-search/cart-discount/cart-discount.graphql';
import styles from '../attribute-input-reference/attribute-input-reference.mod.css';

export const RequiredThrottledField = validatedInput(ThrottledField, [
  VALIDATOR_REQUIRED,
]);

const messages = defineMessages({
  placeholder: {
    id: 'CartDiscountReferenceSearch.byId.placeholder',
    description: 'Placeholder for search for a cart discount by ID',
    defaultMessage: 'Cart Discount ID',
  },
});

const CartDiscountReferenceSearch = props => {
  const { loading, data } = useQuery(CartDiscountsCount, {
    variables: {
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
    },
    fetchPolicy: 'cache-and-network',
  });

  if (loading)
    return (
      <div data-testid="loading-spinner">
        <LoadingSpinner />
      </div>
    );

  if (data?.cartDiscounts.total <= QUERY_MAX_LIMIT) {
    const ReferenceSearchComponent = getReferenceSearchComponentByType(
      props.typeId
    );

    return (
      <div data-testid="reference-by-name">
        <ReferenceSearchComponent
          definition={props.definition}
          isSet={props.isSet}
          onChangeValue={props.onChangeValue}
          onFocusValue={props.onFocusValue}
          selectedLanguage={props.selectedLanguage}
          languages={props.languages}
          setInvalidValueState={props.setInvalidValueState}
          value={props.attribute.value}
          disabled={props.disabled}
        />
      </div>
    );
  }

  const inputProps = {
    name: props.attribute.name,
    value: props.attribute.value ? props.attribute.value.id : null,
    className: styles.input,
    onChange: props.onChange,
    onBlurValue: props.onBlur,
    disabled: props.disabled,
  };

  return (
    <div data-testid="reference-by-id">
      <FormattedMessage {...messages.placeholder}>
        {placeholder =>
          props.definition.isRequired ? (
            <RequiredThrottledField {...inputProps} placeholder={placeholder} />
          ) : (
            <ThrottledField {...inputProps} placeholder={placeholder} />
          )
        }
      </FormattedMessage>
    </div>
  );
};

CartDiscountReferenceSearch.displayName = 'CartDiscountReferenceSearch';
CartDiscountReferenceSearch.propTypes = {
  typeId: PropTypes.string.isRequired,
  attribute: PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.any,
  }),
  definition: PropTypes.shape({
    type: PropTypes.shape({
      name: PropTypes.oneOf(['reference', 'set']),
    }),
    isRequired: PropTypes.bool,
  }),
  disabled: PropTypes.bool,
  isSet: PropTypes.bool,
  onBlur: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  onBlurValue: PropTypes.func,
  onChangeValue: PropTypes.func.isRequired,
  onFocusValue: PropTypes.func,
  selectedLanguage: PropTypes.string.isRequired,
  languages: PropTypes.arrayOf(PropTypes.string),
  setInvalidValueState: PropTypes.func,
};

export default CartDiscountReferenceSearch;
