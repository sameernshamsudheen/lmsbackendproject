const ErrorHandler = require("../utils/errorHandler");

const getUserById = async (id, res,next ) => {
  try {
    const user = await userModal.findOne({ id: id });

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 400));
  }
};


module.exports=getUserById;