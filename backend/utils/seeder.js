const Product = require("../models/product");
const dotenv = require("dotenv");
const connectDatabase = require("../config/database");

const products = require("../data/product.json");

//setting dotenv file

dotenv.config({ path: "backend/config/config.env" });
connectDatabase();

const seedproducts = async () => {
  try {
    await Product.deleteMany();
    console.log("products are deleted successfully");
    await Product.insertMany(products);
    console.log("products are inserted successfully");
    process.exit();
  } catch (err) {
    console.log(err.message);
    process.exit();
  }
};
seedproducts();
