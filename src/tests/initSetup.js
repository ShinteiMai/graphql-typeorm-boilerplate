require("ts-node");

const { setup } = require("./setup");

module.exports = async function () {
  if (!process.env.TEST_HOST) {
    await setup();
  }
  return null;
};
