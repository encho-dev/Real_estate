const db = require("../models");
const User = db.user;
const Role = db.role;
const Op = db.Sequelize.Op;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { uuid } = require("uuidv4");

exports.signup = async (req, res) => {
  // Save User to Database
  try {
    let user = await User.create({
      userId: uuid(),
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phoneNumber: req.body.phoneNumber,
    });

    if (req.body.roles) {
      if (
        req.body.roles.indexOf("admin") > -1 ||
        req.body.roles.indexOf("Admin") > -1 ||
        req.body.roles.indexOf("ROLE_USER") > -1
      ) {
        res.status(403).send({ message: "Not authorized" });
      }
      let roles = await Role.findAll({
        where: {
          name: {
            [Op.or]: req.body.roles,
          },
        },
      });
      user.setRoles(roles).then(() => {
        res.send({
          message: "User was registered successfully!",
        });
      });
    } else {
      // user role = 1
      user.setRoles([1]).then(() => {
        res.send({
          message: "User was registered successfully!",
        });
      });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.signin = async (req, res) => {
  try {
    let user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (!user) {
      return res.status(404).send({ message: "User Not found!" });
    }
    var passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );
    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid email and/or Password!",
      });
    }
    var token = jwt.sign(
      { userId: user.userId },
      process.env.SECRET,
      {
        expiresIn: 86400, // 24 hours
      }
    );
    var authorities = [];
    user.getRoles().then((roles) => {
      for (let i = 0; i < roles.length; i++) {
        authorities.push("ROLE_" + roles[i].name.toUpperCase());
      }
      res.status(200).send({
        firstName: user.firstName,
        lastName: user.lastName,
        userId: user.userId,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        roles: authorities,
        accessToken: token,
      });
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

/*
exports.changePassword = async (req, res) => {
  try {
    let user = await User.findOne({
      where: {
        userId: req.userId,
      },
    });
    if (!user) {
      return res.status(404).send({ message: "User Not found!" });
    }
    var passwordIsValid = bcrypt.compareSync(
      req.body.oldPassword,
      user.password
    );
    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid email and/or Password!",
      });
    }

    await user.update(
      {
        password: bcrypt.hashSync(req.body.newPassword, 8),
      },
      { returning: true, plain: true }
    );
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
*/
/*
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // look for email in database
    const user = await User.findOne({
      where: {
        email,
      },
    });
    // if there is no user send back an error
    if (!user) {
      res.status(404).json({ message: "User not found" });
    } else {
      // otherwise we need to create a temporary token that expires in 10 mins
      const resetLink = jwt.sign(
        { user: user.email },
        process.env.SECRET,
        {
          expiresIn: "10m",
        }
      );
      // update resetLink property to be the temporary token and then send email
      await user.update({ resetLink });
      // we'll define this function below
      sendEmail(user, resetLink);
      res.status(200).json({ message: "Check your email" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
*/
/*
exports.resetPassword = async (req, res) => {
  // Get the token from params
  const resetLink = req.body.token;
  let newPassword = req.body.newPassword;

  // if there is a token we need to decoded and check for no errors
  if (resetLink) {
    jwt.verify(
      resetLink,
      process.env.SECRET,
      (error, decodedToken) => {
        if (error) {
          res
            .status(403)
            .json({ message: "Incorrect token or expired" });
        }
      }
    );
  }

  try {
    // find user by the temporary token we stored earlier
    const user = await User.findOne({
      where: {
        resetLink,
      },
    });
    // if there is no user, send back an error
    if (!user) {
      res
        .status(400)
        .json({ message: "We could not find a match for this link" });
    }

    // otherwise we need to hash the new password  before saving it in the database
    const hashPassword = bcrypt.hashSync(newPassword, 8);
    newPassword = hashPassword;

    // update user credentials and remove the temporary link from database before saving
    const updatedCredentials = {
      password: newPassword,
      resetLink: null,
    };

    await user.update({ ...updatedCredentials, ...user });
    res.status(200).json({ message: "Password updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
*/
