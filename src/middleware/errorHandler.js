const winston = require("winston"); 

const logger = winston.createLogger({
    level: "error",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: "logs/error.log", level: "error" }),
        new winston.transports.Console(),
    ],
});

const errorHandler = (err, req, res, next) => {
    logger.error({
        message: err.message,
        stack: err.stack,
        route: req.originalUrl,
        method: req.method,
    });

    res.status(err.status || 500).json({
        error: err.message || "Internal Server Error",
    });
};

module.exports = errorHandler;
