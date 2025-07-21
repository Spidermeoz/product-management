const Product = require("../../models/product.model");

const productsHelper = require("../../helpers/products");

// // [GET] /search
module.exports.index = async (req, res) => {
  const keyword = req.query.keyword;

  let newProducts = [];

  if (keyword) {
    const regex = new RegExp(keyword, "i"); // Tạo biểu thức chính quy để tìm kiếm không phân biệt chữ hoa chữ thường
    const products = await Product.find({
        title: regex, // Tìm kiếm sản phẩm theo tiêu đề
        status: "active", // Lấy tất cả sản phẩm có trạng thái active
        deleted: false, // Lấy tất cả sản phẩm chưa bị xóa
    })

    console.log("Sản phẩm tìm kiếm:", products);

    newProducts = productsHelper.priceNewProducts(products);
  }

  res.render("client/pages/search/index", {
    pageTitle: "Kết quả tìm kiếm",
    keyword: keyword,
    products: newProducts,
  });
};
