import PropTypes from 'prop-types';
import React, { useState } from 'react';

import { useIsAuthorized } from '@commercetools-frontend/permissions';
import ReadOnlyMessage from '@commercetools-local/core/components/read-only-message';
import PageBottomSpacer from '@commercetools-local/core/components/page-bottom-spacer';
import TabContentLayout from '@commercetools-local/core/components/tab-content-layout';
import MetaDates from '@commercetools-local/core/components/meta-dates';
import { Spacings } from '@commercetools-frontend/ui-kit';
import { PERMISSIONS } from '../../../../../constants';
import QuoteSummaryPanel from '../quote-summary-panel';
import QuoteEmployeePanel from '../quote-employee-panel';
import QuoteItemsPanel from '../quote-items-panel';

export const TAB_NAMES = {
  GENERAL: 'general',
};

const NoMessage = () => <div />;
NoMessage.displayName = 'NoMessage';

const DEMANDED_PERMISSIONS = [
  PERMISSIONS.ManageCompanies,
  PERMISSIONS.ManageOrders,
];

export const QuoteDetailsGeneralTab = props => {
  const [tempTotalPrice, setTempTotalPrice] = useState();

  const isAuthorized = useIsAuthorized({
    demandedPermissions: DEMANDED_PERMISSIONS,
  });

  const handleUpdateTotal = total => {
    setTempTotalPrice(total);
  };

  return (
    <TabContentLayout
      header={
        <MetaDates
          created={props.quote.createdAt}
          modified={props.quote.lastModifiedAt}
        />
      }
      description={!isAuthorized ? <ReadOnlyMessage /> : <NoMessage />}
    >
      <Spacings.Stack scale="m">
        <QuoteSummaryPanel quote={props.quote} totalPrice={tempTotalPrice} />
        <QuoteEmployeePanel
          quote={props.quote}
          projectKey={props.projectKey}
          isAuthorized={isAuthorized}
        />
        <QuoteItemsPanel
          quote={props.quote}
          updateQuoteItems={props.updateQuoteItems}
          addAmountDiscount={props.addAmountDiscount}
          addPercentageDiscount={props.addPercentageDiscount}
          onUpdateOriginalTotalPrice={handleUpdateTotal}
          isAuthorized={isAuthorized}
        />
      </Spacings.Stack>
      <PageBottomSpacer />
    </TabContentLayout>
  );
};

QuoteDetailsGeneralTab.displayName = 'QuoteDetailsGeneralTab';
QuoteDetailsGeneralTab.propTypes = {
  quote: PropTypes.object,
  projectKey: PropTypes.string.isRequired,
  updateQuoteItems: PropTypes.func.isRequired,
  addAmountDiscount: PropTypes.func.isRequired,
  addPercentageDiscount: PropTypes.func.isRequired,
  hasCompany: PropTypes.bool.isRequired,
};

export default QuoteDetailsGeneralTab;
