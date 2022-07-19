const Product = require('../moddles/Product')
const User = require('../moddles/User')
const ApiFeatures = require('../utils/apiFeatures')


//Get User Detail Logged In
const GetUserDetail = async (req, res) => {
    // console.log(req.body);
    try {

        const user = await User.findById(req.user._id)
        res.status(200).send({
            status: 1,
            message: 'User Data GET Successfully',
            user
        })
    } catch (err) {
        res.status(500).send({
            status: 0,
            message: err.message + "error in catch handler"
        });
    }
}


//Update User Detail
const UpdateUserDetail = async (req, res) => {
    // console.log(req.body);
    try {

        if (req.file) {
            profilePicture = req.file.path
        }

        // const updateuser = await User.findById(req.user._id)

        // updateuser.name = req.body.name,
        //     // updateuser.email = req.body.email,
        //     updateuser.profilePicture = (req.file ? req.file.path : req.body.profilePicture)

        const updateuser = {
            name : req.body.name,
            // updateuser.email = req.body.email,
            profilePicture : (req.file ? req.file.path : req.body.profilePicture)
        }

        const newuser = await User.findByIdAndUpdate({_id: req.user._id }, updateuser, { new: true } )
        // const newuser = await updateuser.save();

        
        // await newuser.save()
        if (newuser) {
            res.status(200).send({
                status: 1,
                message: 'User Data Updated Successfully',
                data: newuser
            })
        }
        else {
            res.status(400).send({
                status: 0,
                message: 'User Data is not Updated yet',
            })
        }
        console.log(newuser.name);
    }
    catch (err) {
        res.status(500).send({
            status: 0,
            message: err.message + "error in catch handler"
        });
    }
}



//Get All Users --Admin
const GetAllUsers = async (req, res) => {
    // console.log(req.body);
    try {

        const users = await User.find()
        res.status(200).send({
            status: 1,
            message: 'All User Data GET',
            users
        })
    } catch (err) {
        res.status(500).send({
            status: 0,
            message: err.message + "error in catch handler"
        });
    }
}



//Get User Data --Admin
const GetUserData = async (req, res) => {
    // console.log(req.body);
    try {

        const user = await User.findById({ _id: req.body._id })

        if (user) {
            res.status(200).send({
                status: 1,
                message: 'User Data GET',
                user
            })
        }
        else {
            res.status(400).send({
                status: 0,
                message: 'User Not Found',
            })
        }
    } catch (err) {
        res.status(500).send({
            status: 0,
            message: err.message + "error in catch handler"
        });
    }
}


//Update User Role --Admin
const UpdateUserRole = async (req, res) => {
    // console.log(req.body);
    try {
        const updateuser = await User.findById({ _id: req.body._id })

        updateuser.role = req.body.role

        const updatedUser = await updateuser.save();

        if (updatedUser) {
            res.status(200).send({
                status: 1,
                message: 'User Data Updated Successfully',
                data: updatedUser.role
            })
        }
        else {
            res.status(400).send({
                status: 0,
                message: 'User Data is not Updated yet',
            })
        }

    } catch (err) {
        res.status(500).send({
            status: 0,
            message: err.message + "error in catch handler"
        });
    }
}


//Delete User --Admin
const DeleteUser = async (req, res) => {
    try {
        const user = await User.findById({ _id: req.body._id })



        if (!user) {
            res.status(400).send({
                status: 0,
                message: 'User Not Found',
            })
        }
        else {
            res.status(200).send({
                status: 1,
                message: 'User Deleted successfully',
            })
        }

        await user.remove()

    } catch (err) {
        res.status(500).send({
            status: 0,
            message: err.message + "error in catch handler"
        });
    }
}



module.exports = {
    GetUserDetail,
    UpdateUserDetail,
    GetAllUsers,
    GetUserData,
    UpdateUserRole,
    DeleteUser
}