const Order = require("../models/order");
const Product = require("../models/product");
const CustomError = require("../utils/CustomError");
const asyncHandler = require("../utils/asyncHandler");

exports.createOrder = asyncHandler(async (req, res) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    texAmount,
    shippingAmount,
    totalAmount,
  } = req.body;

  const newOrder = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    texAmount,
    shippingAmount,
    totalAmount,
    user: req.user._id,
  });
  res.status(200).json({ success: true, newOrder });
});

exports.getOneOrder = asyncHandler(async (req, res) => {
  // mongo has populate method which is use to drill down more info
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new CustomError("Order not found with this id!", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

exports.getMyOrder = asyncHandler(async (req, res) => {
  const order = await Order.find({ user: req.user._id });
  if (!order) {
    return next(new CustomError("Order not found with this id!", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

exports.adminAllOrders = asyncHandler(async (req, res) => {
  const order = await Order.find();

  res.status(200).json({
    success: true,
    order,
  });
});

exports.adminUpdateorders = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  const { orderStatus } = req.body;
  if (order.status === "Delivered") {
    return next(new CustomError("Order is already delivered!", 404));
  }
  order.status = orderStatus;
  // if order delivered then update invantory
  order.orderItems.forEach(async (prod) => {
    updateProduct(prod.product, prod.quantity);
  });
  order.save();
});

async function updateProduct(productId, quantity) {
  const product = await Product.findById(productId);
  product.stock -= quantity;
  await product.save({
    validateBeforeSave: false,
  });
}

exports.adminDeleteorders = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  order.remove();

  res.status(200).json({
    success: true,
  });
});
