const { authJwt } = require("../middlewares");
const controller = require("../controllers/property.controllers");
module.exports = function (app) {
  app.post(
    "/api/property/create",
    [authJwt.verifyToken],
    controller.createProperty
  );
  app.get("/api/properties", controller.getAllProperties);
  app.get("/api/properties/:propertyId", controller.getProperty);
  app.patch(
    "/api/properties/:propertyId",
    [authJwt.verifyToken],
    controller.updateProperty
  );
  app.delete(
    "/api/properties/:propertyId",
    [authJwt.verifyToken],
    controller.deleteProperty
  );

  app.get(
    "/api/user/properties",
    [authJwt.verifyToken],
    controller.getUserProperties
  );
};
