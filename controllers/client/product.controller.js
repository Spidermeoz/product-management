const Product = require("../../models/product.model");

const productsHelper = require("../../helpers/products");

// [GET] /products
module.exports.index = async (req, res) => {
  const products = await Product.find({
    status: "active", // Lấy tất cả sản phẩm có trạng thái active
    deleted: false // Lấy tất cả sản phẩm chưa bị xóa
  }).sort({ position: "desc" }); // Sắp xếp theo vị trí giảm dần

  const newProducts = productsHelper.priceNewProducts(products);

  res.render("client/pages/products/index", {
  pageTitle: "Trang danh sách sản phẩm",
  products: newProducts // Truyền danh sách sản phẩm vào view
});
};

// [GET] /products/:slug
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      slug: req.params.slug,
      status: "active"
    };

    const product = await Product.findOne(find);

    res.render("client/pages/products/detail", {
      pageTitle: product.title,
      product: product
    });
  } catch (error) {
    req.flash("error", `Sản phẩm không tồn tại!`);
    res.redirect(`/products`);
  }
};