import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { injectIntl, FormattedMessage } from 'react-intl';
import classnames from 'classnames';
import {
  Constraints,
  Card,
  Spacings,
  SecondaryButton,
  PrimaryButton,
  Text,
} from '@commercetools-frontend/ui-kit';
import { ConfirmationDialog } from '@commercetools-frontend/application-components';
import localize from '@commercetools-local/utils/localize';
import * as globalActions from '@commercetools-frontend/actions-global';
import { DOMAINS } from '@commercetools-frontend/constants';
import ModalContainer from '../modal-container';
import ModalContentLayout from '../modal-content-layout';
import AttributeInput from '../attribute-definitions/attribute-input';
import NestedAttributesContainer from '../nested-attributes-container';
import styles from './nested-attribute-details.mod.css';
import messages from './messages';

export function NestedAttributeDetails(props) {
  const [showWarnOnLeave, setWarnOnLeave] = React.useState(false);

  return (
    <NestedAttributesContainer.Consumer>
      {({
        canUpdateInternalProductDraft,
        cancelInternalProductDraftUpdates,
        updateInternalProductDraft,
        removeClosedModalLevelFromStack,
      }) => (
        <React.Fragment>
          <ModalContainer
            isOpen={props.isModalOpen}
            closeTimeoutMS={150}
            onRequestClose={() => {
              if (canUpdateInternalProductDraft) {
                return setWarnOnLeave(true);
              }
              removeClosedModalLevelFromStack();
              return props.closeModal();
            }}
            className={classnames(
              styles['modal-content'],
              styles[`modal-content-level-${props.level}`]
            )}
            overlayClassName={styles['modal-overlay']}
          >
            <ModalContentLayout
              title={localize({
                obj: props.definition,
                key: 'label',
                language: props.language,
                fallbackOrder: props.languages,
              })}
              controls={
                <Spacings.Inline>
                  <SecondaryButton
                    label={props.intl.formatMessage(messages.cancelButton)}
                    onClick={cancelInternalProductDraftUpdates}
                  />
                  <PrimaryButton
                    label={props.intl.formatMessage(messages.updateButton)}
                    isDisabled={!canUpdateInternalProductDraft}
                    onClick={() => {
                      updateInternalProductDraft();
                      props.showNotification({
                        kind: 'success',
                        domain: DOMAINS.SIDE,
                        text: props.intl.formatMessage(
                          messages.attributeUpdateSucceeded
                        ),
                      });
                    }}
                  />
                </Spacings.Inline>
              }
              onClose={() => {
                if (canUpdateInternalProductDraft) {
                  return setWarnOnLeave(true);
                }
                removeClosedModalLevelFromStack();
                return props.closeModal();
              }}
            >
              <div className={styles.content}>
                {props.typeDetails.attributes.map(definition => {
                  const attribute = {
                    name: `${props.namePrefix}.${definition.name}`,
                  };
                  if (props.attribute.value) {
                    const matchingValue = props.isSetType
                      ? (props.attribute.value[props.index] || []).filter(
                          ({ name }) => name === definition.name
                        )
                      : (props.attribute.value || []).filter(
                          ({ name }) => name === definition.name
                        );

                    if (matchingValue.length > 0)
                      attribute.value = matchingValue[0].value;
                  }

                  return (
                    <Constraints.Horizontal
                      constraint="l"
                      key={`${props.typeDetails.id}-${definition.name}`}
                    >
                      <div className={styles['attribute-item']}>
                        <Card>
                          <AttributeInput
                            level={props.level}
                            pathDefinitions={props.pathDefinitions}
                            disabled={props.isDisabled}
                            attribute={attribute}
                            currencies={props.currencies}
                            definition={definition}
                            languages={props.languages}
                            numberFormat={props.numberFormat}
                            handleChangeNestedAttribute={
                              props.handleChangeNestedAttribute
                            }
                            onChangeValue={nextAttribute => {
                              props.handleChangeNestedAttribute(
                                nextAttribute,
                                props.pathDefinitions
                              );
                            }}
                            selectedLanguage={props.selectedLanguage}
                            expandSettings={props.expandSettings}
                            updateSettings={props.updateSettings}
                            attributes={props.attributes}
                            canEditNestedAttributes={true}
                          />
                        </Card>
                      </div>
                    </Constraints.Horizontal>
                  );
                })}
              </div>
            </ModalContentLayout>
          </ModalContainer>
          <ConfirmationDialog
            title={props.intl.formatMessage(messages.confirmationDialogTitle)}
            isOpen={canUpdateInternalProductDraft && showWarnOnLeave}
            onClose={() => {
              setWarnOnLeave(false);
            }}
            labelPrimary={messages.nestedAttributesConfirmLabel}
            onCancel={() => {
              setWarnOnLeave(false);
            }}
            onConfirm={() => {
              cancelInternalProductDraftUpdates();
              removeClosedModalLevelFromStack();
              setWarnOnLeave(false);
              props.closeModal();
            }}
          >
            <Text.Body>
              <FormattedMessage {...messages.confirmationDialogBody} />
            </Text.Body>
          </ConfirmationDialog>
        </React.Fragment>
      )}
    </NestedAttributesContainer.Consumer>
  );
}
NestedAttributeDetails.displayName = 'NestedAttributeDetails';
NestedAttributeDetails.propTypes = {
  isSetType: PropTypes.bool,
  typeDetails: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    attributes: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        label: PropTypes.objectOf(PropTypes.string),
      })
    ),
  }),
  attribute: PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.any,
  }),
  definition: PropTypes.shape({
    name: PropTypes.string.isRequired,
    label: PropTypes.object.isRequired,
  }),
  pathDefinitions: PropTypes.objectOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      description: PropTypes.string,
    })
  ),
  expandSettings: PropTypes.object,
  isDisabled: PropTypes.bool,
  handleChangeNestedAttribute: PropTypes.func,
  currencies: PropTypes.arrayOf(PropTypes.string).isRequired,
  languages: PropTypes.arrayOf(PropTypes.string).isRequired,
  numberFormat: PropTypes.string,
  selectedLanguage: PropTypes.string,
  language: PropTypes.string,
  isModalOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  namePrefix: PropTypes.string.isRequired,
  index: PropTypes.number,
  updateSettings: PropTypes.func,
  attributes: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.any,
    })
  ),
  level: PropTypes.number.isRequired,
  // injectIntl
  intl: PropTypes.shape({ formatMessage: PropTypes.func.isRequired })
    .isRequired,
  // Connected
  showNotification: PropTypes.func.isRequired,
};
NestedAttributeDetails.defaultProps = {
  isModalOpen: false,
};

const mapDispatchToProps = {
  showNotification: globalActions.showNotification,
};

export default compose(
  injectIntl,
  connect(null, mapDispatchToProps)
)(NestedAttributeDetails);
