const md5 = require("md5");

const Account = require("../../models/account.model");

const systemConfig = require("../../config/system");
const Role = require("../../models/role.model");

// // [GET] /admin/accounts
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };

  const records = await Account.find(find).select("-password -token");

  for (const record of records) {
    const role = await Role.findOne({
      _id: record.role_id,
      deleted: false,
    });
    record.role = role;
  }

  res.render("admin/pages/accounts/index", {
    pageTitle: "Danh sách tài khoản",
    records: records,
  });
};

// // [GET] /admin/accounts/create
module.exports.create = async (req, res) => {
  const roles = await Role.find({
    deleted: false,
  });
  res.render("admin/pages/accounts/create", {
    pageTitle: "Tạo tài khoản",
    roles: roles,
  });
};

// [POST] /admin/accounts/create
module.exports.createPost = async (req, res) => {
  // Kiểm tra email tồn tại
  const emailExist = await Account.findOne({
    email: req.body.email,
    deleted: false,
  });

  console.log(emailExist);

  if (emailExist) {
    req.flash("error", "Email đã tồn tại, vui lòng dùng email khác!");
    res.redirect(req.headers.referer);
  } else {
    // Nếu email chưa tồn tại, tạo tài khoản mới
    try {
      req.body.password = md5(req.body.password);
      const record = new Account(req.body);
      await record.save();

      req.flash("success", "Tạo tài khoản thành công!");
      res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    } catch (error) {
      req.flash("error", "Lỗi khi tạo tài khoản: " + error.message);
      res.redirect(req.headers.referer);
    }
  }
};
