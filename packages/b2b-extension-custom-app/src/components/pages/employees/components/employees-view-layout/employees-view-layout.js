import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  PlusBoldIcon,
  SecondaryButton,
  Spacings,
} from '@commercetools-frontend/ui-kit';
import { useIsAuthorized } from '@commercetools-frontend/permissions';
import { useAreMcSettingsDisabled } from '@commercetools-local/hooks';
import CustomViews from '@commercetools-local/core/components/custom-views';
import TotalResults from '@commercetools-local/core/components/total-results';
import Container from '@commercetools-local/core/components/container';
import Toolbar from '@commercetools-local/core/components/toolbar';
import { PERMISSIONS, DATA_FENCES } from '../../../../../constants';
import EmployeesListCustomViewsConnector from '../employees-list-custom-views-connector';
import messages from './messages';

export const EmployeesViewLayout = props => {
  const areMcSettingsDisabled = useAreMcSettingsDisabled();
  const isAuthorized = useIsAuthorized({
    demandedPermissions: [PERMISSIONS.ManageEmployees],
    demandedDataFences: [DATA_FENCES.store.ManageEmployees],
    selectDataFenceData: ({ actualDataFenceValues }) =>
      actualDataFenceValues || [],
  });
  const addEmployeeUrl = `/${props.projectKey}/b2b-extension${
    props.company ? `/companies/${props.company.id}` : ''
  }/employees/new`;
  const intl = useIntl();

  return (
    <div data-track-component="EmployeesList">
      <Toolbar
        title={
          <div>
            {props.company?.name ? (
              <FormattedMessage
                {...messages.titleCompany}
                values={{ company: props.company.name }}
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
              <EmployeesListCustomViewsConnector.Consumer>
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
              </EmployeesListCustomViewsConnector.Consumer>
            )}
            <SecondaryButton
              iconLeft={<PlusBoldIcon />}
              data-track-component="AddEmployeeButton"
              data-track-event="click"
              label={intl.formatMessage(messages.addEmployee)}
              linkTo={addEmployeeUrl}
              isDisabled={!isAuthorized}
            />
          </Spacings.Inline>
        }
      />
      <Container>{props.children}</Container>
    </div>
  );
};
EmployeesViewLayout.displayName = 'EmployeesViewLayout';
EmployeesViewLayout.propTypes = {
  projectKey: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  company: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }),
  total: PropTypes.number.isRequired,
};

export default EmployeesViewLayout;
