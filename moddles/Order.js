
const User = require("./User")
const Product = require("./Product")
const mongoose = require("mongoose")
const Schema = mongoose.Schema

let OrderSchema = new Schema({
    shippingInfo: {
        address: {
            type: Object,
            required: true,
        },
        city: {
            type: Object,
            required: true,
        },
        state: {
            type: Object,
            required: true,
        },
        country: {
            type: Object,
            required: true,
        },
        pinCode: {
            type: Number,
        },
        phoneNo: {
            type: Number,
            required: true,
        },
    },
    orderItems: [{
        name: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        quantity: {
            type: Number,
            default: 1,
        },
        image: {
            type: String,
        },
        product: {
            type: mongoose.Schema.ObjectId,
            ref: 'Product',
            required: true,
        },
    }],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    paymentInfo: {
        Id: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
        },
    },
    paidAt: {
        type: Date,
        required: true,
    },
    ItemsPrice: {
        type: Number,
        default: 0,
    },
    taxPrice: {
        type: Number,
        default: 0,
    },
    shippingPrice: {
        type: Number,
        default: 0,
    },
    totalPrice: {
        type: Number,
        default: 0,
    },
    orderStatus: {
        type: String,
        default: "Pending",
    },
    deliveredAt: {
        type: Date,
    },
},
    { timestamps: true }
)

// Export the model
const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;