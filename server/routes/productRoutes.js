import express from "express";
import  {
  checkoutProductController,
  createProductController,
  deleteProductController,
  getProductController,
  getSingleProductController,
  productCategoryController,
  productCountController,
  productFilterController,
  productPageController,
  productPhotoController,
  searchProductController,
  similarProductController,
  updateProductController,
} from "../controllers/productController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import ExpressFormidable from "express-formidable";
const router = express.Router();
//routes
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  ExpressFormidable(),
  createProductController
);
//update product
router.put(
  "/update-product/:pid",
  requireSignIn,
  isAdmin,
  ExpressFormidable(),
  updateProductController
);
//get products
router.get("/get-product", getProductController)
//single product
router.get("/get-product/:slug", getSingleProductController)
//get photo
router.get("/product-photo/:pid", productPhotoController)
//delete product pid means productId shortcut
router.delete("/del-product/:pid", deleteProductController)
//filter product
router.post('/product-filter', productFilterController)
//product count
router.get('/get-product-count', productCountController)
//product per page
router.get("/product-list/:page", productPageController);
//search product 
router.get('/search-product/:keyword', searchProductController)
//similar products route
router.get("/get-similar-products/:pid/:cid", similarProductController)
//category vise products
router.get('/product-category/:slug', productCategoryController)
//checout
router.post('/checkout', requireSignIn, checkoutProductController)
export default router