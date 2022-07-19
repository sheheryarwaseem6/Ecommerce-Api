const User = require('../moddles/User')
const {hash} = require('bcrypt')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const {sendEmail} = require('../config/mailer')

//Register User 
const register = async (req, res) => {

    if (!req.body.name) {
        res.status(400).send({
            status: 0,
            message: 'name is required.'
        });
    }
    else if (!req.body.email) {
        res.status(400).send({
            status: 0,
            message: 'Email is required.'
        });
    }
    else if (!req.body.password) {
        res.status(400).send({
            status: 0,
            message: 'Password is required.'
        });
    }
    // else if (!req.body.phone_number) {
    //     res.status(400).send({
    //         status: 0,
    //         message: 'Phone Number is required.'
    //     });
    // }
    // else if (!req.body.user_image) {
    //     res.status(400).send({
    //         status: 0,
    //         message: 'Image is required.'
    //     });
    // }
    else {
        User.find({ email: req.body.email })
            .exec()
            .then(user => {
                if (user.length >= 1) {
                    res.status(400).send({
                        status: 0,
                        message: 'Email already exists!'
                    });
                }
                else {
                    bcrypt.hash(req.body.password, 10, (err, hash) => {
                        if (err) {
                            res.status(400).send({
                                status: 0,
                                message: err + ' password is incorrect!'
                            });
                        }
                        else {
                            
                            if(req.file){
                                profilePicture = req.file.path
                        } 

                            const verificationCode = Math.floor(100000 + Math.random() * 900000);

                            const user = new User;
                            user.name = req.body.name;
                            user.email = req.body.email;
                            user.password = hash;
                            // user.phone_number= req.body.phone_number;
                          user.profilePicture = (req.file ? req.file.path : req.body.profilePicture),
                            user.verification_code = verificationCode;
                            user.save()

                                .then(result => {
                                    sendEmail(user.email, verificationCode, "Email verification");

                                    return res.status(400).send({
                                        status: 1,
                                        message: 'User verification code successfully sent to email.',
                                        data: {
                                            user_id: result._id,
                                            user
                        
                                        }
                                    });
                                })
                                .catch(errr => {
                                    res.status(400).send({
                                        status: 0,
                                        message: errr
                                    });
                                });
                        }
                    });
                }
            })
            .catch(err => {
                res.status(400).send({
                    status: 0,
                    message: err
                });
            });
    }
}

//verify User
const verifyUser = async (req, res) => {
    if(!req.body.user_id){
        res.status(400).send({
            status: 0, 
            message: 'User id field is required' 
        });
    }
    else if(!req.body.verification_code){
        res.status(400).send({
            status: 0, 
            message: 'Verification code field is required' 
        });
    }
    else{
        User.find({ _id: req.body.user_id })
        .exec()
        .then(result => {
            if(!req.body.verification_code){
                res.status(400).send({
                    status: 0, 
                    message: 'Verification code is required.' 
                });
            }

            if(req.body.verification_code == result[0].verification_code){

                User.findByIdAndUpdate(req.body.user_id, { verified: 1, verification_code: null }, (err, _result) => {
                    if(err){
                        res.status(400).send({
                            status: 0, 
                            message: 'Something went wrong.' 
                        });
                    }
                    if(_result){
                        res.status(200).send({
                            status: 1, 
                            message: 'Otp matched successfully.' 
                        });
                    }
                });
            }
            else{
                res.status(200).send({
                    status: 0, 
                    message: 'Verification code did not matched.' 
                });
            }
        })
        .catch(err => {
            res.status(400).send({
                status: 0, 
                message: 'User not found' 
            });
        });
    }
}


/** Resend code */
const resendCode = async (req, res) => {
    if(!req.body.user_id){
        res.status(400).send({
            status: 0, 
            message: 'User id failed is required.' 
        });
    }
    else{
        User.find({ _id: req.body.user_id })
        .exec()
        .then(result => {
            const verificationCode = Math.floor(100000 + Math.random() * 900000);
    
            User.findByIdAndUpdate(req.body.user_id, { verified: 0, verification_code: verificationCode }, (err, _result) => {
                if(err){
                    res.status(400).send({
                        status: 0, 
                        message: 'Something went wrong.' 
                    });
                }
                if(_result){
                    sendEmail(result[0].email, verificationCode, "Verification Code Resend");
                    res.status(200).send({
                        status: 1, 
                        message: 'Verification code resend successfully.' 
                    });
                }
            });
        })
        .catch(err => {
            res.status(400).send({
                status: 0, 
                message: 'User not found' 
            });
        });
    }
}

