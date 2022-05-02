import React from 'react';
import { useTracking as useTrackingContext } from '@commercetools-local/hooks';
import { trackingEvents } from '../../../../constants/tracking';

export const forwardHandler = (track, handler) => (...handlerArgs) => {
  track();
  handler(...handlerArgs);
};
const defaultProcessTrackingEvent = trackingEvent => trackingEvent;
const useTrackingHandler = (
  trackingEvent,
  processTrackingEvent = defaultProcessTrackingEvent
) => {
  const { track } = useTrackingContext();

  return React.useCallback(
    (...args) => {
      const { action, category, label } = processTrackingEvent(
        trackingEvent,
        ...args
      );

      track(action, category, label);
    },
    [track, trackingEvent, processTrackingEvent]
  );
};

const useTracking = () => {
  const trackAddDelivery = useTrackingHandler(trackingEvents.addDelivery);
  const trackChangeOrderWorkflowStatus = useTrackingHandler(
    trackingEvents.changeOrderWorkflowStatus
  );
  const trackChangeOrderStatus = useTrackingHandler(
    trackingEvents.changeOrderStatus
  );
  const trackChangeOrderPaymentStatus = useTrackingHandler(
    trackingEvents.changeOrderPaymentStatus
  );
  const trackChangeOrderShipmentStatus = useTrackingHandler(
    trackingEvents.changeOrderShipmentStatus
  );
  const trackGoToOrderDetails = useTrackingHandler(
    trackingEvents.goToOrderDetails
  );
  const trackSelectCustomTypeDefinition = useTrackingHandler(
    trackingEvents.selectCustomTypeDefinition
  );
  const trackSelectLineItemState = useTrackingHandler(
    trackingEvents.selectLineItemState
  );
  const trackSplitLineItem = useTrackingHandler(trackingEvents.splitLineItem);
  const trackSaveReturn = useTrackingHandler(trackingEvents.saveReturn);
  const trackAddParcel = useTrackingHandler(trackingEvents.addParcel);
  const trackSelectCurrency = useTrackingHandler(trackingEvents.selectCurrency);
  const trackAddCustomLineItem = useTrackingHandler(
    trackingEvents.addCustomLineItem
  );
  const trackAddLineItem = useTrackingHandler(trackingEvents.addLineItem);
  const trackSelectProductDistributionChannel = useTrackingHandler(
    trackingEvents.selectProductDistributionChannel
  );
  const trackSetCountrySpecificPricing = useTrackingHandler(
    trackingEvents.setCountrySpecificPricing
  );
  const trackApplyDiscountCode = useTrackingHandler(
    trackingEvents.applyDiscountCode
  );
  const trackDeleteLineItem = useTrackingHandler(trackingEvents.deleteLineItem);
  const trackPlaceOrder = useTrackingHandler(trackingEvents.placeOrder);

  return {
    trackAddDelivery,
    trackChangeOrderWorkflowStatus,
    trackChangeOrderStatus,
    trackChangeOrderPaymentStatus,
    trackChangeOrderShipmentStatus,
    trackGoToOrderDetails,
    trackSelectCustomTypeDefinition,
    trackSelectLineItemState,
    trackSplitLineItem,
    trackSaveReturn,
    trackAddParcel,
    trackSelectCurrency,
    trackAddCustomLineItem,
    trackAddLineItem,
    trackSelectProductDistributionChannel,
    trackSetCountrySpecificPricing,
    trackApplyDiscountCode,
    trackDeleteLineItem,
    trackPlaceOrder,
    forwardHandler,
  };
};

export default useTracking;
