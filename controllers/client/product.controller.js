const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");

const productsHelper = require("../../helpers/products");
const productsCategoryHelper = require("../../helpers/products-category");


// [GET] /products
module.exports.index = async (req, res) => {
  const products = await Product.find({
    status: "active", // Lấy tất cả sản phẩm có trạng thái active
    deleted: false, // Lấy tất cả sản phẩm chưa bị xóa
  }).sort({ position: "desc" }); // Sắp xếp theo vị trí giảm dần

  const newProducts = productsHelper.priceNewProducts(products);

  res.render("client/pages/products/index", {
    pageTitle: "Trang danh sách sản phẩm",
    products: newProducts, // Truyền danh sách sản phẩm vào view
  });
};

// [GET] /products/:slugCategory
module.exports.category = async (req, res) => {
  try {
    const category = await ProductCategory.findOne({
      slug: req.params.slugCategory,
      status: "active",
      deleted: false,
    });

    const listSubCategory = await productsCategoryHelper.getSubCategory(category.id);

    const listSubCategoryIds = listSubCategory.map((item) => item.id);

    const products = await Product.find({
      product_category_id: { $in: [category.id, ...listSubCategoryIds] }, // Lấy sản phẩm thuộc danh mục và các danh mục con
      status: "active",
      deleted: false,
    }).sort({ position: "desc" });

    const newProducts = productsHelper.priceNewProducts(products);

    res.render("client/pages/products/index", {
      pageTitle: category.title,
      products: newProducts, // Truyền danh sách sản phẩm vào view
    });
  } catch (error) {
    console.error("Error fetching category:", error);
    return res.status(500).send("Internal Server Error");
  }
};
