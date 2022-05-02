/* eslint-disable no-console */
const { Engine, Rule } = require('json-rules-engine');

const options = {
  allowUndefinedFacts: true,
};
const engine = new Engine([], options);

const executeRuleEngine = async ({ conditions, cart, employee }) => {
  try {
    const rulesCompany = conditions
      .filter(condition => condition.parsedValue)
      .map(ruleCompany => {
        const rule = new Rule(`{"conditions":${ruleCompany.parsedValue}}`);
        rule.setEvent({
          type: 'needsApproval',
          params: {
            name: ruleCompany.name,
            result: true,
          },
        });
        return rule;
      });
    rulesCompany.forEach(ruleCompany => {
      engine.addRule(ruleCompany);
    });
    const { totalPrice, shippingInfo, customerEmail } = cart;
    const createdAt = new Date().toISOString();
    const { roles, email } = employee;

    const fact = {
      totalPrice,
      createdAt,
      shippingInfo: shippingInfo || { price: {} },
      roles,
      customerEmail,
      email,
    };

    const results = await engine.run(fact);
    const needsApproval = results.events.filter(event => event.params.result);
    rulesCompany.forEach(ruleCompany => {
      engine.removeRule(ruleCompany);
    });
    return {
      needsApproval: needsApproval.length > 0,
      ruleName:
        needsApproval.length > 0
          ? needsApproval.map(rule => rule.params.name).toString()
          : undefined,
    };
  } catch (error) {
    return { needsApproval: false };
  }
};

export default executeRuleEngine;
