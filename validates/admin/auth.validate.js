module.exports.loginPost = async (req, res) => {
  if (!req.body.email) {
    req.flash("error", "Vui lòng nhập email!");
    res.redirect(req.headers.referer);
    return;
  }

  if (!req.body.password) {
    req.flash("error", "Vui lòng nhập password!");
    res.redirect(req.headers.referer);
    return;
  }

  next();
};
