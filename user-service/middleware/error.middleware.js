


const errorHandler = (err, req, res, next) => {
    let statusCode = err?.statusCode || 500;
    let message = err?.message || 'Something went wrong';

    // Handle MongoDB validation errors
    if (err?.name === 'ValidationError') {
        message = Object.values(err.errors).map((val) => val.message).join(', ');
        statusCode = 400;
    }

    // Handle CastError for invalid ObjectId
    if (err?.name === 'CastError') {
        message = `Resource not found. Invalid: ${err.path}`;
        statusCode = 404;
    }

    // Handle duplicate key errors
    if (err?.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        const value = err.keyValue[field];
        message = `Duplicate value for '${field}': '${value}'. Please use a different ${field}.`;
        statusCode = 400;
    }

    res.status(statusCode).json({
        success: false,
        message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

export default errorHandler;
