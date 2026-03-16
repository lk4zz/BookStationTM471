const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (err.code === 'P2002') {
        err.statusCode = 400;
        err.message = 'A record with this value already exists.';
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message
    });
};

module.exports = errorHandler;