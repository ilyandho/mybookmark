const mongoose = require('mongoose');
require('dotenv').config();

mongooseConnect = () => {
  console.log('Connect to DB');
  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
    .then(() => console.log(`MongoDB Connected`));
};

module.exports = mongooseConnect;
