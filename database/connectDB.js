const mongoose = require("mongoose");
require("dotenv").config();

const dbUrl = process.env.DB_URI;

const connectDb = async () => {
  try {
    const data = await mongoose.connect(dbUrl);
    console.log(`Database connected with ${data.connection.host}`);

  } catch (error) {
    console.log(error.message);
    setTimeout(connectDb, 5000);
  }
};


module.exports=connectDb;
