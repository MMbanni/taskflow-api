const express = require('express');
const api = require('./routes/api');
const { dbCheck } = require('./middleware/dbCheck');

const app = express();

app.use(express.json());
app.use(dbCheck);
app.use(api);

app.get('/', (req, res) => {
  res.send('TaskFlow API running');
});

module.exports = app;