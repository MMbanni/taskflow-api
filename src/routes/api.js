const express = require('express');
const taskRouter=require('./tasks.router')
const userRouter=require('./users.router')

const api = express.Router();
api.use('/tasks',taskRouter);
api.use('/users', userRouter)
module.exports=api