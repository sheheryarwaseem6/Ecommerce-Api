const router = require('express').Router()

const { upload } = require('../../middleware/multer')
const { verifyToken } = require('../../middleware/Authentication')

const { register, login, verifyUser, logOut, resendCode, forgotPassword, verifyCode, resetPassword, updatePassword } = require('../../controller/AuthController')
const { getAllProducts, createProduct, allProducts, updateProduct, deleteProduct, productDetail, createProductReview, getReviews, deleteReview } = require('../../controller/productController')
const { authorizeRoles } = require('../../middleware/authorizeRoles')
const { GetUserDetail, UpdateUserDetail, GetAllUsers, GetUserData, UpdateUserRole, DeleteUser } = require('../../controller/UserController')
const { newOrder, getSingleOrder, myOrder, allOrder, updateOrderStatus, deleteOrder } = require('../../controller/OrderController')



//Authentication
router.post('/register', upload.single('profilePicture'), register)
router.post('/verifyUser', verifyUser)
router.post('/resendCode', resendCode)
router.post('/login', login)
router.post('/forgotPassword', forgotPassword)
router.post('/verifyCode', verifyCode)
router.post('/resetPassword', resetPassword)
router.post('/updatePassword', updatePassword)
router.get('/logOut', verifyToken, logOut)


router.get('/getAllProducts', getAllProducts)

//Products
router.post('/addProduct', verifyToken, authorizeRoles("admin"), upload.single('productImage','productCoverImage'), createProduct)
router.get('/allProducts', verifyToken, allProducts)
router.put('/updateProduct', verifyToken, authorizeRoles("admin"), upload.single('productImage'), updateProduct)
router.delete('/deleteProduct', verifyToken, authorizeRoles("admin"), deleteProduct)


//Review
router.post('/createProductReview', verifyToken, createProductReview)
router.get('/getReviews', verifyToken, getReviews)
router.delete('/deleteReview', verifyToken, deleteReview)

//Get detail of each product by id
router.get('/productDetail', verifyToken, productDetail)





// User Controller
router.get('/userDetail', upload.single('profilePicture'), verifyToken, GetUserDetail)
router.post('/updateUser', verifyToken, UpdateUserDetail)
router.get('/getallusers', verifyToken, authorizeRoles("admin"), GetAllUsers)
router.get('/getuserdata', verifyToken, authorizeRoles("admin"), GetUserData)
router.put('/UpdateUserRole', verifyToken, authorizeRoles("admin"), UpdateUserRole)
router.delete('/DeleteUser', verifyToken, authorizeRoles("admin"), DeleteUser)







//Order Controller
router.post('/newOrder', verifyToken, newOrder)
router.get('/getSingleOrder', verifyToken, getSingleOrder)
router.get('/myOrder', verifyToken, myOrder)
router.get('/allOrder', verifyToken, authorizeRoles("admin"), allOrder)
router.put('/updateOrderStatus', verifyToken, authorizeRoles("admin"), updateOrderStatus)
router.delete('/deleteOrder', verifyToken, authorizeRoles("admin"), deleteOrder)



module.exports = router;