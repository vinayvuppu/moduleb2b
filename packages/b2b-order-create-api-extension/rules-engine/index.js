const { Engine, Rule } = require('json-rules-engine');

const options = {
  allowUndefinedFacts: true
};
const engine = new Engine([], options);

const executeRuleEngine = async ({ conditions, order, employee }) => {
  try {
    console.log('Conditions to evaluate', conditions);

    const rulesCompany = conditions.map(ruleCompany => {
      const rule = new Rule(`{"conditions":${ruleCompany}}`);
      rule.setEvent({
        type: 'needsApproval',
        params: {
          result: true
        }
      });
      return rule;
    });

    rulesCompany.forEach(ruleCompany => {
      engine.addRule(ruleCompany);
    });

    const { totalPrice, createdAt, shippingInfo, customerEmail } = order;
    const { roles, email } = employee;

    const fact = {
      totalPrice,
      createdAt,
      shippingInfo,
      roles,
      customerEmail,
      email
    };

    const results = await engine.run(fact);
    const needsApproval = results.events.find(event => event.params.result);

    rulesCompany.forEach(ruleCompany => {
      engine.removeRule(ruleCompany);
    });
    return !!needsApproval;
  } catch (error) {
    console.error('error');
    console.error(error);
  }
};

module.exports = {
  executeRuleEngine
};
