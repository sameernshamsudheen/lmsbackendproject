const UserModal = require("../../models/user/userModel");
const ErrorHandler = require("../../utils/errorHandler");

const UserRegistraion = (req, res, next) => {
  const { name, email, password } = req.body;

  const emailExists = UserModal.findOne({ email });

  if (emailExists) {
    return next(new ErrorHandler("email already exists", 400));
  }
  return res.status(200).json({
    success: true,
    status: 200,
  });
};
