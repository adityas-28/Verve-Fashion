// src/middlewares/errorHandler.js
export default (err, req, res, next) => {
  console.error("[ERROR]", err && err.stack ? err.stack : err);
  const status = err && err.status ? err.status : 500;
  res.status(status).json({
    error: err.message || "Internal Server Error",
  });
};
