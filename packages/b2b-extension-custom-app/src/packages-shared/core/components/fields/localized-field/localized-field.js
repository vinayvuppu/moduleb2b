import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import classnames from 'classnames';
import { Tooltip } from '@commercetools-frontend/ui-kit';
import activeModals from '@commercetools-local/utils/active-modals';
import { getDataAttribute } from '@commercetools-local/utils/dataset';
import { messages } from '@commercetools-local/utils/validation';
import ModalContainer from '../../modal-container';
import ModalContentLayout from '../../modal-content-layout';
import styles from './localized-field.mod.css';

// This component is used to "reset" the default wrapper styles of
// the Tooltip in order to render the underlying input with full width.
// eslint-disable-next-line react/display-name
const WrapperComponent = React.forwardRef((props, ref) => (
  <div {...props} ref={ref} />
));

export default function localizedField(FieldComponent, FieldFooter) {
  class LocalizedField extends React.PureComponent {
    static displayName = 'LocalizedField';

    static propTypes = {
      autoComplete: PropTypes.string,
      name: PropTypes.string.isRequired,
      placeholder: PropTypes.string,
      value: PropTypes.object,
      onChangeValue: PropTypes.func,
      onBlurValue: PropTypes.func,
      onKeyUp: PropTypes.func,
      hasExpand: PropTypes.bool,
      isExpanded: PropTypes.bool,
      onToggle: PropTypes.func,
      selectedLanguage: PropTypes.string.isRequired,
      languages: PropTypes.array.isRequired,
      modalTitle: PropTypes.oneOfType([PropTypes.element, PropTypes.string])
        .isRequired,
      modalSubtitle: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
      modalWarningMessage: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.string,
      ]),
      onModalOpen: PropTypes.func,
      definition: PropTypes.object,
      isSearch: PropTypes.bool,
      // Custom props passed down to the related wrapped components
      localizedFieldProps: PropTypes.object,
      footerProps: PropTypes.object,
      disabled: PropTypes.bool,

      // injectIntl
      intl: PropTypes.shape({
        formatMessage: PropTypes.func.isRequired,
      }).isRequired,
    };

    static defaultProps = {
      placeholder: '',
      value: {},
      definition: {},
      isSearch: false,
      isValid: true,
      disabled: false,
      modalSubtitle: null,
      modalTitle: null,
    };

    state = {
      modalIsOpen: false,
      hasReceivedFocus: false,
      activeModalCount: 0,
    };

    calculateEmptyLocales = () => {
      const filledLocales = this.props.languages.reduce((count, lang) => {
        if (this.props.value && lang in this.props.value)
          // eslint-disable-next-line no-param-reassign
          count += 1;
        return count;
      }, 0);

      return (
        <div>
          <span className={styles['current-locale']}>
            {this.props.selectedLanguage.toUpperCase()}
          </span>
          <span className={styles['available-locales']}>
            {`${filledLocales} / ${this.props.languages.length}`}
          </span>
        </div>
      );
    };

    handleChange = event => {
      const lang = getDataAttribute(event.target, 'data-lang');

      const newValue = {
        ...this.props.value,
        [lang]: event.target.value,
      };
      if (!event.target.value) delete newValue[lang];

      const val = Object.keys(newValue).length ? newValue : undefined;

      if (this.props.onKeyUp) this.props.onKeyUp(val, event);
      if (this.props.onChangeValue) this.props.onChangeValue(val, event);
    };

    handleBlur = value => {
      this.setState({ hasReceivedFocus: true });

      if (this.props.onBlurValue) this.props.onBlurValue(value);
    };

    editAll = () => {
      this.setState(
        {
          modalIsOpen: true,
          activeModalCount: activeModals(),
        },
        () => {
          if (this.props.onModalOpen) this.props.onModalOpen(this.modalContent);
        }
      );
    };

    closeModal = () => {
      if (this.props.onBlurValue) this.props.onBlurValue();

      this.setState({ modalIsOpen: false });
    };

    valuesAreEmpty = () => {
      if (this.props.value === null || this.props.value === undefined)
        return true;

      const localeKeys = Object.keys(this.props.value);
      const localeWithValues = localeKeys.filter(
        lang => !!this.props.value[lang]
      );
      return !localeWithValues.length;
    };

    renderInputGroups = (locales, withModal = false) => {
      const hasLocales = withModal && this.props.languages.length > 1;
      const isRequired = Boolean(
        this.props.definition && this.props.definition.isRequired
      );
      const showEmptyErrorModal =
        isRequired && !withModal && this.valuesAreEmpty();
      const showEmptyErrorNonModal =
        this.state.hasReceivedFocus &&
        isRequired &&
        withModal &&
        this.valuesAreEmpty();
      const showError = lang =>
        Boolean(
          showEmptyErrorNonModal ||
            (showEmptyErrorModal && lang === this.props.selectedLanguage)
        );
      return (
        <div
          className={styles.fields}
          data-track-component={hasLocales ? 'LocalizedField' : 'DetailInput'}
          ref={div => {
            this.modalContent = div;
          }}
        >
          {locales.map(lang => (
            <div
              key={lang}
              className={classnames(
                styles.field,
                { [styles['field-modal']]: !withModal },
                {
                  [styles['field-modal-search']]:
                    !withModal && this.props.isSearch,
                }
              )}
            >
              <div
                className={styles[withModal ? 'container' : 'container-modal']}
              >
                <div
                  className={classnames(styles['left-cell'], {
                    [styles['set-width']]: this.props.isSearch,
                  })}
                >
                  <Tooltip
                    isOpen={showError(lang)}
                    placement="top"
                    title={this.props.intl.formatMessage(messages.required)}
                    styles={{ body: { alignSelf: 'flex-start' } }}
                    components={{ WrapperComponent }}
                  >
                    {/* FIXME:
                    move into a separate component and wrap the change
                    handler, to avoid passing `data-lang` attributes
                  */}
                    <FieldComponent
                      autoComplete={this.props.autoComplete}
                      name={this.props.name}
                      placeholder={this.props.placeholder}
                      value={this.props.value && this.props.value[lang]}
                      onChange={this.handleChange}
                      onBlurValue={this.handleBlur}
                      onKeyUp={this.handleChange}
                      onToggle={this.props.onToggle}
                      autoExpand={!withModal}
                      hasExpand={this.props.hasExpand}
                      isExpanded={this.props.isExpanded}
                      data-testid={`localized-field-${lang}`}
                      data-lang={lang}
                      data-track-event="change"
                      data-track-label={this.props.name}
                      localizedFieldProps={this.props.localizedFieldProps}
                      isValid={!showError(lang)}
                      inputClassName={styles.input}
                      expandableFieldModalClassName={classnames({
                        [styles['expandable-field-modal']]: !withModal,
                      })}
                      textAreaClassName={classnames({
                        [styles['textarea-modal']]: !withModal,
                      })}
                      disabled={this.props.disabled}
                    />
                  </Tooltip>
                </div>
                <div className={styles['right-cell']}>
                  {hasLocales ? (
                    <div>
                      <div
                        className={classnames(styles['all-locales'])}
                        data-track-component="Edit"
                        data-track-event="click"
                        data-track-label={this.props.name}
                        onClick={this.editAll}
                      >
                        <span className={styles.counter}>
                          {this.calculateEmptyLocales()}
                        </span>
                      </div>
                      {this.renderEditModal()}
                    </div>
                  ) : (
                    <div
                      className={classnames(styles.locale, {
                        [styles['locale-modal']]: !withModal,
                      })}
                    >
                      {lang}
                    </div>
                  )}
                </div>
              </div>

              {FieldFooter ? (
                <div>
                  <FieldFooter
                    name={this.props.name}
                    value={this.props.value}
                    lang={lang}
                    footerProps={this.props.footerProps}
                    disabled={this.props.disabled}
                  />
                </div>
              ) : null}
            </div>
          ))}
        </div>
      );
    };

    renderModalWarning = () =>
      this.props.modalWarningMessage ? (
        <div className={styles.warning}>{this.props.modalWarningMessage}</div>
      ) : null;

    renderEditModal = () => {
      const overlayClassName = styles['transition-modal-overlay'];
      const contentClassName = classnames(
        styles['transition-modal-content'],
        this.state.activeModalCount === 0
          ? styles['second-layer']
          : styles['third-layer']
      );

      return (
        <ModalContainer
          isOpen={this.state.modalIsOpen}
          closeTimeoutMS={150}
          onRequestClose={this.closeModal}
          overlayClassName={overlayClassName}
          className={contentClassName}
          contentLabel="localized-field"
        >
          <ModalContentLayout
            title={this.props.modalTitle}
            subtitle={this.props.modalSubtitle}
            onClose={this.closeModal}
            data-track-component={this.props.name}
          >
            {this.renderModalWarning()}
            {this.renderInputGroups(this.props.languages)}
          </ModalContentLayout>
        </ModalContainer>
      );
    };

    render() {
      return this.renderInputGroups([this.props.selectedLanguage], true);
    }
  }

  return injectIntl(LocalizedField);
}
