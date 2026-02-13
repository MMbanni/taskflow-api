import 'dotenv/config';
import app from './app.js';
import { errorLogger } from './core/utils/errorLogger.js';
import { mongoConnect } from './infrastructure/database/mongo.js';
import { config } from './config/config.js';

mongoConnect()
  .then(() => {
    app.listen(config.port, () => {
      console.log(`Listening on port ${config.port}`);
    });
  })
  .catch((err:unknown) => {
    errorLogger(err, 'MongoDB connection failed: ')
});

