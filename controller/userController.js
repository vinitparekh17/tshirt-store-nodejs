const User = require('../models/user');
const cookieToken = require('../utils/cookieToken');
const CustomError = require('../utils/CustomError');
const cloudinary = require('cloudinary');
const crypto = require('crypto');
const mailer = require('../utils/emailHelper');

exports.signup = async (req, res, next) => {
    try {
        let pic
        if (req.files) {
            let file = req.files.photo
            pic = await cloudinary.v2.uploader.upload(file.tempFilePath, {
                folder: "users",
                width: 150,
                crop: "scale"
            })
        }

        const { email, name, password } = req.body
        if (!(email || !name || !password)) {
            return next(new CustomError('All fields must be required!', 400))
        }

        const newUser = await User.create({
            userName: name,
            email: email,
            password: password,
            photo: {
                id: pic.public_id,
                secure_url: pic.secure_url
            }
        })

        cookieToken(newUser, res)

    } catch (error) {
        console.log(error);
    }
}

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return next(new CustomError('All fields are mendetory to fill!', 400))
        }

        const existUser = await User.findOne({ email }).select("+password")

        if (!existUser) {
            return next(new CustomError('User does not exist , Register before login!', 400))
        }

        const isValid = existUser.validatePassword(password)

        if (!isValid) {
            return next(new CustomError('Invalid credentials!', 400))
        }

        cookieToken(existUser, res)

    } catch (error) {
        console.log(error);
    }
}

exports.logout = async (req, res, next) => {
    try {
        res.cookie('token', null, {
            expires: new Date(Date.now()),
            httpOnly: true
        })

        res.status(200).json({
            success: true,
            message: "Logout successed"
        })
    } catch (e) {
        console.log(e);
    }
}

exports.forgotpassword = async (req, res, next) => {
    try {
        const { email } = req.body
        // return console.log(req.body);
        const existUser = await User.findOne({ email })
        if (!existUser) {
            return next(new CustomError("This email doen't exist", 404))
        }
        const forgotToken = existUser.getForgotPassword()
        await existUser.save({ validateBeforeSave: false })
        // req.protocol is used to get weather you are using http or https 
        const url = `${req.protocol}://${req.get("host")}/api/v1/passward/reset/${forgotToken}`

        const msg = `Click here to change your password! \n\n<center><a href="${url}" ><button>FORGOT PASSWORD</button></a><center>`

        try {
            await mailer({
                email: existUser.email,
                subject: "Vinit parekh reset password email",
                message: msg
            })
            res.status(200).json({
                success: true,
                message: "Email sent successfully!"
            })
        } catch (error) {
            existUser.forgotPasswordToken = undefined
            existUser.forgotPasswordExpiry = undefined
            await existUser.save({ validateBeforeSave: true })
            return next(new CustomError(error.message, 500))
        }
    } catch (e) {
        console.log(e);
    }

}
exports.passwordReset = async (req, res, next) => {
    try {
        const token = req.params.token
        const encryptedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex")
        // $gt is the classic mongodb query with refers to greater then 
        const foundUser = await User.findOne({
            encryptedToken,
            forgotPasswordExpiry: {
                $gt: Date.now()
            }
        }).select("+password")
        if (!foundUser) {
            return next(new CustomError("Forgot password link is expired or invalid!", 404))
        }

        // in forgot password page field user has to write a password  twice which will be named below 
        const { password, confirmPassword } = req.body
        if (password !== confirmPassword) {
            return next(new CustomError("Password and Confirm Password doesn's matched!", 404))
        }
        foundUser.password = confirmPassword
        // clearing used tokens
        foundUser.forgotPasswordExpiry = undefined
        foundUser.forgotPasswordToken = undefined
        await foundUser.save()

        cookieToken(foundUser, res)
    } catch (error) {
        console.log(error);
    }
}

exports.userprofile = async (req, res, next) => {
    try {
        const loggedUser = await User.findById(req.user.id)
        res.status(200).json({
            success: true,
            loggedUser,
        })
    } catch (error) {
        console.log(error);
    }
}

exports.changePassword = async (req, res, next) => {
    try {
        const userId = req.user.id
        const existUser = await User.findById(userId).select("+password")
        existUser.
            console.log(existUser);
        const { oldPassword, newPassword, confirmPassword } = req.body
        const isCorrectPassword = await existUser.validatePassword(oldPassword)

        if (!isCorrectPassword) {
            return next(new CustomError("Password does not matched!", 400))
        }

        if (newPassword !== confirmPassword) {
            return next(new CustomError("Password and Confirm Password doesn's matched!", 404))
        }

        existUser.passward = confirmPassword
        await existUser.save()

        cookieToken(existUser, res)
    } catch (error) {
        console.log(error);
    }
}

exports.updateDetails = async (req, res, next) => {
    const id = req.user.id
    const newUser = {
        userName: req.body.name,
        email: req.body.email
    }

    if (req.files.photo !== '') {
        const imageId = user.photo.id
        await cloudinary.v2.uploader.destroy(imageId)

        let file = req.files.photo
        const result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
            folder: "users",
            width: 150,
            crop: "scale"
        })

        newUser.photo = {
            id: result.public_id,
            secure_url: result.secure_url
        }
    }

    const user = await User.findByIdAndUpdate(id, newUser, {
        new: true,
        runValidators: true,
        userFindAndModify: false
    })

    user.save()

    res.status(200).json({
        success: true,
    })
}

exports.adminUsers = async (req, res, next) => {
    try {
        const userList = await User.find()
        res.status(200).json({
            success: true,
            userList
        })
    } catch (error) {
        console.log(error);
    }
}

exports.adminOneUsers = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user) {
            return next(new CustomError('User not found', 404))
        }

        res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        console.log(error);
    }
}

exports.adminUpdateOneUser = async (req, res, next) => {
    try {
        const newUser = {
            name: req.body.name,
            email: req.body.email,
            role: req.body.role
        }
        const user = await User.findByIdAndUpdate(req.params.id, newUser, {
            new: true,
            runValidators: true,
            userFindAndModify: false
        })

        res.status(200).json({
            success: true,
            user
        })

    } catch (error) {
        console.log(error);
    }
}

exports.adminDeleteOneUser = async (req, res, next) => {
    try {
        const findUser = await User.findById(req.params.id)
        if (!findUser) {
            return next(new CustomError("User is not found!", 400))
        }
        // deleting user image 
        await cloudinary.v2.uploader.destroy(user.photo.id)
        // deleting user itself from db
        await User.deleteOne(findUser)

        res.status(200).json({
            success: true
        })

    } catch (error) {
        console.log(error);
    }
}

exports.managerUsers = async (req, res, next) => {
    try {
        const userList = await User.find({ role: 'user' })
        res.status(200).json({
            success: true,
            userList
        })
    } catch (error) {
        console.log(error);
    }
}

exports.admin