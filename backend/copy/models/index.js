require("dotenv").config();
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  process.env.DB,
  process.env.USER,
  process.env.PASSWORD,
  {
    host: process.env.HOST,
    dialect: process.env.dialect,
    operatorsAliases: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.user = require("./user.model.js")(sequelize, Sequelize);
db.property = require("./property.model.js")(sequelize, Sequelize);
db.role = require("./role.model.js")(sequelize, Sequelize);

db.user.hasMany(db.property, {
  foreignKey: "userId",
});            

db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId",
});
db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId",
});

db.ROLES = ["user", "admin"];

module.exports = db;
