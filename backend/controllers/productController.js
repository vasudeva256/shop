const Product = require("../models/product");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const APIFeatures = require("../utils/apiFeatures");
const product = require("../models/product");

//create new product =>  /api/v1/products/new
exports.newProduct = catchAsyncErrors(async (req, res, next) => {
  req.body.user = req.user.id;

  const product = await Product.create(req.body);
  res.status(201).json({
    sucess: true,
    product,
  });
});

//create all products =>  /api/v1/products/products
exports.getProduct = catchAsyncErrors(async (req, res, next) => {
  const resPerPage = 4;
  const productCount = await Product.countDocuments();
  const apiFeatures = new APIFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resPerPage);
  const products = await apiFeatures.query;
  res.status(200).json({
    sucess: true,
    count: products.length,
    products,
    productCount,
    message: "This route will show all products in database",
  });
});

//get single product details   =>/api/v1/products/:id

exports.getSingleProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("product not found 🤦‍♂️", 404));
  } else {
    return res.status(200).json({
      sucess: true,
      product,
    });
  }
});

//update product => /api/v1/products/:id

exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("product not found 🤦‍♂️", 404));
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    sucess: true,
    message: "Product updated",
    product,
  });
});

//delete product => /api/v1/products/:id

exports.deleteProduct = catchAsyncErrors(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("product not found 🤦‍♂️", 404));
  }
  await Product.deleteOne({ _id: req.params.id });
  res.status(202).json({ sucess: true, message: "Product deleted" });
});
