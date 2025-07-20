const Product = require("../../models/product.model");

const productsHelper = require("../../helpers/products");

// // [GET] /
module.exports.index = async (req, res) => {
  // Lấy danh sách sản phẩm nổi bật
  const productsFeatured = await Product.find({
    deleted: false,
    featured: 1,
    status: "active",
  }).limit(6);  

  const newProducts = productsHelper.priceNewProducts(productsFeatured);

  res.render("client/pages/home/index", {
    pageTitle: "Trang chủ",
    productsFeatured: newProducts, // Truyền danh sách sản phẩm nổi bật vào view
  });
};
