const validate = values => {
  const errors = {};

  if (values.page > values.totalPages) errors.invalidPage = true;
  if (values.page <= 0) errors.invalidPage = true;

  return errors;
};

export default validate;
