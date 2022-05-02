import isNil from 'lodash.isnil';
import { NO_VALUE_FALLBACK } from '@commercetools-frontend/constants';
import { reportErrorToSentry } from '@commercetools-frontend/sentry';
import localize from '../../localize';
import { formatMoney as formatMoneyValue } from '../money';
import messages from './messages';

const formatEnum = ({ value, fallbackValue }) =>
  value.label || `${fallbackValue} (${value.key})`;

const formatLenum = ({ value, language, languages, fallbackValue }) =>
  localize({
    obj: value,
    key: 'label',
    language,
    fallback: `${fallbackValue} (${value.key})`,
    fallbackOrder: languages,
  });

const formatLtext = ({ value, language }) =>
  localize({ obj: { value }, key: 'value', language });

const formatMoney = ({ value, intl }) => formatMoneyValue(value, intl);

const formatReference = ({ value }) => value.id;

const formatDate = ({ value, intl }) =>
  intl.formatDate(Date.parse(value), {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

const formatDateTime = ({ value, intl }) => {
  const date = formatDate({ value, intl });
  const time = intl.formatTime(Date.parse(value), {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  });
  return `${date} (${time})`;
};

const formatBoolean = ({ value, intl }) =>
  value
    ? intl.formatMessage(messages.booleanYes)
    : intl.formatMessage(messages.booleanNo);

const formatNilType = ({ value, fallbackValue }) => {
  reportErrorToSentry(new Error('Type was not provided'), {
    extra: { value },
  });

  return fallbackValue;
};

const formatUnknown = ({ type, value, fallbackValue }) => {
  // NOTE This is reporting within the render function, which is supposed to
  // be pure. This is quite bad as this is a side-effect in the render fn.
  reportErrorToSentry(
    new Error(`Unhandled custom attribute type '${type.name}' for value`),
    { extra: { value } }
  );

  return fallbackValue;
};

const formatNested = ({ fallbackValue }) => fallbackValue;

const formatSet = ({
  type,
  value,
  intl,
  language,
  languages,
  fallbackValue,
}) => {
  const formatedElements = value.map(elementValue =>
    formatAttribute({
      type: type.elementType,
      value: elementValue,
      intl,
      language,
      languages,
      fallbackValue,
    })
  );
  return formatedElements.join(', ');
};

const doNotFormat = ({ value }) => value;

const getFormatter = type => do {
  if (isNil(type)) formatNilType;
  else if (type.name === 'nested') formatNested;
  else if (type.name === 'set') formatSet;
  else if (type.name === 'enum') formatEnum;
  else if (type.name === 'lenum') formatLenum;
  else if (type.name === 'ltext') formatLtext;
  else if (type.name === 'money') formatMoney;
  else if (type.name === 'reference') formatReference;
  else if (type.name === 'date') formatDate;
  else if (type.name === 'time') doNotFormat;
  else if (type.name === 'datetime') formatDateTime;
  else if (type.name === 'boolean') formatBoolean;
  else if (type.name === 'text') doNotFormat;
  else if (type.name === 'number') doNotFormat;
  else formatUnknown;
};

export default function formatAttribute({
  type,
  value,
  intl,
  language,
  languages,
  fallbackValue = NO_VALUE_FALLBACK,
}) {
  if (isNil(value)) {
    return fallbackValue;
  }

  const formatter = getFormatter(type);

  return formatter({ type, value, intl, language, languages, fallbackValue });
}
