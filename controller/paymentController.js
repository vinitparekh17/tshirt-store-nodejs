const stripe = require("stripe")(process.env.STRIPE_KEY);
const Razorpay = require("razorpay");
const asyncHandler = require("../utils/asyncHandler");

exports.sendStripeKey = asyncHandler(async (req, res) => {
  res.status(200).json({
    stripeKey: process.env.STRIPE_KEY,
  });
});

exports.getSripePayment = asyncHandler(async (req, res) => {
  const paymentIntent = await stripe.paymentIntent.create({
    amount: req.body.amount,
    currency: "INR",
    metadata: { integration_check: "accept_a_payment" },
  });

  res.status(200).json({
    success: true,
    client_secret: paymentIntent.client_secret,
    //can send id as well
  });
});

exports.sendRazorpayKey = asyncHandler(async (req, res) => {
  res.status(200).json({
    stripeKey: process.env.RAZORPAY_KEY,
  });
});

exports.getRayzorpayPayment = async (req, res, next) => {
  const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET,
  });

  let amount = req.body.amount;
  let option = {
    amount: amount * 100,
    currency: "INR",
  };
  const myOrder = await instance.orders.create(option);

  res.status(200).json({
    success: true,
    amount: req.body.amount,
    order: myOrder,
  });
};
