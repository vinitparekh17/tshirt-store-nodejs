const router = require('express').Router()
const { createOrder, getOneOrder, getMyOrder, adminAllOrders, adminUpdateorders, adminDeleteorders } = require('../controller/orderController')
const { isLoggedIn, customRole } = require('../middlewares/user')

router.route('/order/create').post(isLoggedIn , createOrder)
router.route('/order/:id').get(isLoggedIn , getOneOrder)
router.route('/orders').get(isLoggedIn, getMyOrder)

// admin routes 
router.route('/admin/orders').get(isLoggedIn, customRole("admin") ,adminAllOrders)
router.route('/admin/updateorders').put(isLoggedIn, customRole("admin") ,adminUpdateorders)
router.route('/admin/updateorders').delete(isLoggedIn, customRole("admin") ,adminDeleteorders)


module.exports = router

