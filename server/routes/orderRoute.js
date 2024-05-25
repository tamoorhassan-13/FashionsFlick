import express from "express"
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import { cancelOrderController } from './../controllers/OrderController';
const router = express.Router();


// Route to cancel an order by orderId
router.put("/orders/:orderId/cancel",requireSignIn,isAdmin, cancelOrderController);

module.exports = router;
