// eslint-disable-next-line import/extensions
import { graphql } from 'graphql';
import { createGraphqlTargets, createRosie } from './targets';

const makeLogger = opts => {
  // eslint-disable-next-line no-console
  if (opts.debug) return console.log;
  return () => {};
};

export const createGraphqlMock = (
  xhrMock,
  { fixtures, resolvers, opts = {} } = {}
) => {
  const log = makeLogger(opts);
  const targets = createGraphqlTargets(fixtures, resolvers);

  xhrMock.post('http://localhost:8080/graphql', async (req, res) => {
    const { query, variables } = JSON.parse(req.body());
    const target = variables.target || 'ctp';
    const response = await graphql(
      targets[target],
      query,
      null,
      null,
      variables
    );
    log('REQUEST:', query, variables);
    log('RESPONSE:', JSON.stringify(response, null, ' '));
    return res.status(200).body(JSON.stringify(response));
  });
};

export { createRosie };
