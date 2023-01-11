const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 5000;
const db = require("./models");
const Role = db.role;
var cors = require("cors");
const { uuid } = require("uuidv4");
/*
db.sequelize.sync(/*{ force: true }).then(() => {
  console.log("Connected to database");
  initial();
});*/
async function initial() {
  try {
    Role.create({
      id: uuid(),
      name: "user",
    });

    await Role.create({
      id: uuid(),
      name: "admin",
    });
  } catch (err) {
    console.log(err);
  }
}

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

require("./routes/auth.routes")(app);
require("./routes/property.routes")(app);
/*
require("./routes/product.routes")(app);
require("./routes/images.routes")(app);
*/
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
