module.exports.priceNewProducts = (products) => {
  const newProducts = products.map((item) => {
    item.priceNew = item.price - (item.price * item.discountPercentage) / 100;
    item.priceNew = item.priceNew.toFixed(2); // Làm tròn đến 2 chữ số thập phân
    return item;
  });
  return newProducts;
};

module.exports.priceNewProduct = (product) => {
  const priceNew = (
    product.price -
    (product.price * product.discountPercentage) / 100
  ).toFixed(2); // Làm tròn đến 2 chữ số thập phân
  return parseFloat(priceNew);
};
