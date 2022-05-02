module.exports = {
  config: () => ({ topic: { addMonthlySpent: 'addMonthlySpent' } }),
  pubsub: {
    topic: () => ({ onPublish: fn => fn })
  }
};
