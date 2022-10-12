const express = require("express");
const router = express.Router();

const {
  getProduct,
  newProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const { isAuthonticatedUser, authorizedRoles } = require("../middlewares/auth");

router.route("/product/:id").get(getSingleProduct);

router.route("/admin/products/new").post(newProduct);

router
  .route("/products")
  .get(isAuthonticatedUser, authorizedRoles("Admin"), getProduct);
router
  .route("/admin/products/:id")
  .put(isAuthonticatedUser, authorizedRoles("Admin"), updateProduct)
  .delete(isAuthonticatedUser, authorizedRoles("Admin"), deleteProduct);

module.exports = router;
