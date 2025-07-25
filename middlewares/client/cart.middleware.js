const Cart = require("../../models/cart.model");

module.exports.cartId = async (req, res, next) => {
  try {
    if (!req.cookies.cartId) {
      const cart = new Cart();
      await cart.save();

      const expiresCookie = 365 * 24 * 60 * 60 * 1000;

      res.cookie("cartId", cart.id, {
        expires: new Date(Date.now() + expiresCookie),
      });

      res.locals.miniCart = cart; // Gán luôn cho trường hợp mới tạo
    } else {
      const cart = await Cart.findOne({
        _id: req.cookies.cartId,
      });

      if (cart) {
        cart.totalQuantity = cart.products.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        res.locals.miniCart = cart;
      } else {
        // Trường hợp cookie có cartId nhưng cart không tồn tại -> tạo mới lại
        const newCart = new Cart();
        await newCart.save();

        const expiresCookie = 365 * 24 * 60 * 60 * 1000;

        res.cookie("cartId", newCart.id, {
          expires: new Date(Date.now() + expiresCookie),
        });

        res.locals.miniCart = newCart;
      }
    }

    next();
  } catch (error) {
    console.error("Error in cart middleware:", error);
    next(error);
  }
};
