const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    console.log("Error: ", err);

    if (err.name === "CastError") {
        const message = `Resource not found with id of ${err.value}`;
        error = new Error(message);
    }

    if (err.code === 11000) {
        const message = `Duplicate field value entered`;
        error = new Error(message);
    }

    if (err.name === "ValidationError") {
        const message = Object.values(err.errors).map((val) => val.message);
        error = new Error(message);
    }

    if (err.name === "JsonWebTokenError") {
        const message = "Invalid token";
        error = { message, statusCode: 401 };
    }

    if (err.name === "TokenExpiredError") {
        const message = "Token expired";
        error = { message, statusCode: 401 };
    }
    
    if (!error.statusCode) {
        error.statusCode = 500; // Internal Server Error
        error.message = error.message || "Server Error";
    }

    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Server Error",
    });
};

module.exports = { errorHandler };
