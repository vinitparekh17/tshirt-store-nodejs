const router = require('express').Router()
const { home } = require('../controller/homeController')

router.route('/').get(home)

module.exports = router