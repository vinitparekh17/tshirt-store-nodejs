const Order = require('../models/order');
const Product = require('../models/product');

exports.createOrder = async (req, res, next) => {
    try {
        const {
            shippingInfo,
            orderItems,
            paymentInfo,
            taxAmount,
            shippingAmount,
            totalAmount
        } = req.body

        const newOrder = await Order.create({
            shippingInfo,
            orderItems,
            paymentInfo,
            taxAmount,
            shippingAmount,
            totalAmount,
            user: req.user._id
        })

        res.status(200).json({ success: true, newOrder })
    } catch (error) {
        console.log(error);
    }

}