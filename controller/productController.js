const Product = require("../models/product");
const CustomError = require("../utils/CustomError");
const asyncHandler = require("../utils/asyncHandler");
const WhereClause = require("../utils/whereClause");

exports.addProduct = asyncHandler(async (req, res) => {
  //images part
  const imageArrays = [];

  if (!req.files) {
    return next(new CustomError("Product image is not found!", 401));
  }

  if (req.files) {
    for (let i = 0; i < req.files.photos.length; i++) {
      let result = await cloudinary.v2.uploader.upload(
        req.files.photos[i].tempFilePath,
        {
          folder: "products",
        }
      );

      imageArrays.push({
        id: result.public_id,
        secure_url: result.secure_url,
      });
    }
  }
  req.body.photo = imageArrays;
  req.body.user = req.user.id;

  const newProduct = new Product(req.body);
  newProduct.save();
  res.status(200).json({
    success: true,
    newProduct,
  });
});

exports.getAllproduct = asyncHandler(async (req, res) => {
  const resultperPage = 4;
  const totalProductCount = await Product.countDocuments();

  const productsObj = new WhereClause(Product.find(), req.query)
    .search()
    .filter();
  let products = productsObj.base;
  const filteredProduct = productsObj.length;

  // productObj.limit().skip()

  productsObj.pager(resultperPage);
  products = await productsObj.base.clone();

  res.status(200).json({
    success: true,
    products,
    filteredProduct,
    totalProductCount,
  });
});

exports.getOneproduct = async (req, res, next) => {
  const singleProduct = await Product.findById(req.params.id);

  if (!singleProduct) {
    return next(new CustomError("Product not found!", 401));
  }

  res.status(200).json({
    success: true,
    singleProduct,
  });
};

exports.addReview = asyncHandler(async (req, res) => {
  const { comment, rating, productId } = req.body;
  const reviews = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  const alreadyReview = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (!alreadyReview) {
    product.reviews.push(reviews);
    product.numOfReviews = product.reviews.length;
  } else {
    product.reviews.map((rev) => {
      if (rev.user.toString() === req.user._id.toString()) {
        rev.comment = comment;
        rev.rating = rating;
      }
    });
  }

  product.rating =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  await product.save({ validatorBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

exports.deleteReview = asyncHandler(async (req, res) => {
  const { productId } = req.query;
  const product = await Product.findById(productId);
  const reviews = product.reviews.filter((rev) => {
    rev.user.toString() === req.user._id.toString();
  });

  const numOfReviews = reviews.length;
  const ratings =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  await Product.findByIdAndUpdate(
    productId,
    {
      reviews,
      numOfReviews,
      ratings,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});

exports.getOnlyOneReviews = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

// admin routes
exports.adminAllproduct = asyncHandler(async (req, res) => {
  const products = await Product.find();
  res.status(200).json({
    success: true,
    products,
  });
});

exports.adminUpdateproduct = async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new CustomError("Product not found!", 401));
  }

  if (req.files) {
    // destroy old img
    let imgArray;
    for (let i = 0; i < product.photos.length; i++) {
      const res = await cloudinary.v2.uploader.destroy(product.photos[i].id);
    }
    // upload and save img
    for (let i = 0; i < req.files.photos.length; i++) {
      const result = await cloudinary.v2.uploader.upload(
        req.files.photo[i].tempFilePath,
        {
          folder: "products",
        }
      );

      imageArrays.push({
        id: result.public_id,
        secure_url: result.secure_url,
      });
    }
  }
  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
    updatedProduct,
  });
};

exports.adminDeleteproduct = async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new CustomError("Product not found to delete!", 401));
  }

  for (let i = 0; i < product.photo.length; i++) {
    await cloudinary.v2.uploader.destroy(product.photo[i].id);
  }

  await product.remove();

  res.status(200).json({
    success: true,
  });
};
