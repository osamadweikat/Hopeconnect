const rateLimit = require('express-rate-limit');

const registerLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 5, 
    message: 'Too many registration attempts, please try again later.',
});

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 3, 
    message: 'Too many login attempts, please try again later.',
});

module.exports = { registerLimiter, loginLimiter };
