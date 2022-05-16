const router = require('express').Router()
const {
    getAllproduct,
    addProduct,
    adminAllproduct,
    getOneproduct,
    adminUpdateproduct,
    adminDeleteproduct,
    addReview,
    deleteReview,
    getOnlyOneReviews
} = require('../controller/productController')
const { isLoggedIn, customRole } = require('../middlewares/user')


router.route('/products').get(isLoggedIn, getAllproduct)
router.route('/product/:id').get(isLoggedIn, getOneproduct)
router.route('/review').put(isLoggedIn, addReview)
router.route('/review').delete(isLoggedIn, deleteReview)
router.route('/productreviews').get(isLoggedIn, getOnlyOneReviews)

// admin
router.route('/admin/product/add').post(isLoggedIn , customRole("admin") , addProduct)
router.route('/admin/products').get(isLoggedIn, customRole('admin') ,adminAllproduct)
router.route('/admin/product/:id').put(isLoggedIn, customRole('admin') ,adminUpdateproduct)
router.route('/admin/product/:id').delete(isLoggedIn, customRole('admin') ,adminDeleteproduct)
 

module.exports = router