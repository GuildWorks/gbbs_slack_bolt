const { ExpressReceiver } = require("@slack/bolt");
const { SIGNING_SECRET } = require("./constrants");

const expressReceiver = new ExpressReceiver({
  signingSecret: SIGNING_SECRET
});

exports.expressReceiver = expressReceiver;
