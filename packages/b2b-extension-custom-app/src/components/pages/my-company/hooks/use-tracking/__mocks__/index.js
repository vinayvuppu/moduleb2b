import { forwardHandler } from '../use-tracking';

const trackAddOrder = jest.fn();
const trackSelectCurrency = jest.fn();
const trackAddLineItem = jest.fn();
const trackSelectProductDistributionChannel = jest.fn();
const trackSetCountrySpecificPricing = jest.fn();
const trackApplyDiscountCode = jest.fn();
const trackDeleteLineItem = jest.fn();
const trackPlaceOrder = jest.fn();

const useTracking = () => ({
  trackAddOrder,
  trackSelectCurrency,
  trackAddLineItem,
  trackSelectProductDistributionChannel,
  trackSetCountrySpecificPricing,
  trackApplyDiscountCode,
  trackDeleteLineItem,
  trackPlaceOrder,
  forwardHandler,
});

export default useTracking;
