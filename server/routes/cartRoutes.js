// routes/cart.routes.js
import express from "express";
import {
  getCart,
  addItemToCart,
  removeItemFromCart,
} from "../controllers/cartController.js";

const router = express.Router();

router.get("/getcartitem", getCart);
router.post("/addcartitem",  addItemToCart);
router.delete("/removecartitem/:productId",removeItemFromCart);

export default router;
