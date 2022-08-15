// connecting Mongoose
const mongoose = require('mongoose');

const path = require('path');
// calling enviroment variable from .env file
require('dotenv').config({ path: path.resolve(__dirname, '../.env') }); 

exports.db = () => {
    mongoose.connect(
        process.env.MONGO_URI,
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

