/* eslint-disable no-unused-vars */

// 404 fallthrough for unmatched routes.
export const notFound = (req, res, next) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
};

/**
 * Central error handler — maps common Mongoose/JWT errors to precise
 * HTTP status codes so the API never leaks stack traces in production.
 */
export const errorHandler = (err, req, res, next) => {
  let status = err.statusCode || 500;
  let message = err.message || 'Internal server error';

  // Mongoose validation errors -> 400
  if (err.name === 'ValidationError') {
    status = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
  }

  // Invalid ObjectId -> 404
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    status = 404;
    message = 'Resource not found';
  }

  // Duplicate key (unique email / username) -> 400
  if (err.code === 11000) {
    status = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `An account with that ${field} already exists`;
  }

  res.status(status).json({
    message,
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  });
};
