exports.authenticate = function (req, res, next) {
  let type = req._passport.session.user.type;
  if (req.isAuthenticated() && type === 'company') {
    return next();
  }
  res.redirect('/companies/login');
}