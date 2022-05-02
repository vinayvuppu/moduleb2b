import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import { injectIntl } from 'react-intl';
import { compose } from 'recompose';
import {
  AngleThinLeftIcon,
  AngleThinRightIcon,
  NumberInput,
  SecondaryIconButton,
  Spacings,
  Text,
} from '@commercetools-frontend/ui-kit';
import validate from './validations';
import styles from './range-paginator.mod.css';
import messages from './messages';

const parsePage = page => Number.parseInt(page, 10);
const defaultIfNonParseable = page => (Number.isNaN(page) ? 1 : page);

export class RangePaginator extends React.PureComponent {
  static displayName = 'RangePaginator';

  static propTypes = {
    totalItems: PropTypes.number.isRequired,
    perPage: PropTypes.number.isRequired,
    page: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,

    // Intl
    intl: PropTypes.shape({
      formatMessage: PropTypes.func.isRequired,
      formatNumber: PropTypes.func.isRequired,
    }).isRequired,

    // Formik
    values: PropTypes.shape({
      totalItems: PropTypes.number.isRequired,
      totalPages: PropTypes.number.isRequired,
      perPage: PropTypes.number.isRequired,

      // This is the only changing form value
      // the rest are passing into `values`
      // for validation.
      page: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
    }),
    errors: PropTypes.shape({
      invalidPage: PropTypes.bool,
    }),
    setFieldValue: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    resetForm: PropTypes.func.isRequired,
  };

  goToPrevPage = event => {
    event.preventDefault();

    // NOTE: The user can enter negative values. Taking
    // the absolute making subsequent handling easier.
    // So that the user is not able to:
    // 1. When user is on page 2
    // 1. Enters a page number (e.g. 50)
    // 2. Hit next page
    // and end up on page 51 but on page 3
    // we use `props.page`.
    const intendedNextPage = Math.abs(
      compose(defaultIfNonParseable, parsePage)(this.props.page)
    );
    let possibleNextPage;

    /**
     * NOTE:
     *    When the user manually enters a page exceeding the
     *    range of possible pages the form is invalid.
     *    Whenever he know clicks back he will automatically
     *    we shown the last possible page.
     */
    if (intendedNextPage > this.props.values.totalPages) {
      possibleNextPage = this.props.values.totalPages;
    } else if (intendedNextPage === 1) {
      possibleNextPage = 1;
    } else {
      possibleNextPage = intendedNextPage - 1;
    }

    this.goToPage(possibleNextPage);
  };

  goToNextPage = event => {
    event.preventDefault();

    // NOTE: The user can enter negative values. Taking
    // the absolute making subsequent handling easier.
    const intendedNextPage = Math.abs(
      compose(defaultIfNonParseable, parsePage)(this.props.page)
    );
    let possibleNextPage;

    /**
     * NOTE:
     *    Whenever the user enters a page exceeding the
     *    available page number we show the last possible
     *    page.
     */
    if (intendedNextPage >= this.props.values.totalPages) {
      possibleNextPage = this.props.values.totalPages;
    } else {
      possibleNextPage = intendedNextPage + 1;
    }

    this.goToPage(possibleNextPage);
  };

  goToPage = nextPage => {
    this.props.setFieldValue('page', nextPage);
    this.props.onPageChange(nextPage);
  };

  handleKeyDown = event => {
    /**
     * NOTE:
     *   We do not change pages when clicking out of the
     *   input and blurring that way. Only tabbing
     *   away will trigger a page change.
     */
    if (event.keyCode === 13 || event.keyCode === 9) {
      this.props.handleSubmit(event);
    }
  };

  handleBlur = () => {
    this.props.resetForm();
  };

  render() {
    if (this.props.values.totalItems === 0) return null;
    const isPreviousDisabled = this.props.values.page === 1;
    const isNextDisabled =
      this.props.values.page === this.props.values.totalPages;

    return (
      <form
        className={styles.container}
        onSubmit={this.props.handleSubmit}
        onKeyDown={this.handleKeyDown}
      >
        <Spacings.Inline alignItems="center" scale="s">
          <SecondaryIconButton
            label={this.props.intl.formatMessage(messages.previousPage)}
            onClick={this.goToPrevPage}
            isDisabled={isPreviousDisabled}
            icon={<AngleThinLeftIcon />}
          />
          <Text.Body intlMessage={messages.labelPage} />
          <div className={styles.field}>
            <NumberInput
              name="page"
              max={this.props.values.totalPages}
              min={1}
              hasWarning={this.props.errors.invalidPage}
              onChange={this.props.handleChange}
              onBlur={this.handleBlur}
              value={String(this.props.values.page)}
            />
          </div>
          <Text.Body
            intlMessage={{
              ...messages.labelOfCount,
              values: {
                count: this.props.intl.formatNumber(
                  this.props.values.totalPages
                ),
              },
            }}
          />
          <SecondaryIconButton
            label={this.props.intl.formatMessage(messages.nextPage)}
            onClick={this.goToNextPage}
            isDisabled={isNextDisabled}
            icon={<AngleThinRightIcon />}
          />
        </Spacings.Inline>
      </form>
    );
  }
}

export const getTotalPages = (totalItems, perPage) =>
  Math.ceil(totalItems / perPage);

export const handleSubmit = (values, { props }) => {
  props.onPageChange(values.page);
};

const mapPropsToValues = ownProps => {
  /**
   * NOTE:
   *    We have `prop-type` validation on the `page` to be a number.
   *    However, whenever this is url driven and the user tweaks the url we can enter
   *    anything as a `page` prop. We should be able to handle that
   *    meaningfully by defauling to the first possible page.
   */
  const potentiallyANumberedPage = parsePage(ownProps.page);

  return {
    totalItems: ownProps.totalItems,
    totalPages: getTotalPages(ownProps.totalItems, ownProps.perPage),
    perPage: ownProps.perPage,
    page: defaultIfNonParseable(potentiallyANumberedPage),
  };
};

export default compose(
  injectIntl,
  withFormik({
    mapPropsToValues,
    enableReinitialize: true,
    handleSubmit,
    validate,
  })
)(RangePaginator);