//Login
const login = async (req, res) => {
    if (!req.body.email) {
        return res.status(400).send({
            status: 0,
            message: 'Email field is required.'
        });
    }
    else if (!req.body.password) {
        return res.status(400).send({
            status: 0,
            message: 'Password field is required.'
        });
    }
    else {
        User.find({ email: req.body.email })
            .exec()
            .then(user => {
                if (user.length < 1) {
                    return res.status(404).send({
                        status: 0,
                        message: 'Email not found!'
                    });
                }
                else {
                    bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                        if (err) {
                            return res.status(400).send({
                                status: 0,
                                message: 'Auth Failed'
                            });
                        }
                        if (result) {

                            if (user[0].is_verified == 0) {
                                return res.status(400).send({
                                    status: 0,
                                    message: 'Please verify your account.'
                                });

                            }
                            else {
                                const token = jwt.sign(
                                    {
                                        email: user[0].email,
                                        userId: user[0]._id
                                    },
                                    process.env.JWT_KEY,
                                    {
                                        expiresIn: '20hr'
                                    }
                                    );
                                  User.findOneAndUpdate({ user_authentication: token})
                                  .exec()
                                //  console.log(user[0].user_authentication);
                                    user[0].user_authentication = token
                                    user[0].save()
                                return res.status(200).send({
                                    status: 1,
                                    message: 'User logged in successfully!',
                                    token: token,
                                    data: user[0].email
                                });
                            }
                        }
                        return res.status(400).send({
                            status: 0,
                            message: 'Incorrect password.'
                        });
                    })
                }
            })
            .catch(err => {
                res.status(400).send({
                    status: 0,
                    message: err
                });
            });
    }
}


//Forgot Password
const forgotPassword = async (req, res) => {
    try {
        if (!req.body.email) {
            res.status(400).send({
                status: 0,
                message: 'Email field is required'
            });
        }
        else {
            User.findOne({ email: req.body.email })
                .exec()
                .then(user => {
                    if (user.length < 1) {
                        return res.status(404).send({
                            status: 0,
                            message: 'Email not found!'
                        });
                    }
                    else {
                        const verificationCode = Math.floor(100000 + Math.random() * 900000);

                        User.findByIdAndUpdate(user._id, { verification_code: verificationCode }, (err, _result) => {
                            if (err) {
                                res.status(400).send({
                                    status: 0,
                                    message: 'Something went wrong.'
                                });
                            }
                            if (_result) {
                                sendEmail(user.email, verificationCode, 'Forgot Password');
                                res.status(200).send({
                                    status: 1,
                                    message: 'Code successfully send to email.',
                                    data: {
                                        user_id: user._id,
                                        verification_code: verificationCode
                                    }
                                });
                            }
                        });
                    }
                })
                .catch(err => {
                    res.status(400).send({
                        status: 0,
                        message: 'User not found'
                    });
                });
        }
    }
    catch (err) {
        res.status(404).send({
            status: 0,
            message: 'error: ' + err.message})
    }
}

//Verify Code
const verifyCode = async (req, res) => {
    try {
        if (!req.body.user_id) {
            res.status(400).send({
                status: 0,
                message: 'User id field is required'
            });
        }
        else if (!req.body.verification_code) {
            res.status(400).send({
                status: 0,
                message: 'Verification code field is required'
            });
        }
        else {
            User.findOne({ _id: req.body.user_id })
                .exec()
                .then(result => {
                    if (!req.body.verification_code) {
                        res.status(400).send({
                            status: 0,
                            message: 'Verification code is required.'
                        });
                    }

                    if (req.body.verification_code == result.verification_code) {

                        User.findByIdAndUpdate(req.body.user_id, { verified: 1, verification_code: null }, (err, _result) => {
                            if (err) {
                                res.status(400).send({
                                    status: 0,
                                    message: 'Something went wrong.'
                                });
                            }
                            if (_result) {
                                res.status(200).send({
                                    status: 1,
                                    message: 'Otp matched successfully.'
                                });
                            }
                        });
                    }
                    else {
                        res.status(200).send({
                            status: 0,
                            message: 'Verification code did not matched.'
                        });
                    }
                })
                .catch(err => {
                    res.status(400).send({
                        status: 0,
                        message: 'User not found'
                    });
                });
        }
    }
    catch (err) {
        res.status(404).send({
            status: 0,
            message:'error: ' + err.message
        })
    }
}

