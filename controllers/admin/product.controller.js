// [GET] /admin/products
const Product = require("../../models/product.model");

const filterStatusHelper = require("../../helpers/filterStatus");

module.exports.index = async (req, res) => {
  // console.log(req.query.status)

  // Bộ lọc trạng thái
  const filterStatus = filterStatusHelper(req.query);


  let find = {
    deleted: false,
  };

  if (req.query.status) {
    find.status = req.query.status;
  }

  let keyword = "";
  if (req.query.keyword) {
    keyword = req.query.keyword;
    find.title = { $regex: keyword, $options: "i" }; // Tìm kiếm không phân biệt chữ hoa chữ thường
  }

  const products = await Product.find(find);
  res.render("admin/pages/products/index", {
    pageTitle: "Danh sách sản phẩm",
    products: products,
    filterStatus: filterStatus,
    keyword: keyword,
  });
};
