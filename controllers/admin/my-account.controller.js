const md5 = require("md5");
const Account = require("../../models/account.model");

// const systemConfig = require("../../config/system");

// [GET] /admin/my-account
module.exports.index = async (req, res) => {
  res.render("admin/pages/my-account/index"),
    {
      pageTitle: "My Account",
    };
};

// [GET] /admin/my-account/edit
module.exports.edit = async (req, res) => {
  res.render("admin/pages/my-account/edit"),
    {
      pageTitle: "Edit My Account",
    };
};

// [PATCH] /admin/my-account/edit
module.exports.editPatch = async (req, res) => {
  const id = res.locals.user._id;
  // Kiểm tra email tồn tại
  const emailExist = await Account.findOne({
    _id: { $ne: id }, //ne = not equal
    email: req.body.email,
    deleted: false,
  });

  if (emailExist) {
    req.flash("error", "Email đã tồn tại, vui lòng dùng email khác!");
  } else {
    if (req.body.password) {
      req.body.password = md5(req.body.password);
    } else {
      delete req.body.password;
    }

    req.flash("success", "Cập nhật tài khoản thành công!");

    await Account.updateOne({ _id: id }, req.body);
  }
  res.redirect(req.headers.referer);
};
