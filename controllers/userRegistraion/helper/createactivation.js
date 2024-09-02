//  use to create  activation token to  for  user registraion
const jwt = require("jsonwebtoken");
require("dotenv").config();

const createActivationToken = (user) => {
  const ActivationCode = Math.floor(1000 * Math.random() * 9000).toString();
  const token = jwt.sign(
    { user, ActivationCode },
    process.env.ACTIVATION_SECRET,
    { expiresIn: "5m" }
  );

  return { token  ,ActivationCode};
};

module.exports = createActivationToken;
