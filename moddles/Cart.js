
const User = require("./User")
const Product = require("./Product")
const Cart = require("./Cart")
const mongoose = require("mongoose")
const Schema = mongoose.Schema

let CartSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    products: [{
        productId: {
            type: String,
        },
        quantity: {
            type: Number,
            default: 1,
        },
    }],
},
    { timestamps: true }
)

// Export the model
const Cart = mongoose.model("Cart", CartSchema);
module.exports = Cart;