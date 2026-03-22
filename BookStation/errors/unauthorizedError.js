const AppError = require('./AppError');

class unauthroizedError extends AppError {
    constructor(message) {
        super(message, 401);
    }
}

module.exports = unauthroizedError;