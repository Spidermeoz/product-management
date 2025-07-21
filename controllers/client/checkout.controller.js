const Cart = require("../../models/cart.model");
const Order = require("../../models/order.model");
const Product = require("../../models/product.model");

const productsHelper = require("../../helpers/products");

// [GET] /checkout
module.exports.index = async (req, res) => {
  const cartId = req.cookies.cartId;

  const cart = await Cart.findOne({ _id: cartId });

  if (cart.products.length > 0) {
    for (const item of cart.products) {
      const productId = item.product_id;
      const productInfo = await Product.findOne({ _id: productId }).select(
        "title thumbnail slug price discountPercentage"
      );

      productInfo.priceNew = productsHelper.priceNewProduct(productInfo);

      item.productInfo = productInfo;

      item.totalPrice = (item.productInfo.priceNew * item.quantity).toFixed(2);
    }
  }

  cart.totalPrice = cart.products.reduce((sum, item) => {
    return sum + parseFloat(item.totalPrice);
  }, 0);

  res.render("client/pages/checkout/index", {
    title: "Thanh toán",
    cartDetail: cart,
  });
};

// [POST] /checkout/order
module.exports.order = async (req, res) => {
  const cartId = req.cookies.cartId;
  const userInfo = req.body;

  const cart = await Cart.findOne({ _id: cartId });

  const products = [];

  for (const product of cart.products) {
    const objectProduct = {
      product_id: product.product_id,
      price: 0,
      discountPercentage: 0,
      quantity: product.quantity,
    };

    const productInfo = await Product.findOne({
      _id: product.product_id,
    }).select("price discountPercentage");

    objectProduct.price = productInfo.price;
    objectProduct.discountPercentage = productInfo.discountPercentage;

    products.push(objectProduct);
  }

  const orderInfo = {
    cart_id: cartId,
    userInfo: userInfo,
    products: products,
  };

  const order = new Order(orderInfo);
  await order.save();

  await Cart.updateOne({ _id: cartId }, { $set: { products: [] } });

  res.redirect(`/checkout/success/${order._id}`);
};

// [GET] /checkout/success/:orderId
module.exports.success = async (req, res) => {
    const order = await Order.findOne({ _id: req.params.orderId });

    for (const product of order.products) {
        const productInfo = await Product.findOne({ _id: product.product_id }).select("title thumbnail");

        product.productInfo = productInfo;

        product.priceNew = productsHelper.priceNewProduct(product);

        product.totalPrice = (product.priceNew * product.quantity).toFixed(2);
    }

    order.totalPrice = order.products.reduce((sum, item) => {
        return sum + parseFloat(item.totalPrice);
    }, 0);

    res.render("client/pages/checkout/success", {
        title: "Đặt hàng thành công",
        order: order,
    });
}
