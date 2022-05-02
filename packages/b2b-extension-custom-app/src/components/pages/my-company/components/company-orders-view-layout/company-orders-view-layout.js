import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Spacings } from '@commercetools-frontend/ui-kit';
import TotalResults from '@commercetools-local/core/components/total-results';
import { useAreMcSettingsDisabled } from '@commercetools-local/hooks';
import CustomViews from '@commercetools-local/core/components/custom-views';
import Container from '@commercetools-local/core/components/container';
import Toolbar from '@commercetools-local/core/components/toolbar';
import CompanyOrdersListCustomViewsConnector from '../company-orders-list-custom-views-connector';
import LinkToOrderCreate from '../link-to-order-create';
import messages from './messages';

export const CompanyOrdersViewLayout = props => {
  const areMcSettingsDisabled = useAreMcSettingsDisabled();

  return (
    <div data-track-component="Orders List">
      <Toolbar
        title={
          <div>
            {props.companyName ? (
              <FormattedMessage
                {...messages.titleCompany}
                values={{
                  company: props.companyName,
                  state: props.state?.toLowerCase(),
                }}
              />
            ) : (
              <FormattedMessage {...messages.title} />
            )}
            <TotalResults total={props.total} />
          </div>
        }
        controls={
          <Spacings.Inline>
            {!areMcSettingsDisabled && (
              <CompanyOrdersListCustomViewsConnector.Consumer>
                {({
                  viewsFetcher,
                  activeViewFetcher,
                  activeView,
                  selectView,
                  resetActiveView,
                  saveView,
                  createView,
                  deleteView,
                  hasUnsavedChanges,
                }) => (
                  <CustomViews
                    projectKey={props.projectKey}
                    hasUnsavedChanges={hasUnsavedChanges}
                    view={activeView}
                    views={viewsFetcher.isLoading ? null : viewsFetcher.views}
                    idOfActiveView={
                      activeViewFetcher.isLoading
                        ? null
                        : activeViewFetcher.view && activeViewFetcher.view.id
                    }
                    isDirty={hasUnsavedChanges}
                    onSelect={selectView}
                    onReset={resetActiveView}
                    onSave={saveView}
                    onCreate={createView}
                    onDelete={deleteView}
                  />
                )}
              </CompanyOrdersListCustomViewsConnector.Consumer>
            )}
            <LinkToOrderCreate projectKey={props.projectKey} />
          </Spacings.Inline>
        }
      />
      <Container>{props.children}</Container>
    </div>
  );
};
CompanyOrdersViewLayout.displayName = 'CompanyOrdersViewLayout';
CompanyOrdersViewLayout.propTypes = {
  projectKey: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  companyName: PropTypes.string,
  state: PropTypes.string,
  total: PropTypes.number.isRequired,
};

export default CompanyOrdersViewLayout;
