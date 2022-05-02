import PropTypes from 'prop-types';
import React from 'react';
import { defaultMemoize } from 'reselect';
import { injectIntl } from 'react-intl';
import { SelectInput, Spacings, Text } from '@commercetools-frontend/ui-kit';
import styles from './per-page-switcher.mod.css';
import messages from './messages';

const mapPropsToOptions = defaultMemoize(optionsProp =>
  optionsProp.map(option => ({
    value: option.toString(),
    label: option,
  }))
);

export class PerPageSwitcher extends React.PureComponent {
  static displayName = 'PerPageSwitcher';

  static propTypes = {
    options: PropTypes.array.isRequired,
    perPage: PropTypes.number.isRequired,
    itemsOnPage: PropTypes.number.isRequired,
    onPerPageChange: PropTypes.func.isRequired,
    intl: PropTypes.shape({
      formatMessage: PropTypes.func.isRequired,
      formatNumber: PropTypes.func.isRequired,
    }).isRequired,
  };

  handleSelectPerPage = event => {
    this.props.onPerPageChange(parseInt(event.target.value, 10));
  };

  render() {
    return (
      <Spacings.Inline alignItems="center">
        <div className={styles['select-container']}>
          <SelectInput
            value={this.props.perPage && this.props.perPage.toString()}
            name="per-page-switcher"
            onChange={this.handleSelectPerPage}
            options={mapPropsToOptions(this.props.options)}
            isClearable={false}
            backspaceRemovesValue={false}
            isSearchable={false}
            data-track-component="PerPageSwitcher"
            data-track-event="change"
            data-track-label={this.props.perPage}
          />
        </div>
        <Text.Body
          intlMessage={{
            ...messages.itemsPerPage,
            values: {
              count: this.props.intl.formatNumber(this.props.itemsOnPage),
            },
          }}
        />
      </Spacings.Inline>
    );
  }
}

export default injectIntl(PerPageSwitcher);
