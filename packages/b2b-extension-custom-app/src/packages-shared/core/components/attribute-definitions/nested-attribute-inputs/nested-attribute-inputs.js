import PropTypes from 'prop-types';
import React from 'react';
import flowRight from 'lodash.flowright';
import { injectIntl, FormattedMessage } from 'react-intl';
import { reportErrorToSentry } from '@commercetools-frontend/sentry';
import {
  PlusBoldIcon,
  Spacings,
  Text,
  FlatButton,
  IconButton,
  AngleUpIcon,
  AngleDownIcon,
  EditIcon,
  SubdirectoryArrowIcon,
  BinFilledIcon,
  Tooltip,
  LoadingSpinner,
  Tag,
} from '@commercetools-frontend/ui-kit';
import injectTracking from '../../tracking/inject-tracking';
import AttributeInputTip from '../attribute-input-tip';
import NestedAttributeDetails from '../../nested-attribute-details';
import messages from './messages';
import ProductTypeDetailsConnector from './product-type-details-connector';
import trackingEvents from './tracking-events';
import styles from './nested-attribute-inputs.mod.css';

import NestedAttributesContext from '../../nested-attributes-container/nested-attributes-context';

// This component is used to "reset" the default wrapper styles of
// the Tooltip in order to render the underlying input with full width.
// eslint-disable-next-line react/display-name
const WrapperComponent = React.forwardRef((props, ref) => (
  <div {...props} ref={ref} />
));

function removeAttributeByIndex(value, index) {
  return value.filter((_, attrIndex) => attrIndex !== index);
}

const attributeDetailsInitialState = {};
const attributeDetailsActionTypes = {
  SET_OPEN: 'SET_OPEN',
  SET_CLOSE: 'SET_CLOSE',
};
const attributeDetailsReducer = (state, action) => {
  switch (action.type) {
    case attributeDetailsActionTypes.SET_OPEN:
      return { ...state, [action.payload]: true };
    case attributeDetailsActionTypes.SET_CLOSE:
      return { ...state, [action.payload]: false };
    default:
      throw new Error(
        `Action type '${action.type}' for 'attributeDetailsReducer'-reducer not defined.`
      );
  }
};

