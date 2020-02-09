const mongoose = require("mongoose");

module.exports = () => {
  try {
    mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: true,
      useUnifiedTopology: true
    });
    console.log("connected to db");
  } catch (error) {
    console.log(`${error.message} mongodb error`);
  }
};
