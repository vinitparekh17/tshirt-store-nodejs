const { Schema, model } = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
require("dotenv").config();
const { JWT_SECRET, JWT_EXPIRY } = process.env;

const userSchema = new Schema({
  userName: {
    type: String,
    required: [true, "Username must be provided!"],
    maxLength: [40, "Name must be less then 40 characters!"],
  },

  email: {
    type: String,
    required: [true, "Email must be provided!"],
    validate: [validator.isEmail, "Invalid email is not allowed!"],
    unique: true,
  },

  password: {
    type: String,
    required: [true, "Password must be provided!"],
    minlength: [8, "Password must be minimum 8 characters long"],
    select: false,
  },

  role: {
    type: String,
    default: "user",
  },

  forgotPasswordToken: {
    type: String,
  },

  forgotPasswordExpiry: {
    type: String,
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },

  photo: {
    id: {
      type: String,
    },
    secure_url: {
      type: String,
    },
  },
});

//encrypt password before saving it
userSchema.pre("save", async function (next) {
  // if password is not modified then go next else bcrypt it
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// checking password with database password while login
userSchema.methods.validatePassword = async function (usersAndPassward) {
  return await bcrypt.compare(usersAndPassward, this.password);
};

// create and return jwt token
userSchema.methods.getjwtToken = function () {
  return jwt.sign({ id: this._id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRY,
  });
};

// generate forget password token
userSchema.methods.getForgotPassword = function () {
  const forgotToken = crypto.randomBytes(20).toString("hex");
  // getting a hash - make sure to get it on backend
  this.forgotPasswordToken = crypto
    .createHash("sha256")
    .update(forgotToken)
    .digest("hex");

  //time to expire the token
  // 10 min expire
  this.forgotPasswordExpiry = Date.now() + 10 * 60 * 1000;
  return forgotToken;
};

module.exports = model("Euser", userSchema);
