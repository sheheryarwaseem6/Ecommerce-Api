const Product = require('../moddles/Product')
const ApiFeatures = require('../utils/apiFeatures')
const User = require('../moddles/User')


//Test
const getAllProducts = async (req, res) => {
    res.status(200).send({
        status: 0,
        message: 'Route is working properly'
    });
}

//Create Product --Admin
const createProduct = async (req, res) => {
    console.log(req.body);
    try {
        // console.log(req.body);
        if (!req.body.name) {
            res.status(400).send({
                status: 0,
                message: 'Please add name to product'
            });
        } else if (!req.body.discription) {
            res.status(400).send({
                status: 0,
                message: 'Please add discription to product'
            });
        } else if (!req.body.price) {
            res.status(400).send({
                status: 0,
                message: 'Please add price to product'
            });
        } else if (!req.body.category) {
            res.status(400).send({
                status: 0,
                message: 'Please add category to product'
            });
        } else {

            if (req.file) {
                productImage = req.file.path,
                productCoverImage = req.file.path
            }


            const product = await Product();
            product.name = req.body.name;
            product.discription = req.body.discription;
            product.price = req.body.price;
            product.category = req.body.category;
            product.productImage = (req.file ? req.file.path : req.body.productImage);
            product.productCoverImage = (req.file ? req.file.path : req.body.productCoverImage);
            product.user = req.user._id;


            const addProduct = await product.save();

            if (addProduct) {
                res.status(200).send({
                    status: 1,
                    message: 'Product Added Successfully'
                })
            } else {
                res.status(404).send({
                    status: 0,
                    message: 'Something Went Wrong'
                })
            }
            // res.status(200).json(Add_product)
        }
    } catch (err) {
        res.status(500).send({
            status: 0,
            message: err.message + "error in catch handler"
        });
    }
}

//Get All Products
const allProducts = async (req, res) => {
    try {

        const resultPerPage = 5;
        const productCount = await Product.countDocuments();

        const apiFeature = new ApiFeatures(Product.find({ userId: req.userId }), req.query).search().filter().pagination(resultPerPage);
        // const allproducts = await Product.find({ userId: req.userId });
        const allproducts = await apiFeature.query;
        res.status(200).send({
            status: 1,
            message: 'Success',
            Products: allproducts,
            productCount
        });
    }
    catch (error) {
        res.status(400).send({
            sattus: 0,
            message: error.message + ': error in catch statement'
        })
    }

}

//Get Product Details
const productDetail = async (req, res) => {
    try {
        const productdetail = await Product.findById({ _id: req.body._id })
        if (productdetail) {
            console.log(productdetail);
            res.status(200).send({
                status: 1,
                productdetail
            });
        }
        else {
            res.status(400).send({
                status: 0,
                message: 'Product not found'
            })
        }
    }
    catch (error) {
        res.status(400).send({
            sattus: 0,
            message: error.message + ': error in catch statement'
        })
    }
}

//Update Product --Admin
const updateProduct = async (req, res) => {
    try {

        if (req.file) {
            productImage = req.file.path
        }
        const updateproduct = await Product.findById({ _id: req.body._id })
        // updateproduct.name = req.body.name,
        // updateproduct.discription = req.body.discription,
        updateproduct.price = req.body.price,
            updateproduct.category = req.body.category,
            updateproduct.productImage = (req.file ? req.file.path : req.body.productImage);

        const updatedproduct = await updateproduct.save();

        if (updatedproduct) {
            res.status(200).send({
                status: 1,
                message: 'Product updated successfully.'
            });
        }
        else {
            res.status(400).send({
                status: 0,
                message: 'Something went wrong.'
            });
        }
    }
    catch (error) {
        res.status(400).send({
            status: 0,
            message: error.message + "catch error"
        })
    }
}

//Delete Products
const deleteProduct = async (req, res) => {
    try {
        const deleteproduct = await Product.findByIdAndDelete({ _id: req.body._id })
        if (deleteproduct) {
            res.status(200).send({
                status: 1,
                message: 'Product deleted successfully.'
            });
        }
        else {
            res.status(400).send({
                status: 0,
                message: 'Something went wrong.'
            });
        }
    }
    catch (error) {
        res.status(400).send({
            status: 0,
            message: error.message + "Something went wrong in Catch"
        })
    }
}



//Create a new review or update review
const createProductReview = async (req, res) => {
    try {
        // const review = await Product.findByIdAndDelete({ _id: req.body._id })
        // if (deleteproduct) {
        //     res.status(200).send({
        //         status: 1,
        //         message: 'Product deleted successfully.'
        //     });
        // }
        // else {
        //     res.status(400).send({
        //         status: 0,
        //         message: 'Something went wrong.'
        //     });
        // }


        const { rating, comment } = req.body

        const product = await Product.findById({ _id: req.body._id })

        if (product) {
            const alreadyReviewed = product.reviews.find(
                (reviews) => reviews.user.toString() === req.user._id.toString()
            )

            if (alreadyReviewed) {
                return res.status(400).send({
                    status: 0,
                    message: 'Product already reviewed'
                })
            }

            const review = {
                name: req.user.name,
                rating: Number(rating),
                comment,
                user: req.user._id,
            }
            console.log(review);

            product.reviews.push(review)

            product.numOfReviews = product.reviews.length

            product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

            await product.save()
            return res.status(201).send({
                status: 1,
                message: 'Review added'
            })
        }
        else {
            return res.status(404).send({
                status: 0,
                message: 'Product not found'
            })
        }
    }
    catch (error) {
        return res.status(400).send({
            status: 0,
            message: error.message + "Something went wrong in Catch"
        })
    }
}

//Get all Reviews of Each Product
const getReviews = async (req, res) => {
    try {
        const product = await Product.findById(req.body._id)
        if (!product) {
            res.status(404).send({
                status: 0,
                message: 'Product not found',
            })
        }
        else {
            res.status(200).send({
                status: 1,
                success: true,
                reviews: product.reviews,
            })
        }
    }
    catch (error) {
        return res.status(400).send({
            status: 0,
            message: error.message + "Something went wrong in Catch"
        })
    }
}



//Delete Review
const deleteReview = async (req, res) => {
    try {
        const product = await Product.findById(req.body.productId)
        if (!product) {
            res.status(404).send({
                status: 0,
                message: 'Product not found',
            })
        }
        else {

            // const review = await product.reviews.findById(req.body._id)
            // if (!review) {
            //     res.status(404).send({
            //         status: 0,
            //         message: 'Review not found',
            //     })
            // }
            // else {
                const reviews = await product.reviews.filter(
                    (rev) => rev._id.toString() !== req.body._id.toString()
                )

                let avg = 0;
                reviews.forEach((rev) => {
                    avg += rev.rating
                });
                
                // const ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length
                const ratings = avg / reviews.length;
                const numOfReviews = reviews.length;

                await Product.findByIdAndUpdate(
                    req.body.productId,
                    {
                        reviews,
                        ratings,
                        numOfReviews,
                    },
                    {
                        new: true,
                        runValidators: true,
                        useFindAndModify: false,
                    }
                )
                console.log(product);


                res.status(200).send({
                    status: 1,
                    success: true,
                    message: 'Review Deleted successfully.',

                })
            // }
        }
    }
    catch (error) {
        return res.status(400).send({
            status: 0,
            message: error.message + "Something went wrong in Catch"
        })
    }
}


module.exports = {
    getAllProducts,
    createProduct,
    allProducts,
    updateProduct,
    deleteProduct,
    productDetail,
    createProductReview,
    getReviews,
    deleteReview
}