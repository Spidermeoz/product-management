const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");

const productsHelper = require("../../helpers/products");

// [GET] /cart
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

  res.render("client/pages/cart/index", {
    title: "Giỏ hàng",
    cartDetail: cart,
  });
};

// [POST] /cart/add/:productId
module.exports.addPost = async (req, res) => {
  const productId = req.params.productId;
  const quantity = parseInt(req.body.quantity);
  const cartId = req.cookies.cartId;

  const cart = await Cart.findOne({ _id: cartId });

  const existProduct = cart.products.find(
    (item) => item.product_id === productId
  );

  if (existProduct) {
    const quantityNew = existProduct.quantity + quantity;

    await Cart.updateOne(
      {
        _id: cartId,
        "products.product_id": productId,
      },
      {
        $set: { "products.$.quantity": quantityNew },
      }
    );
  } else {
    const objectCart = {
      product_id: productId,
      quantity: quantity,
    };

    await Cart.updateOne(
      { _id: cartId },
      {
        $push: { products: objectCart },
      }
    );
  }

  req.flash("success", "Thêm sản phẩm vào giỏ hàng thành công");

  res.redirect(req.headers.referer);
};

// [GET] /cart/delete/:productId
module.exports.delete = async (req, res) => {
  const cartId = req.cookies.cartId;
  const productId = req.params.productId;

  await Cart.updateOne(
    {
      _id: cartId,
    },
    {
      $pull: { products: { product_id: productId } },
    }
  );

  req.flash("success", "Xoá sản phẩm khỏi giỏ hàng thành công");

  res.redirect(req.headers.referer);
};

// [GET] /cart/update/:productId/:quantity
module.exports.update = async (req, res) => {
  const cartId = req.cookies.cartId;
  const productId = req.params.productId;
  const quantity = parseInt(req.params.quantity);

  await Cart.updateOne(
    {
      _id: cartId,
      "products.product_id": productId,
    },
    {
      $set: { "products.$.quantity": quantity },
    }
  );

  req.flash("success", "Cập nhật số lượng sản phẩm thành công");

  res.redirect(req.headers.referer);
};
