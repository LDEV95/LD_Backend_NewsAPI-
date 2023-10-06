const { getUsers } = require("../model/10-get-api-users.models");

exports.sendUsers = (req, res) => {
  getUsers().then((users) => {
    res.status(200).send({ users });
  });
};
