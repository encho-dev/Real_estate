//const { verifySignUp, authJwt } = require("../../middlewares");
const controller = require("../controllers/auth.controllers");
module.exports = function (app) {
  app.post("/api/auth/signup", controller.signup);
  app.post("/api/auth/signin", controller.signin);
};
