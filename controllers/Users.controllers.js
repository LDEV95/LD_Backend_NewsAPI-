const { getUsers } = require("../model/Users.models");

exports.sendUsers = (req, res) => {
  getUsers().then((users) => {
    res.status(200).send({ users });
  });
};
