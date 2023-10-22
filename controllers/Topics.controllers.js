const { getTopics } = require("../model/Topics.models");

exports.sendTopics = (req, res) => {
  getTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};
