// [GET] /products
const Product = require("../../models/product.model");

module.exports.index = async (req, res) => {
  console.log("Product controller index called");
  const products = await Product.find({
    status: "active", // Lấy tất cả sản phẩm có trạng thái active
    deleted: false // Lấy tất cả sản phẩm chưa bị xóa
  }).sort({ position: "desc" }); // Sắp xếp theo vị trí giảm dần

  const newProducts = products.map(item => {
    item.priceNew = item.price - (item.price * item.discountPercentage / 100);
    item.priceNew = item.priceNew.toFixed(2); // Làm tròn đến 2 chữ số thập phân
    return item;
  })

  console.log(products); // In ra console để kiểm tra

  res.render("client/pages/products/index", {
  pageTitle: "Trang danh sách sản phẩm",
  products: newProducts // Truyền danh sách sản phẩm vào view
});
};
