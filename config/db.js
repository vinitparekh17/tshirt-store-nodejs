const mongoose = require('mongoose');
require('dotenv').config()
exports.connect = () => {
    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
        .then(() => console.log("Mongoose connected!"))
        .catch(e => {
            console.log(e)
            process.exit(1)
        })
}