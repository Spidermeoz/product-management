module.exports.createPost = (req, res, next) => {
  if (!req.body.fullName) {
    req.flash("error", `Vui lòng nhập họ tên!`);
    res.redirect(req.headers.referer);
    return;
  }

  if (!req.body.email) {
    req.flash("error", `Vui lòng nhập email!`);
    res.redirect(req.headers.referer);
    return;
  }

  if (!req.body.password) {
    req.flash("error", `Vui lòng nhập mật khẩu!`);
    res.redirect(req.headers.referer);
    return;
  }

  next();
};

module.exports.editPatch = (req, res, next) => {
  if (!req.body.fullName) {
    req.flash("error", `Vui lòng nhập họ tên!`);
    res.redirect(req.headers.referer);
    return;
  }

  if (!req.body.email) {
    req.flash("error", `Vui lòng nhập email!`);
    res.redirect(req.headers.referer);
    return;
  }

  next();
};
