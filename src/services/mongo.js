const mongoose = require('mongoose');
const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/taskflow";

let dbConnectionStatus = false;

mongoose.connection.on('open', () => {
  dbConnectionStatus = true;
  console.log('Mongo connection ready');
});

mongoose.connection.on('error', (err) => {
  dbConnectionStatus = false;
  console.log("MongoDB connection error: ", err);
});

async function mongoConnect() {
  try {
    console.log(`Connecting to ${MONGO_URL}`);
    await mongoose.connect(MONGO_URL);
  } catch (err) {
    console.log('Failed to connect to MongoDB');
    console.log(err);

  }

}
const isDbConnected = () => {
  return dbConnectionStatus;
};

module.exports = {
  mongoConnect,
  isDbConnected
}