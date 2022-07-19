const Product = require('../moddles/Product')
const ApiFeatures = require('../utils/apiFeatures')
const User = require('../moddles/User')
const Order = require('../moddles/Order')

//Get All Products
const newOrder = async (req, res) => {
    try {
        const {
            shippingInfo,
            orderItems,
            paymentInfo,
            ItemPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        } = req.body

        const order = await Order.create({
            shippingInfo,
            orderItems,
            paymentInfo,
            ItemPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            paidAt: Date.now(),
            user: req.user._id,
        })

        return res.status(201).send({
            status: 1,
            order,
        })
    }
    catch (error) {
        return res.status(400).send({
            sattus: 0,
            message: error.message + ': error in catch statement'
        })
    }

}


//get single order
const getSingleOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.body._id).populate("user", "name email")


        if (!order) {
            return res.status(404).send({
                status: 0,
                message: "Order not Found with this id",
            })
        }

        return res.status(200).send({
            status: 1,
            order,
        })
    }
    catch (error) {
        return res.status(400).send({
            sattus: 0,
            message: error.message + ': error in catch statement'
        })
    }

}




//get loggedIn User order
const myOrder = async (req, res) => {
    try {
        const orders = await Order.find({
            user: req.user._id
        })


        // if(!orders) {
        //     res.status(404).send({
        //         status: 0,
        //         message: "Order not Found with this id",
        //     })
        // }

        return res.status(200).send({
            status: 1,
            orders,
        })
    }
    catch (error) {
        return res.status(400).send({
            sattus: 0,
            message: error.message + ': error in catch statement'
        })
    }

}


//get all order --Admin
const allOrder = async (req, res) => {
    try {
        const orders = await Order.find()


        // if(!orders) {
        //     res.status(404).send({
        //         status: 0,
        //         message: "Order not Found with this id",
        //     })
        // }

        let totalAmount = 0
        orders.forEach((order) => {
            totalAmount += order.totalPrice
        })

        return res.status(200).send({
            status: 1,
            totalAmount,
            orders,
        })
    }
    catch (error) {
        return res.status(400).send({
            sattus: 0,
            message: error.message + ': error in catch statement'
        })
    }

}



//Update order status --Admin
const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.body._id)


        if (order.orderStatus === "Delivered") {
            return res.status(400).send({
                status: 0,
                message: "you have delivered this order",
            })
        }


        order.orderItems.forEach(async order => {
            await updateStock(order.product, order.quantity)
        })

        order.orderStatus = req.body.status

        if (req.body.status == "Delivered") {
            order.deliveredAt = Date.now()
        }

        await order.save({
            validateBeforeSave: true,
        })
        return res.status(200).send({
            status: 1,
            order,
        })
    }
    catch (error) {
        return res.status(400).send({
            sattus: 0,
            message: error.message + ': error in catch statement'
        })
    }

}

async function updateStock (_id, quantity) {
    const product = await Product.findById(_id)

    product.stock -= quantity
    product.save({
        validateBeforeSave: true,
    })
}



//get Delete order --Admin
const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.body._id)

       
        if(!order) {
            return res.status(404).send({
                status: 0,
                message: "Order not Found with this id",
            })
        }

        await order.remove()
        return res.status(200).send({
            status: 1,
            order,
        })
    }
    catch (error) {
        return res.status(400).send({
            sattus: 0,
            message: error.message + ': error in catch statement'
        })
    }

}
module.exports = {
    newOrder,
    getSingleOrder,
    myOrder,
    allOrder,
    updateOrderStatus,
    deleteOrder
}