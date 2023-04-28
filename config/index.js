require("dotenv").config();

exports.config = {
  PORT,
  JWT_SECRET,
  JWT_EXPIRY,
  MONGO_URI,
  CLOUD_NAME,
  CLOUD_KEY,
  CLOUD_SECRET,
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  STRIPE_KEY,
  RAZORPAY_KEY,
  RAZORPAY_SECRET,
  LOCAL_URL,
  PROD_URL,
} = process.env;
