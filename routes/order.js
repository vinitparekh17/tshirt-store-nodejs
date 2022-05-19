const router = require('express').Router()
const { createOrder } = require('../controller/orderController')
const { isLoggedIn } = require('../middlewares/user')

router.route('/order/create').post(isLoggedIn , createOrder)

module.exports = router

