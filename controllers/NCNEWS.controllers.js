const { getTopics } = require("../model/getTopics.models");

exports.sendTopics = (req, res) => {
  getTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};
