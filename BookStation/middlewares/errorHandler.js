const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (err.code === 'P2002') {
        err.statusCode = 400;
        err.message = 'A record with this value already exists.';
    }

    const payload = {
        success: false,
        message: err.message,
    };
    if (err.banned) {
        payload.banned = true;
    }
    res.status(err.statusCode).json(payload);
};

module.exports = errorHandler;