import { NO_VALUE_FALLBACK } from '@commercetools-frontend/constants';

export default function formatCustomerName({ firstName, lastName }) {
  if (firstName && !lastName) return firstName.trim();
  if (!firstName && lastName) return lastName.trim();
  if (firstName && lastName) return `${firstName.trim()} ${lastName.trim()}`;

  return NO_VALUE_FALLBACK;
}
