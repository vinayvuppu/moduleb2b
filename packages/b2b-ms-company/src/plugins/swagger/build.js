const fastify = require('../../server')();
const fs = require('fs');
const dir = './docs';
const start = async () => {
  try {
    await fastify.ready();
    !fs.existsSync(dir) && fs.mkdirSync(dir);
    fs.writeFileSync(`${dir}/swagger.yml`, fastify.oas({ yaml: true }));
    fastify.log.info(`Documentation saved to ${dir}/swagger.yml`);
    process.exit();
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
