
const User = require("./User")
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let ProductSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    discription: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        maxlength: 8,
    },
    rating: {
        type: Number,
        default: 0,
    },
    productImage: {
        type: String,
        default: null,
    },
    productCoverImage: {
        type: String,
        default: null,
    },
    category: {
        type: String,
        required: true,

    },
    Stock: {
        type: Number,
        required: true,
        maxlength: 4,
        default: 1,
    },
    numOfReviews: {
        type: Number,
        default: 0,
    },
    ratings: {
        type: Number,
        default: 0,
    },
    reviews: [{
        name: {
            type: String,
            required: true,
        },
        rating: {
            type: Number,
            required: true,
        },
        comment: {
            type: String,
            required: true,
        },
        user: {
            type: String,
            // ref: 'User',
        },
    }],
    // user: {
    //     type: mongoose.Schema.ObjectId,
    //     ref: 'User',
    //     required: true,
    // },
    createdAt: {
        type: Date,
        default: Date.now
    },
}, {
    timestamps: true
});

// Export the model
const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;