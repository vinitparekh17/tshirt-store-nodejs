const router = require('express').Router()
const { isLoggedIn } = require('../middlewares/user')
const { sendStripeKey, getSripePayment, sendRazorpayKey, getRayzorpayPayment } = require('../controller/paymentController')

// stripe payments 
router.route('/stripekey').get(isLoggedIn, sendStripeKey)
router.route('/stripepayment').post(isLoggedIn, getSripePayment)

// razorpay payments 
router.route('/rayzorpay').get(isLoggedIn, sendRazorpayKey)
router.route('/razorpayment').post(isLoggedIn, getRayzorpayPayment)

module.exports = router