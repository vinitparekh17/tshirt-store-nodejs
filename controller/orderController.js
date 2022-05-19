const Order = require('../models/order');
const Product = require('../models/product');
const CustomError = require('../utils/CustomError');

exports.createOrder = async (req, res, next) => {
    try {
        const {
            shippingInfo,
            orderItems,
            paymentInfo,
            texAmount,
            shippingAmount,
            totalAmount
        } = req.body

        const newOrder = await Order.create({
            shippingInfo,
            orderItems,
            paymentInfo,
            texAmount,
            shippingAmount,
            totalAmount,
            user: req.user._id
        })
        res.status(200).json({ success: true, newOrder })
    } catch (error) {
        console.log(error);
    }

}

exports.getOneOrder = async (req, res, next) => {
    try {
        // mongo has populate method which is use to drill down more info
        const order = await Order.findById(req.params.id)

        if (!order) {
            return next(new CustomError("Order not found with this id!", 404))
        }

        res.status(200).json({
            success: true,
            order
        })
    } catch (error) {
        console.log(error);
    }
}

exports.getMyOrder = async (req, res, next) => {
    try {
        const order = await Order.find({ user: req.user._id })
        if (!order) {
            return next(new CustomError("Order not found with this id!", 404))
        }

        res.status(200).json({
            success: true,
            order
        })
    } catch (error) {
        console.log(error);
    }
}

exports.adminAllOrders = async (req, res, next) => {
    try {
        const order = await Order.find()

        res.status(200).json({
            success: true,
            order
        })
    } catch (error) {
        console.log(error);
    }
}

exports.adminUpdateorders = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id)
        const { orderStatus } = req.body
        if (order.status === "Delivered") {
            return next(new CustomError("Order is already delivered!", 404))
        }
        order.status = orderStatus
        // if order delivered then update invantory 
        order.orderItems.forEach(async prod => {
            updateProduct(prod.product, prod.quantity)
        })
        order.save()

    } catch (error) {
        console.log(error);
    }
}

async function updateProduct(productId, quantity) {
    const product = await Product.findById(productId)
    product.stock -= quantity
    await product.save({
        validateBeforeSave: false
    })
}

exports.adminDeleteorders = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id)
        

    } catch (error) {
        console.log(error);
    }
}