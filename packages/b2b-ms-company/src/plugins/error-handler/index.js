const fastifyPlugin = require('fastify-plugin');
const statusCodes = require('http').STATUS_CODES;
const { ctErrorMapping } = require('../../errors');

const VALIDATION_ERROR = '001';

module.exports = fastifyPlugin((fastify, opts, next) => {
  fastify.setNotFoundHandler(async (request, reply) => {
    reply.code(404).send({
      errors: [
        {
          status: '404',
          title: 'Not Found'
        }
      ]
    });
  });

  fastify.setErrorHandler(async (error, request, reply) => {
    request.log.error(error);

    const statusCode =
      Array.isArray(error) && error.length
        ? error[0].status
        : error.status ||
          error.statusCode ||
          (error.errors && error.errors.length && error.errors[0].status) ||
          reply.statusCode ||
          reply.res.statusCode ||
          '500';

    if (error.validation) {
      reply.code(400).send({
        errors: [
          {
            code: VALIDATION_ERROR,
            title: 'Validation error',
            detail: error.message,
            status: '400'
          }
        ]
      });
    }

    let errors;

    //CT ERRORS
    if (error.body && error.body.errors) {
      errors = error.body.errors.map(
        ({ message, code, detailedErrorMessage }) => ({
          code: ctErrorMapping[code] || statusCode.toString(),
          status: statusCode.toString(),
          title: message,
          detail: detailedErrorMessage
        })
      );
    } else {
      if (Array.isArray(error)) {
        errors = error.map(err => ({
          id: err.id,
          code: err.code || statusCodes[statusCode + ''],
          status: err.status.toString(),
          title: err.title,
          detail: err.detail,
          meta: err.meta
        }));
      } else {
        // API ERRORS
        if (error.errors) {
          errors = error.errors;
        } else {
          errors = [
            {
              id: error.id,
              code: error.code || statusCodes[statusCode + ''],
              status: statusCode.toString(),
              title: error.title,
              detail: error.detail,
              meta: error.meta
            }
          ];
        }
      }
    }
    reply.code(statusCode).send({ errors });
  });
  next();
});
