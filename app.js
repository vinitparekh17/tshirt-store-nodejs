const express = require('express')
// Initiliseing server application with express
const app = express()

const ejs = require('ejs')
// ejs templating
app.set('view engine', 'ejs')

// middleware for getting data from body in json format
app.use(express.json())
// middleware for getting data as a search queries
app.use(express.urlencoded({ extended: true }))

// mongoose connection 
require('./config/db').connect()

// for reading cookies and handling 
const cookieParser = require('cookie-parser')
app.use(cookieParser())

// handaling file uploading
const fileUpload = require('express-fileupload')
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "tmp"
}))

// morgan middleware to check response time when we hit an api route
const morgan = require('morgan')
morgan(':method :url :status :res[content-length] - :response-time ms')
app.use(require('morgan')('tiny'))

//swagger api docs
const Yaml = require('yamljs');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = Yaml.load('./swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//import all routes
const home = require('./routes/home')
const user = require('./routes/user')
const product = require('./routes/product')

// router middleware
app.use('/api/v1/', home)
app.use('/api/v1/', user)
app.use('/api/v1/', product)



app.get('/signup', (req, res) => {
    res.render('postform')
})
// exporting the app 
module.exports = app;