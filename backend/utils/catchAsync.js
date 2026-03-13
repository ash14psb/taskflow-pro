// This catches any errors in our async controllers and passes them to our global error handler!
module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
