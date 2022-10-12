const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please enter product name"],
    trim: true,
    maxlength: [100, "product name can not exceed 100  char"],
  },
  price: {
    type: Number,
    required: [true, "please enter product price"],

    maxlength: [5, "product price can not exceed 5  char"],
    default: 0.0,
  },
  description: {
    type: String,
    required: [true, "please enter product description"],
  },
  ratings: {
    type: Number,
    default: 0.0,
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: [true, "please select category for this product"],
    enum: {
      values: [
        "Electronics",
        "Headphones",
        "Accessories",
        "Cameras",
        "beauty",
        "cloths",
        "sports",
        "home",
        "Food",
        "Laptops",
      ],
      message: "please select valid categort",
    },
  },
  seller: {
    type: String,
    required: [true, "please enter product seller"],
  },
  stock: {
    type: Number,
    required: [true, "please enter product stock"],
    maxlength: [5, "products cannot exceed 5"],
    default: 0,
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "please enter user "],
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("product", productSchema);
