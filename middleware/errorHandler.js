const { error } = require("ajv/dist/vocabularies/applicator/dependencies");

const errorHandler = (err,req,res,next) => {
    console.error(`[${new Date().toISOString()}] ${err.stack}`);

    if (err.name === 'CastError'){
        return res.status(400).json({error: 'Invalid ID format'});
    }

    if (err.code === 11000){
        const field =  Object.keys(err.keyValue)[0];
        return res.status(409).json({error: '${field} already exists'});
    }


    if (err.name === 'ValidationError'){
        const messages = Object.values(err.errors).map(e => e.message);
        return res.status(422).json({error: messages});
    }

    if (err.name === 'JsonWebTokenError'){
        return res.status(401).json({error: 'Invalid Token'});
    }

    if (err.name === 'TokenExpiredError'){
        return res.status(401).json({error: 'Token Expired'});
    }

    res.status(err.statusCode || 500).json({
        error: err.message || 'Internal Server error'
    });
};

module.exports = errorHandler;