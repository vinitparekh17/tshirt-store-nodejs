const app = require("./app")
require('dotenv').config()
const cloudinary = require('cloudinary')
const { PORT } = process.env
const { CLOUD_NAME, CLOUD_KEY, CLOUD_SECRET } = process.env
cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: CLOUD_KEY,
    api_secret: CLOUD_SECRET
})

app.listen(PORT, () => {
    console.log("http://localhost:3001")
})