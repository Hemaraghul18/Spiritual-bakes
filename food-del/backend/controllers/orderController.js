// backend/controllers/orderController.js

import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

const DELIVERY_FEE = 0;

// STEP 1: Place order & store it as unpaid
const placeOrder = async (req, res) => {
  const { userId, items, amount, address, paymentMethod } = req.body;

  try {
    const totalAmount = (parseFloat(amount) + DELIVERY_FEE).toFixed(2);
    const upiUrl = `upi://pay?pa=7358611643@pthdfc&pn=SpiritualBakes&am=${totalAmount}&cu=INR`;

    const unpaidOrder = new orderModel({
      userId,
      items,
      amount: totalAmount,
      address,
      payment: false,
      status: "Awaiting Payment",
      date: Date.now()
    });

    const savedOrder = await unpaidOrder.save();

    res.json({
      success: true,
      paymentMethod,
      orderId: savedOrder._id,
      upiUrl
    });
  } catch (error) {
    console.error("❌ UPI QR generation failed:", error);
    res.status(500).json({ success: false, message: "QR generation error" });
  }
};

// STEP 2: Confirm order after payment (manual or auto)
const verifyOrder = async (req, res) => {
  const { userId, items, amount, address, success, autoDetected, orderId } = req.body;

  try {
    if (success === "true") {
      // ✅ For autoDetected from IMAP
      if (autoDetected && orderId) {
        const unpaidOrder = await orderModel.findOne({ _id: orderId });

        if (!unpaidOrder || unpaidOrder.payment === true) {
          return res.json({ success: false, message: "❌ No matching unpaid order" });
        }

        unpaidOrder.payment = true;
        unpaidOrder.status = "Food Processing";
        await unpaidOrder.save();

        console.log("✅ Auto-confirmed order:", unpaidOrder._id);
        return res.json({ success: true, message: "✅ Auto-confirmed order" });
      }

      // ✅ Manual confirmation (COD or frontend confirm button)
      if (!userId || !items || !amount || !address) {
        return res.status(400).json({ success: false, message: "❌ Missing order data for manual confirm" });
      }

      const totalAmount = (parseFloat(amount) + DELIVERY_FEE).toFixed(2);

      const newOrder = new orderModel({
        userId,
        items,
        amount: totalAmount,
        address,
        payment: true,
        status: "Food Processing",
        date: Date.now()
      });

      await newOrder.save();
      await userModel.findByIdAndUpdate(userId, { cartData: {} });

      return res.json({ success: true, message: "✅ Payment confirmed" });
    } else {
      return res.json({ success: false, message: "❌ Payment failed" });
    }
  } catch (error) {
    console.error("❌ Order verification failed:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// STEP 3: Get user's orders
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching orders" });
  }
};

// STEP 4: Admin - list all orders
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching all orders" });
  }
};

// STEP 5: Admin - update status
const updateStatus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
    res.json({ success: true, message: "Status updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating status" });
  }
};

// STEP 6: Frontend - check if order was paid
const checkOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await orderModel.findOne({ _id: orderId });

    if (order && order.payment === true) {
      return res.json({ success: true, paid: true });
    } else {
      return res.json({ success: true, paid: false });
    }
  } catch (error) {
    console.error("❌ Error checking order status:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export {
  placeOrder,
  verifyOrder,
  userOrders,
  listOrders,
  updateStatus,
  checkOrderStatus
};