function NestedAttributeInputs(props) {
  const {
    addOpenedModalLevelToStack,
    canUpdateInternalProductDraft,
    updateInternalProductDraft,
    setShouldUpdateInternalDraft,
  } = React.useContext(NestedAttributesContext);

  const [attributeDetailsState, dispatchAttributeDetails] = React.useReducer(
    attributeDetailsReducer,
    attributeDetailsInitialState
  );

  const setAttributeDetails = React.useCallback(
    ({ isOpen, productTypeId }) =>
      dispatchAttributeDetails({
        type: isOpen
          ? attributeDetailsActionTypes.SET_OPEN
          : attributeDetailsActionTypes.SET_CLOSE,
        payload: productTypeId,
      }),
    [dispatchAttributeDetails]
  );

  const [
    isNestedAttributesCollapsed,
    setIsNestedAttributesCollapsed,
  ] = React.useState(true);

  const [
    isDraftContainNewItemOfSet,
    setIsDraftContainNewItemOfSet,
  ] = React.useState(false);

  React.useEffect(() => {
    if (isDraftContainNewItemOfSet) {
      updateInternalProductDraft();
      setIsDraftContainNewItemOfSet(false);
    }
  }, [isDraftContainNewItemOfSet, updateInternalProductDraft]);

  const isSetType = props.definition.type.name === 'set';
  const type = isSetType
    ? props.definition.type?.elementType
    : props.definition.type;

  const typeDetails = type.typeReference;
  if (!typeDetails) return null;

  return (
    <ProductTypeDetailsConnector id={typeDetails.id}>
      {({ productTypeDetails }) => {
        if (productTypeDetails.isLoading) return <LoadingSpinner />;
        if (productTypeDetails.error) {
          reportErrorToSentry(productTypeDetails.error);
          return null;
        }
        const productTypeId = productTypeDetails.productType.id;
        // this will be the lookup that we use to get
        // the attribute definition, when setting the value
        const nextPathDefinitions = {
          ...props.pathDefinitions,
          [productTypeId]: productTypeDetails.productType,
        };
        const referencedNestedAttributeNameWithHint = (
          <React.Fragment>
            <Text.Detail>
              <FormattedMessage
                {...messages.referencedProductType}
                values={{
                  productTypeName: productTypeDetails.productType.name,
                }}
              />
            </Text.Detail>
            <AttributeInputTip
              inputTip={props.definition.inputTip}
              language={props.selectedLanguage}
              languages={props.languages}
            />
          </React.Fragment>
        );
        if (productTypeDetails.productType.attributes.length === 0)
          return (
            <Spacings.Stack>
              {referencedNestedAttributeNameWithHint}
              <Text.Detail tone="secondary">
                <FormattedMessage {...messages.emptyProductType} />
              </Text.Detail>
            </Spacings.Stack>
          );

        if (!isSetType)
          return (
            <Spacings.Stack>
              {referencedNestedAttributeNameWithHint}
              <Spacings.Inline alignItems="center">
                <Text.Detail>{productTypeDetails.productType.name}</Text.Detail>
                <div className={styles['set-controls-container']}>
                  <Spacings.Inline
                    alignItems="center"
                    justifyContent="flex-end"
                  >
                    <Tooltip
                      placement="top"
                      title={
                        canUpdateInternalProductDraft
                          ? props.intl.formatMessage(
                              messages.editTooltipDisabled
                            )
                          : props.intl.formatMessage(messages.editTooltip)
                      }
                      components={{ WrapperComponent }}
                    >
                      <IconButton
                        label="Edit"
                        data-testid="edit-nested-attribute"
                        isDisabled={canUpdateInternalProductDraft}
                        icon={<EditIcon />}
                        size="medium"
                        onClick={() => {
                          props.track(
                            trackingEvents.openEditNestedAttributesModal.action,
                            trackingEvents.openEditNestedAttributesModal
                              .category,
                            trackingEvents.openEditNestedAttributesModal.label
                          );
                          addOpenedModalLevelToStack(props.level + 1);
                          setAttributeDetails({ isOpen: true, productTypeId });
                        }}
                      />
                    </Tooltip>
                  </Spacings.Inline>
                </div>
                <NestedAttributeDetails
                  pathDefinitions={nextPathDefinitions}
                  level={props.level + 1}
                  namePrefix={`${props.attribute.name}`}
                  isModalOpen={attributeDetailsState[productTypeId]}
                  openModal={() => {
                    setAttributeDetails({ isOpen: true, productTypeId });
                  }}
                  closeModal={() => {
                    setAttributeDetails({ isOpen: false, productTypeId });
                  }}
                  isSetType={isSetType}
                  typeDetails={productTypeDetails.productType}
                  attribute={props.attribute}
                  definition={props.definition}
                  isDisabled={props.disabled}
                  currencies={props.currencies}
                  languages={props.languages}
                  numberFormat={props.numberFormat}
                  handleChangeNestedAttribute={
                    props.handleChangeNestedAttribute
                  }
                  onChangeValue={props.handleChangeNestedAttribute}
                  selectedLanguage={props.selectedLanguage}
                  updateSettings={props.updateSettings}
                  expandSettings={props.expandSettings}
                  attributes={props.attributes}
                />
              </Spacings.Inline>
            </Spacings.Stack>
          );

        const countOfSetItem = props.attribute.value?.length || 1;
        const lastSetItemIndex = countOfSetItem - 1;

        return (
          <Spacings.Stack>
            {referencedNestedAttributeNameWithHint}
            {Array.from(Array(countOfSetItem), (_, index) => {
              if (isNestedAttributesCollapsed && index !== lastSetItemIndex)
                return null;
              const hasNoValue =
                !props.attribute.value?.[index] ||
                props.attribute.value?.[index].length === 0;

              return (
                <Spacings.Inline alignItems="center" key={index}>
                  <Spacings.Inline alignItems="center" scale="xs">
                    <SubdirectoryArrowIcon size="medium" />
                    <Text.Body>{productTypeDetails.productType.name}</Text.Body>
                    {hasNoValue && (
                      <span>
                        <Tag>
                          <FormattedMessage {...messages.emptySetItem} />
                        </Tag>
                      </span>
                    )}
                  </Spacings.Inline>
                  <div className={styles['set-controls-container']}>
                    <Spacings.Inline
                      alignItems="center"
                      justifyContent="flex-end"
                    >
                      <Tooltip
                        placement="top"
                        components={{ WrapperComponent }}
                        title={
                          canUpdateInternalProductDraft
                            ? props.intl.formatMessage(
                                messages.editTooltipDisabled
                              )
                            : props.intl.formatMessage(messages.editTooltip)
                        }
                      >
                        <IconButton
                          label="Edit set item"
                          data-testid={`edit-set-item-${index}`}
                          isDisabled={canUpdateInternalProductDraft}
                          icon={<EditIcon />}
                          size="medium"
                          onClick={() => {
                            addOpenedModalLevelToStack(props.level + 1);
                            setAttributeDetails({
                              isOpen: true,
                              productTypeId: `${productTypeId}-${index}`,
                            });
                          }}
                        />
                      </Tooltip>
                      <Tooltip
                        placement="top"
                        components={{ WrapperComponent }}
                        title={props.intl.formatMessage(
                          messages.deleteSetItemTooltip
                        )}
                      >
                        <IconButton
                          label="Remove set item"
                          isDisabled={
                            !props.attribute.value ||
                            props.attribute.value.length <= 1
                          }
                          data-testid={`remove-set-item-${index}`}
                          icon={<BinFilledIcon />}
                          size="medium"
                          onClick={() => {
                            setShouldUpdateInternalDraft(true);
                            props.handleChangeNestedAttribute(
                              {
                                name: props.attribute.name,
                                value: removeAttributeByIndex(
                                  props.attribute.value,
                                  index
                                ),
                              },
                              nextPathDefinitions
                            );
                          }}
                        />
                      </Tooltip>
                      {index === lastSetItemIndex ? (
                        <Tooltip
                          placement="top"
                          components={{ WrapperComponent }}
                          title={
                            hasNoValue
                              ? props.intl.formatMessage(
                                  messages.addSetItemTooltipDisabled
                                )
                              : props.intl.formatMessage(
                                  messages.addSetItemTooltip
                                )
                          }
                        >
                          <IconButton
                            label="Add set item"
                            data-testid={`add-set-item-${index}`}
                            icon={<PlusBoldIcon />}
                            size="medium"
                            isDisabled={hasNoValue}
                            onClick={() => {
                              setShouldUpdateInternalDraft(true);
                              props.handleChangeNestedAttribute(
                                {
                                  name: props.attribute.name,
                                  value: props.attribute.value.length && [
                                    ...props.attribute.value,
                                    [],
                                  ],
                                },
                                nextPathDefinitions
                              );
                              setIsNestedAttributesCollapsed(false);
                              setIsDraftContainNewItemOfSet(true);
                            }}
                          />
                        </Tooltip>
                      ) : (
                        <div
                          className={styles['delete-set-item-placeholder']}
                        />
                      )}
                    </Spacings.Inline>
                  </div>
                  <NestedAttributeDetails
                    level={props.level + 1}
                    pathDefinitions={nextPathDefinitions}
                    index={index}
                    namePrefix={`${props.attribute.name}.${index}`}
                    isModalOpen={
                      attributeDetailsState[`${productTypeId}-${index}`]
                    }
                    openModal={() => {
                      setAttributeDetails({
                        isOpen: true,
                        productTypeId: `${productTypeId}-${index}`,
                      });
                    }}
                    closeModal={() => {
                      setAttributeDetails({
                        isOpen: false,
                        productTypeId: `${productTypeId}-${index}`,
                      });
                    }}
                    isSetType={isSetType}
                    typeDetails={productTypeDetails.productType}
                    attribute={props.attribute}
                    definition={props.definition}
                    isDisabled={props.disabled}
                    currencies={props.currencies}
                    languages={props.languages}
                    numberFormat={props.numberFormat}
                    handleChangeNestedAttribute={
                      props.handleChangeNestedAttribute
                    }
                    onChangeValue={props.handleChangeNestedAttribute}
                    selectedLanguage={props.selectedLanguage}
                    expandSettings={props.expandSettings}
                    updateSettings={props.updateSettings}
                    attributes={props.attributes}
                  />
                </Spacings.Inline>
              );
            })}
            {countOfSetItem > 1 && (
              <React.Fragment>
                <hr />
                <FlatButton
                  icon={
                    isNestedAttributesCollapsed ? (
                      <AngleDownIcon />
                    ) : (
                      <AngleUpIcon />
                    )
                  }
                  label={
                    isNestedAttributesCollapsed
                      ? props.intl.formatMessage(messages.showSetItems, {
                          countOfSetItem,
                        })
                      : props.intl.formatMessage(messages.hideSetItems, {
                          countOfSetItem,
                        })
                  }
                  onClick={() =>
                    setIsNestedAttributesCollapsed(!isNestedAttributesCollapsed)
                  }
                />
              </React.Fragment>
            )}
          </Spacings.Stack>
        );
      }}
    </ProductTypeDetailsConnector>
  );
}

