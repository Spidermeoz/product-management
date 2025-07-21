const md5 = require("md5");

const User = require("../../models/user.model");

// [GET] /user/register
module.exports.register = (req, res) => {
  res.render("client/pages/user/register", {
    pageTitle: "Đăng ký tài khoản",
  });
};

// [POST] /user/register
module.exports.registerPost = async (req, res) => {
  console.log(req.body);

  const existEmail = await User.findOne({ email: req.body.email });
  if (existEmail) {
    req.flash("error", "Email đã được sử dụng");
    res.redirect(req.headers.referer);
    return;
  }
  
  req.body.password = md5(req.body.password);

  const user = new User(req.body);
  await user.save();

  res.cookie("tokenUser", user.tokenUser)

  console.log("User created:", user);

  res.redirect("/");
};
