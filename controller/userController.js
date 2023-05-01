const User = require("../models/user");
const cookieToken = require("../utils/CookieToken");
const CustomError = require("../utils/CustomError");
const crypto = require("crypto");
const mailer = require("../utils/emailHelper");
const asyncHandler = require("../utils/asyncHandler");

exports.signup = asyncHandler(async (req, res) => {
  const { email, name, password } = req.body;
  if (!(email || !name || !password)) {
    throw new CustomError("All fields must be required!", 400);
  }

  const newUser = await User.create({
    userName: name,
    email: email,
    password: password,
  });

  cookieToken(newUser, res);
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomError("All fields are mandatory to fill!", 400);
  }

  const existUser = await User.findOne({ email }).select("+password");

  if (!existUser) {
    throw new CustomError("User does not exist , Register before login!", 400);
  }

  const isValid = await existUser.validatePassword(password);

  if (!isValid) {
    throw new CustomError("Invalid credentials!", 400);
  }

  cookieToken(existUser, res);
});

exports.logout = asyncHandler(async (req, res) => {
  console.log("hello");
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logout successes",
  });
});

exports.forgotpassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  // return console.log(req.body);
  const existUser = await User.findOne({ email });
  if (!existUser) {
    throw new CustomError("This email doesn't exist", 404);
  }
  const forgotToken = existUser.getForgotPassword();
  await existUser.save({ validateBeforeSave: false });
  // req.protocol is used to get weather you are using http or https
  const url = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/passward/reset/${forgotToken}`;

  const msg = `Click here to change your password! \n\n<center><a href="${url}" ><button>FORGOT PASSWORD</button></a><center>`;

  try {
    await mailer({
      email: existUser.email,
      subject: "Vinit parekh reset password email",
      message: msg,
    });
    res.status(200).json({
      success: true,
      message: "Email sent successfully!",
    });
  } catch (error) {
    existUser.forgotPasswordToken = undefined;
    existUser.forgotPasswordExpiry = undefined;
    await existUser.save({ validateBeforeSave: true });
    return next(new CustomError(error.message, 500));
  }
});

exports.passwordReset = asyncHandler(async (req, res) => {
  const token = req.params.token;
  const encryptedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  // $gt is the classic mongodb query with refers to greater then
  const foundUser = await User.findOne({
    encryptedToken,
    forgotPasswordExpiry: {
      $gt: Date.now(),
    },
  }).select("+password");
  if (!foundUser) {
    throw new CustomError("Forgot password link is expired or invalid!", 404);
  }

  // in forgot password page field user has to write a password  twice which will be named below
  const { password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    throw new CustomError(
      "Password and Confirm Password doesn's matched!",
      404
    );
  }
  foundUser.password = confirmPassword;
  // clearing used tokens
  foundUser.forgotPasswordExpiry = undefined;
  foundUser.forgotPasswordToken = undefined;
  await foundUser.save();

  cookieToken(foundUser, res);
});

exports.userprofile = asyncHandler(async (req, res) => {
  const loggedUser = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    loggedUser,
  });
});

exports.changePassword = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const existUser = await User.findById(userId).select("+password");
  existUser.console.log(existUser);
  const { oldPassword, newPassword, confirmPassword } = req.body;
  const isCorrectPassword = await existUser.validatePassword(oldPassword);

  if (!isCorrectPassword) {
    throw new CustomError("Password does not matched!", 400);
  }

  if (newPassword !== confirmPassword) {
    throw new CustomError(
      "Password and Confirm Password doesn't matched!",
      404
    );
  }

  existUser.password = confirmPassword;
  await existUser.save();

  cookieToken(existUser, res);
});

exports.updateDetails = asyncHandler(async (req, res) => {
  const id = req.user.id;
  const newUser = {
    userName: req.body.name,
    email: req.body.email,
  };

  if (req.files.photo !== "") {
    const imageId = user.photo.id;
    await cloudinary.v2.uploader.destroy(imageId);

    let file = req.files.photo;
    const result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
      folder: "users",
      width: 150,
      crop: "scale",
    });

    newUser.photo = {
      id: result.public_id,
      secure_url: result.secure_url,
    };
  }

  const user = await User.findByIdAndUpdate(id, newUser, {
    new: true,
    runValidators: true,
    userFindAndModify: false,
  });

  user.save();

  res.status(200).json({
    success: true,
  });
});

exports.adminUsers = asyncHandler(async (req, res) => {
  const userList = await User.find();
  res.status(200).json({
    success: true,
    userList,
  });
});

exports.adminOneUsers = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new CustomError("User not found", 404);
  }

  res.status(200).json({
    success: true,
    user,
  });
});

exports.adminUpdateOneUser = asyncHandler(async (req, res) => {
  const newUser = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };
  const user = await User.findByIdAndUpdate(req.params.id, newUser, {
    new: true,
    runValidators: true,
    userFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    user,
  });
});

exports.adminDeleteOneUser = asyncHandler(async (req, res) => {
  const findUser = await User.findById(req.params.id);
  if (!findUser) {
    throw new CustomError("User is not found!", 400);
  }
  // deleting user image
  await cloudinary.v2.uploader.destroy(user.photo.id);
  // deleting user itself from db
  await User.deleteOne(findUser);

  res.status(200).json({
    success: true,
  });
});

exports.managerUsers = asyncHandler(async (req, res) => {
  const userList = await User.find({ role: "user" });
  res.status(200).json({
    success: true,
    userList,
  });
});

exports.admin;
