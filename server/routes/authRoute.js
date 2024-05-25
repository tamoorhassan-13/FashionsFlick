import express from "express";
import {
  registerController,
  loginController,
  testController,
  updateProfileController,
  getOrderController,
  getAllOrderController,
  orderStatusUpdateController,
  contactEmailController,
  sendOtpController,
  subscribeEmailController,
  resetPasswordController,
} from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

// route object
const router = express.Router();

// routing
// register || method Post
router.post("/register", registerController);
// Login || Post
router.post("/login", loginController);

// test route
router.get("/test", requireSignIn, isAdmin, testController);
// protected route auth for user
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});
// protected route auth for admin dashboard
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});
// update profile
router.put("/profile", requireSignIn, updateProfileController);
// order
router.get("/orders", requireSignIn, getOrderController);
// all orders
router.get("/all-orders", requireSignIn, isAdmin, getAllOrderController);
// order status update
router.put(
  "/order-status-update/:orderId",
  requireSignIn,
  isAdmin,
  orderStatusUpdateController
);
router.post('/contact',contactEmailController)
router.post('/subscribe',subscribeEmailController)
router.post('/forgot-password',sendOtpController)
// Route to handle password update
router.post("/reset-password", resetPasswordController )
export default router;
