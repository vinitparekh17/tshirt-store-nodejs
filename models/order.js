const { model, Schema, default: mongoose } = require('mongoose')

const orderSchema = new Schema({
    shippingInfo: {
        address: {
            type: String,
            required: true
        },

        city: {
            type: String,
            required: true
        },

        phoneNo: {
            type: String,
            required: true
        },

        postalCode: {
            type: String,
            required: true
        },

        country: {
            type: String,
            required: true
        }
    },

    user: {
        type: Schema.ObjectId,
        ref: 'Euser',
        required: true
    },

    orderItems: [
        {
            name: {
                type: String,
                required: true
            },

            quantity: {
                type: String,
                required: true
            },

            image: {
                type: String,
                required: true
            },

            price: {
                type: Number,
                required: true
            },

            product: {
                type: mongoose.Schema.Types.ObjectId, // mongoose.Schema.Types.ObjectId
                ref: 'Eproduct',
                required: true
            }
        }
    ],

    paymentInfo: {
        id: {
            type: String
        }
    },

    texAmount: {
        type: Number,
        required: true
    },

    shippingAmount: {
        type: Number,
        required: true
    },
    
    totalAmount: {
        type: Number,
        required: true
    },

    orderStatus: {
        type: String,
        required: true,
        default: 'proccessing'
    },

    delievredAt: {
        type: Date
    },

    createdAt: {
        type: Date,
        default: Date.now()
    }
})

module.exports = model("orders", orderSchema)