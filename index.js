const app = require("./app");
const { config } = require("./config");
const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: config.CLOUD_NAME,
  api_key: config.CLOUD_KEY,
  api_secret: config.CLOUD_SECRET,
});
app.listen(config.PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
