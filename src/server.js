require('dotenv').config();
const app = require('./app');
const { mongoConnect } = require('./services/mongo');

const PORT = process.env.PORT || 3000;


mongoConnect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Listening on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error("MongoDB connection failed: ", err);

});
