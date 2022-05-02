class ApiError extends Error {
  constructor({ id, status, code, title, detail, meta }) {
    super(title);
    this.id = id;
    this.code = code;
    this.status = status;
    this.title = title;
    this.detail = detail;
    this.meta = meta;
  }
}

const VALIDATION_ERROR = '001';

const ctErrorMapping = {
  InvalidJsonInput: VALIDATION_ERROR
};

module.exports = {
  ApiError,
  ctErrorMapping
};
