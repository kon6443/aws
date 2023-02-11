// connecting Mongoose
const mongoose = require('mongoose');
const config = require('../config/config');

exports.connectMongoDB = () => {
    mongoose.connect(
      config.MONGO.URI,
      {
        // useNewUrlPaser: true,
        // useUnifiedTofology: true,
        // useCreateIndex: true,
        // useFindAndModify: false,
      }
    )
    .then(() => console.log('MongoDB conected...'))
    .catch((err) => {
      console.log(err);
    });   
}