exports.authenticate = function (req, res, next) {
  let type = req._passport.session.user.type;
  if (req.isAuthenticated() && type === 'user') {
    return next();
  }
  res.redirect('/users/login');
}