NestedAttributeInputs.propTypes = {
  definition: PropTypes.shape({
    name: PropTypes.string.isRequired,
    label: PropTypes.object.isRequired,
    inputTip: PropTypes.objectOf(PropTypes.string),
    type: PropTypes.shape({
      name: PropTypes.string.isRequired,
      elementType: PropTypes.shape({
        name: PropTypes.string,
      }),
      typeReference: PropTypes.shape({
        name: PropTypes.string,
      }),
    }),
  }),
  disabled: PropTypes.bool,
  attribute: PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.any,
  }),
  expandSettings: PropTypes.object,
  pathDefinitions: PropTypes.objectOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      description: PropTypes.string,
    })
  ),
  currencies: PropTypes.arrayOf(PropTypes.string).isRequired,
  languages: PropTypes.arrayOf(PropTypes.string).isRequired,
  numberFormat: PropTypes.string,
  selectedLanguage: PropTypes.string,
  language: PropTypes.string,
  updateSettings: PropTypes.func,
  attributes: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.any,
    })
  ),
  onChangeValue: PropTypes.func.isRequired,
  handleChangeNestedAttribute: PropTypes.func.isRequired,
  level: PropTypes.number.isRequired,
  // injectIntl
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,

  // injectTracking
  track: PropTypes.func.isRequired,
};

NestedAttributeInputs.displayName = 'NestedAttributeInputs';
NestedAttributeInputs.defaultProps = {
  level: 0,
};

export default flowRight(injectIntl, injectTracking)(NestedAttributeInputs);