//Reset Password
const resetPassword = async (req, res) => {
    try {
        if (!req.body.user_id) {
            res.status(400).send({
                status: 0,
                message: 'User id field is required.'
            });
        }
        else if (!req.body.new_password) {
            res.status(400).send({
                status: 0,
                message: 'New password field is required.'
            });
        }
        else {
            User.find({ _id: req.body.user_id })
                .exec()
                .then(user => {

                    bcrypt.hash(req.body.new_password, 10, (error, hash) => {
                        if (error) {
                            return res.status(400).send({
                                status: 0,
                                message: error
                            });
                        }
                        else {
                            User.findByIdAndUpdate(req.body.user_id, { password: hash }, (err, _result) => {
                                if (err) {
                                    res.status(400).send({
                                        status: 0,
                                        message: 'Something went wrong.'
                                    });
                                }
                                if (_result) {
                                    res.status(200).send({
                                        status: 1,
                                        message: 'Password updated successfully.'
                                    });
                                }
                            });
                        }
                    });
                })
                .catch(err => {
                    res.status(400).send({
                        status: 0,
                        message: 'catch Error: ' + err.message
                    });
                });
        }
    }
    catch (err) {
        res.status(404).send({
            status: 0,
            message: 'error: ' + err.message
        });
    }
}


//Update Password
const updatePassword = async (req, res) => {
    try {
        if (!req.body.password) {
            res.status(400).send({
                status: 0,
                message: 'Old password field is required.'
            });
        }
        else if (!req.body.new_password) {
            res.status(400).send({
                status: 0,
                message: 'New password field is required.'
            });
        }
        else {
            const user = await User.findOne({ _id: req.user._id })
            const isMatch = await bcrypt.compare(req.body.password, user.password)
            if (!isMatch) {
                res.status(400).send({
                    status: 0,
                    message: "Old password is incorrect"
                })
            }
            else {
                const hashedpassword = await bcrypt.hash(req.body.new_password, 10)
                const newUser = await User.findByIdAndUpdate({_id: req.user._id}, {password: hashedpassword})
                await newUser.save()

                res.status(200).send({
                    status: 1,
                    message:  newUser.email + " has been updated successfully"
                })
            }
        }
    }
    catch (err) {
        res.status(404).send({
            status: 0,
            message: 'error: ' + err.message
        })
    }
}




//LogOut
const logOut = async (req, res) => {
    try {
        // if (!req.body.user_id) {
        //     res.status(400).send({ status: 0, message: 'User ID field is required' });
        // }
        // else if (!req.headers.authorization) {
        //     res.status(400).send({ status: 0, message: 'Authentication Field is required' });
        // }

        // else {
            const updateUser = await User.findOneAndUpdate({ _id: req.user._id }, {
                user_authentication: null,
                user_device_type: null,
                user_device_token: null
            });
            res.status(200).send({ 
                status: 1, 
                message: 'User logout Successfully.',
                updateUser
            });
            // console.log(updateUser);
        // }
        
        // res.headers('tolen', 'none', {
        // httpOnly: true
        // })

        // return res.status(200).headers("token", null, {expires: new Date(Date.now()), httpOnly: true}).send({
        //     status: 1, 
        //     message: 'User logged Out successfully!', 
        //     data: {}
        //     // token: null
        // })

        // res.status(200).send({
        //     data: {}
        // })
    }
    catch (err) {
        res.status(500).send({
            status: 0,
            message: 'error: ' + err.message
        })
    }
}



module.exports = {
    register,
    verifyUser,
    resendCode,
    login,
    forgotPassword,
    verifyCode,
    resetPassword,
    updatePassword,
    logOut
}