module.exports = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    if (error.code > 500) {
      code = 500;
    } else {
      code = error.code;
    }
    res.status(code || 500).json({
      success: false,
      message: error.message,
    });
  }
};
