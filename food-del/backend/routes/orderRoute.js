// backend/routes/orderRoute.js

import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  placeOrder,
  verifyOrder,
  userOrders,
  listOrders,
  updateStatus,
  checkOrderStatus
} from "../controllers/orderController.js";

const orderRouter = express.Router();

// Route to place a new order (requires login)
orderRouter.post("/place", authMiddleware, placeOrder);

// Route to verify order payment (UPI or COD)
orderRouter.post("/verify", verifyOrder);

// Route to get orders of logged-in user
orderRouter.post("/userorders", authMiddleware, userOrders);

// Admin route to list all orders
orderRouter.get("/list", listOrders);

// Admin route to update order status (e.g., Delivered)
orderRouter.post("/status", updateStatus);

// Frontend route to check if an order is paid (auto polling)
orderRouter.post("/check", checkOrderStatus);

export default orderRouter;
