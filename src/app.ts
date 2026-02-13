import express from 'express';
import cookieParser from 'cookie-parser';
import api from './routes/api.js';
import { dbCheck } from './core/middleware/dbCheck.js';
import { errorHandler } from './core/middleware/errorHandler.js';

const app = express();

app.use(express.json());

app.use(cookieParser());
app.use(dbCheck);
app.use(api);
app.use(errorHandler)

export default app;