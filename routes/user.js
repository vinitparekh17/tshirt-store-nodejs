const router = require('express').Router()
const {
    signup,
    login,
    logout,
    forgotpassword,
    passwordReset,
    userprofile,
    changePassword,
    updateDetails,
    adminUsers,
    managerUsers,
    adminOneUsers,
    adminUpdateOneUser,
    adminDeleteOneUser
} = require('../controller/userController')
const { isLoggedIn, customRole } = require('../middlewares/user')

router.route('/signup').post(signup)
router.route('/login').post(login)
router.route('/logout').get(isLoggedIn, logout)
router.route('/forgotpassword').post(isLoggedIn, forgotpassword)
router.route('/password/reset/:token').post(isLoggedIn, passwordReset)
router.route('/password/change').post(isLoggedIn, changePassword)
router.route('/profile').get(isLoggedIn, userprofile)
router.route('/updateprofile').post(isLoggedIn, updateDetails)

// admin only route 
router.route('/admin/users').get(isLoggedIn, customRole('admin'), adminUsers)
router.route('/admin/users/:id').get(isLoggedIn, customRole('admin'), adminOneUsers)
router.route('/admin/users/:id').put(isLoggedIn, customRole('admin'), adminUpdateOneUser)
router.route('/admin/users/:id').delete(isLoggedIn, customRole('admin'), adminDeleteOneUser)
        

//manager only route
router.route('/manager/users').get(isLoggedIn, customRole('admin'), managerUsers)

module.exports = router;