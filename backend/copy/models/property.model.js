const { Sequelize } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const Property = sequelize.define("properties", {
    propertyId: {
      type: Sequelize.UUID,
      primarykey: true,
      allowNull: false,
    },
    userId: {
      type: Sequelize.UUID,
      allowNull: true,
    },
    images: {
      type: Sequelize.TEXT,
      get: function () {
        return JSON.parse(this.getDataValue("images"));
      },
      set: function (val) {
        return this.setDataValue("images", JSON.stringify(val));
      },
      length: 100000,
    },
    region: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    town: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    street: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    longitude: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    latitude: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    for: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: "rent",
    },
    description: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    owner: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    phoneNumber: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    price: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    available: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: true,
    },
  });
  return Property;
};
