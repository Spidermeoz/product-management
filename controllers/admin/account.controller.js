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

// [GET] /admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
  let find = {
    _id: req.params.id,
    deleted: false,
  };

  try {
    const data = await Account.findOne(find);
    const roles = await Role.find({
      deleted: false,
    });

    res.render("admin/pages/accounts/edit", {
      pageTitle: "Chỉnh sửa tài khoản",
      data: data,
      roles: roles,
    });
  } catch (error) {
    res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
  }
};

// [PATCH] /admin/accounts/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;
  // Kiểm tra email tồn tại
  const emailExist = await Account.findOne({
    _id: {$ne: id}, //ne = not equal
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
