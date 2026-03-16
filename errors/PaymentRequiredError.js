const AppError = require('./AppError');

class PaymentRequiredError extends AppError {
    constructor(message) {
        super(message, 402);
    }
}

module.exports = PaymentRequiredError;