const { Sequelize } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const Role = sequelize.define("roles", {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
    },
  });
  return Role;
};
