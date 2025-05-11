import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import "dotenv/config";

import Imap from "imap";
import { simpleParser } from "mailparser";
import axios from "axios";

const app = express();
const port = 4000;

app.use(express.json());
app.use(cors());

connectDB();

app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

app.get("/", (req, res) => {
  res.send("API Working");
});

app.listen(port, () => {
  console.log(`✅ Server Started on http://localhost:${port}`);
});

const imap = new Imap({
  user: process.env.EMAIL_USER,
  password: process.env.EMAIL_PASS,
  host: "imap.gmail.com",
  port: 993,
  tls: true,
  tlsOptions: { rejectUnauthorized: false }
});

function openInbox(cb) {
  imap.openBox("INBOX", false, cb);
}

imap.once("ready", function () {
  openInbox(function (err, box) {
    if (err) throw err;
    console.log("📥 IMAP connection ready. Listening for new emails...");

    imap.on("mail", function () {
      const fetch = imap.seq.fetch(box.messages.total + ":*", {
        bodies: "",
        struct: true,
      });

      fetch.on("message", function (msg) {
        msg.on("body", function (stream) {
          simpleParser(stream, async (err, parsed) => {
            const body = parsed.text?.toLowerCase();

            if (body && (
              body.includes("amount credited") ||
              body.includes("transaction info") ||
              body.includes("inr") || 
              body.includes("upi/p2a")
            )) {
              console.log("✅ Payment email detected:", parsed.subject);

              try {
                const orderRes = await axios.get("http://localhost:4000/api/order/list");
const unpaidOrders = orderRes.data.data.filter(o => !o.payment);

if (unpaidOrders.length === 0) {
  console.warn("⚠️ No unpaid orders found to auto-confirm.");
  return;
}

const latestOrder = unpaidOrders[unpaidOrders.length - 1];

await axios.post("http://localhost:4000/api/order/verify", {
  autoDetected: true,
  success: "true",
  orderId: latestOrder._id,
});

                console.log("🎉 Payment confirmed to backend");
              } catch (error) {
                console.error("❌ Error notifying backend:", error.message);
              }
            }
          });
        });
      });
    });
  });
});

imap.once("error", function (err) {
  console.error("❌ IMAP Error:", err);
});

imap.once("end", function () {
  console.log("📭 IMAP connection ended");
});

imap.connect();
