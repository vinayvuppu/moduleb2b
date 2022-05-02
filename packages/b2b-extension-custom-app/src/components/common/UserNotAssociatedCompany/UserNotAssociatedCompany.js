import React from 'react';
import { MaintenancePageLayout } from '@commercetools-frontend/application-components';
import UserNotAssociatedSVG from '@commercetools-frontend/assets/images/doors-closed.svg';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { useIntl } from 'react-intl';
import messages from './messages';

const UserNotAssociatedCompany = () => {
  const { formatMessage } = useIntl();
  const {
    user: { email },
  } = useApplicationContext();

  return (
    <MaintenancePageLayout
      imageSrc={UserNotAssociatedSVG}
      title={formatMessage(messages.title)}
      paragraph1={formatMessage(messages.paragraph1, { email })}
    ></MaintenancePageLayout>
  );
};

UserNotAssociatedCompany.displayName = 'UserNotAssociatedCompany';

export default UserNotAssociatedCompany;
