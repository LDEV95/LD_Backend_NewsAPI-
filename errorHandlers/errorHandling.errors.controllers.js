exports.Errors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else if (err.status === 404) {
    res.status(404).send({ msg: "Not Found" });
  } else {
    res.status(500).send({ msg: "Internal Server Error" });
  }
};

exports.PSQLErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    return res.status(400).send({ msg: "Bad Request" });
  }
};
