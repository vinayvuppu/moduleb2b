import rolesAvailables from './roles-availables';

export const getRoles = formatMessage => {
  if (!formatMessage || typeof formatMessage !== 'function')
    throw Error('Must provided a valid formatMessage intl');
  return rolesAvailables(formatMessage);
};

export const getRolByValue = (value, formatMessage) => {
  const rol = getRoles(formatMessage).find(role => role.value === value);

  if (!rol) throw Error(`Not exist any rol with value ${value}`);

  return rol;
};
