// [GET] /admin/products
const Product = require("../../models/product.model");

const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");

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
  // End of filter status

  // Tìm kiếm theo từ khóa
  const objectSearch = searchHelper(req.query);

  if (objectSearch.keyword) {
    find.title = objectSearch.regex;
  }
  // End of search

  //Pagination
  const countProducts = await Product.countDocuments(find);

  let objectPagination = paginationHelper(
    {
      currentPage: 1,
      limitItems: 6,
    },
    req.query,
    countProducts
  );

  // if (req.query.page) {
  //   objectPagination.currentPage = parseInt(req.query.page);
  // }

  // objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitItems;

  // const countProducts = await Product.countDocuments(find);
  // const totalPages = Math.ceil(countProducts / objectPagination.limitItems);
  // objectPagination.totalPages = totalPages;
  //End of Pagination

  const products = await Product.find(find)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);

  res.render("admin/pages/products/index", {
    pageTitle: "Danh sách sản phẩm",
    products: products,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
  });
};
