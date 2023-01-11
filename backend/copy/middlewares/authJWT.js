const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.user;

verifyToken = (req, res, next) => {
  try {
    let token = req.headers["x-access-token"];
    if (!token) {
      return res.status(403).send({
        message: "No token provided!",
      });
    }
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).send({
          message: "Unauthorized!",
        });
      }
      req.userId = decoded.userId;
      next();
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
isAdmin = async (req, res, next) => {
  try {
    let user = await User.findByPk(req.userId);
    user.getRoles().then((roles) => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "admin") {
          next();
          return;
        }
      }
      res.status(403).send({
        message: "Require Admin Role!",
      });
      return;
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
};
module.exports = authJwt;
