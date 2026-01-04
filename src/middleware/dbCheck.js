const {isDbConnected} = require('../services/mongo');

const dbCheck = (req,res,next) => {
    if(!isDbConnected()){
        return res.status(503).json({
            success: false,
            error: ['Service temporarily unavailable']
        });
    }
    next();

}

module.exports = {dbCheck}