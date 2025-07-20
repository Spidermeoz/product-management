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

  const newProductsFeatured = productsHelper.priceNewProducts(productsFeatured);
  // Hêt lấy danh sách sản phẩm nổi bật

  // Lấy danh sách sản phẩm mới nhất
  const productsNew = await Product.find({
    deleted: false,
    status: "active",
  }).limit(6).sort({ position: "desc"});

  const newProductsNew = productsHelper.priceNewProducts(productsNew);
  // Hêt lấy danh sách sản phẩm mới nhất

  res.render("client/pages/home/index", {
    pageTitle: "Trang chủ",
    productsFeatured: newProductsFeatured, // Truyền danh sách sản phẩm nổi bật vào view
    productsNew: newProductsNew, // Truyền danh sách sản phẩm mới nhất vào view
  });
};
