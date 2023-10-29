import express from "express";

import {
  createProductController,
  getProductController,
  getSingleProductController,
  productPhotoController,
  deleteProductController,
  updateProductController,
  productCategoryController,
  realtedProductController,
  braintreeTokenController,
  brainTreePaymentController

} from "../controllers/productController.js";

import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import formidable from "express-formidable";
const router = express.Router();


//routes
//create product
router.post("/create-product", requireSignIn, isAdmin, formidable(), createProductController);

//get all product without photo
router.get("/get-product", getProductController);

//get single product without photo
router.get("/get-product/:pid", getSingleProductController);

//get photo
router.get('/product-photo/:pid', productPhotoController)

//delete product
router.delete("/delete-product/:pid", deleteProductController);

//update product
router.put("/update-product/:pid",requireSignIn,isAdmin,formidable(),updateProductController);

//category wise product
router.get("/product-category/:slug", productCategoryController);

//similar product
router.get("/related-product/:pid/:cid", realtedProductController);

//payments routes
//token
router.get("/braintree/token", braintreeTokenController);

//payments
router.post("/braintree/payment", requireSignIn, brainTreePaymentController);

export default router;