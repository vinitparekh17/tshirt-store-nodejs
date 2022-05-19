const { model, Schema } = require('mongoose')

const productSchema = new Schema({
    name: {
        type: String,
        required: [true, "Product name is not found"],
        trim: true,
        maxlength: [120, "Product name is too long!"]
    },

    price: {
        type: Number,
        required: [true, "Product price is not found"],
        maxlength: [5, "Product price is too long!"]
    },

    description: {
        type: String,
        required: [true, "Product description is not found"],
    },

    catagory: {
        type: String,
        required: [true, "Product catagory not found!"],
        enum: {
            values: [
                "shortsleeves", "longsleeves", "sweatshirt", "hoodies"
            ],
            message: "Please choose short-sleeves, long-sleeves, sweat-shirt, hoodies"
        }
    },

    brand: {
        type: String,
        required: [true, "Please add a brand for clothing"]
    },

    stock: {
        type: Number,
        required: [true, "Please mention the amount of stock"]
    },

    ratings: {
        type: Number,
        default: 0,
    },

    numOfReviews: {
        type: Number,
        default: 0
    },

    reviews: [
        {
            user: {
                type: Schema.ObjectId,
                ref: 'Euser',
                required: true
            },
            name: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true
            },
            feedback: {
                type: String,
                required: true
            },
        }
    ],

    user: {
        type: Schema.ObjectId,
        ref: 'Euser',
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now()
    },

    photo: [
        {
            id: {
                type: String,
                required: true
            },
            secure_url: {
                type: String,
                required: true
            }
        }
    ]
})

module.exports = model("Eproduct", productSchema)