const db = require("../models");
const Property = db.property;
const { uuid } = require("uuidv4");
const User = db.user;
const Sequelize = require("sequelize");
const Op = db.Op;

exports.createProperty = async (req, res) => {
  try {
    let user = await User.findOne({
      where: {
        userId: req.userId,
      },
    });

    let property = await Property.create({
      propertyId: uuid(),
      name: req.body.name,
      userId: user.userId,
      images: req.body.images,
      region: req.body.region,
      town: req.body.town,
      street: req.body.street,
      longitude: req.body.longitude,
      latitude: req.body.latitude,
      for: req.body.for,
      description: req.body.description,
      owner: user.firstName + user.lastName,
      phoneNumber: req.body.phoneNumber,
      price: req.body.price,
      available: req.body.available,
    });

    res.status(200).send({
      property: property,
      message: "Property created successfully!",
    });
  } catch (error) {
    res.status(500).send({
      message: "Error occurred, property not created",
    });
  }
};

exports.getAllProperties = async (req, res) => {
  //const { region, town, rent, sale, maxPrice } = req.query;
  try {
    var where = [];
    // iterate over the params
    for (let q in req.query) {
      var obj = {};
      if (req.query[q]) {
        obj[q] = { [Op.eq]: req.query[q] };
        if (req.query.price)
          obj["price"] = { [Op.lte]: req.query.price };
        // if q is discoveryMethod then the obj is { discoveryMethod: { [Op.eq]: req.query.discoveryMethod } }
        where.push(obj);
      }
    }

    let properties = await Property.findAll({
      where:
        where.length == 0
          ? {}
          : {
              [Op.or]: where, // assign the "where" array here
            },
      attributes: {
        exclude: ["userId", "id"],
      },
    });
    res.status(200).send({
      properties: properties,
    });
  } catch (error) {
    res.status(500).send({
      message: `Error occurred, property not created ${error}`,
    });
  }
};

exports.getProperty = async (req, res) => {
  try {
    let property = await Property.findOne({
      where: { propertyId: req.params.propertyId },
      attributes: {
        exclude: ["userId", "id"],
      },
    });
    res.status(200).send({
      property: property,
    });
  } catch (error) {
    res.status(500).send({
      message: `Error occurred, property not created ${error}`,
    });
  }
};

exports.getUserProperties = async (req, res) => {
  try {
    let user = await User.findOne({
      where: {
        userId: req.userId,
      },
    });

    let properties = await Property.findAll({
      where: { userId: user.userId },
    });
    res.status(200).send({
      properties: properties,
    });
  } catch (error) {
    res.status(500).send({
      message: `Error occurred, property not created ${error}`,
    });
  }
};

exports.updateProperty = async (req, res) => {
  try {
    let user = await User.findOne({
      where: {
        userId: req.userId,
      },
    });

    let property = await Property.findOne({
      where: {
        propertyId: req.params.propertyId,
        userId: user.userId,
      },
    });
    await property.update(
      {
        images: req.body.images,
        for: req.body.for,
        description: req.body.description,
        phoneNumber: req.body.phoneNumber,
        price: req.body.price,
        available: req.body.available,
      },
      { returning: true, plain: true }
    );
    res.status(200).json({ property });
  } catch (error) {
    res.status(500).send({
      message: `Error occurred, property not created ${error}`,
    });
  }
};

exports.deleteProperty = async (req, res) => {
  try {
    let user = await User.findOne({
      where: {
        userId: req.userId,
      },
    });

    let property = await Property.findOne({
      where: {
        propertyId: req.params.propertyId,
        userId: user.userId,
      },
    });
    await property.destroy();
    res
      .status(200)
      .json({ message: "Property deleted successfully!" });
  } catch (error) {
    res.status(500).send({
      message: `Error occurred, property not created ${error}`,
    });
  }
};
