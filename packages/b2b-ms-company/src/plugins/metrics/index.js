const fastifyPlugin = require('fastify-plugin');
const metricsPlugin = require('fastify-metrics');

module.exports = fastifyPlugin((fastify, opts, next) => {
  const metricsConfig = {
    endpoint: '/metrics',
    //interval: 5000, //Default metrics collection interval in ms.
    //register: undefined, // Custom prom-client metrics registry
    //prefix: "", // Custom default metrics prefix.
    //groupStatusCodes: true, // Groups status codes (e.g. 2XX) if true
    blacklist: ['/live', '/ready'], //Exclude healthchecks from metrics
    metrics: {
      histogram: {
        name: 'http_request_duration_ms',
        help: 'request duration in ms',
        labelNames: ['status_code', 'method', 'route'],
        buckets: [0.05, 0.1, 0.5, 1, 3, 5, 10]
      },
      summary: {
        name: 'http_request_summary_ms',
        help: 'request duration in ms summary',
        labelNames: ['status_code', 'method', 'route'],
        percentiles: [0.5, 0.9, 0.95, 0.99]
      }
    }
  };

  fastify.register(metricsPlugin, metricsConfig);

  next();
});
