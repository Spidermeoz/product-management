const fs = require('fs');

// Đọc file JSON
const products = require('./product-management.products.json');

// Hàm tạo slug từ title
function slugify(str) {
  return str
    .toString()
    .normalize('NFD') // loại bỏ dấu tiếng Việt
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // loại bỏ ký tự đặc biệt
    .trim()
    .replace(/\s+/g, '-') // thay khoảng trắng bằng -
    .replace(/-+/g, '-'); // loại bỏ nhiều dấu - liên tiếp
}

// Thêm slug cho sản phẩm chưa có
products.forEach(product => {
  if (!product.slug && product.title) {
    product.slug = slugify(product.title);
  }
});

// Ghi ra file mới
fs.writeFileSync(
  './products-with-slug.json',
  JSON.stringify(products, null, 2),
  'utf8'
);

console.log('Đã thêm slug cho các sản phẩm chưa có!');