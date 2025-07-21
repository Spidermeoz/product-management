const Cart = require("../../models/cart.model");

module.exports.cartId = async (req, res, next) => {
  console.log(req.cookies.cartId);

  if (!req.cookies.cartId) {
    // Tạo giỏ hang mới nếu không có cartId
    const cart = new Cart();
    await cart.save();

    const expiresCookie = 365 * 24 * 60 * 60 * 1000; // Hết hạn sau 1 năm

    res.cookie("cartId", cart._id, {
      expires: new Date(Date.now() + expiresCookie), // Hết hạn sau 1 năm
    });
  } else {
  }

  next();
};
