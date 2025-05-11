// frontend/pages/PlaceOrder.jsx

import React, { useContext, useState, useEffect } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import QRCode from "react-qr-code";
import emailjs from "@emailjs/browser";

const DELIVERY_FEE = 0;

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext);
  const navigate = useNavigate();

  const [data, setData] = useState({
    firstName: "", lastName: "", email: "", street: "",
    city: "", state: "", zipcode: "", country: "", phone: ""
  });

  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [upiData, setUpiData] = useState({ showQR: false, upiUrl: "", expired: false });
  const [orderPayload, setOrderPayload] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const sendEmail = (amount) => {
    const templateParams = {
      from_name: `${data.firstName} ${data.lastName}`,
      reply_to: data.email,
      phone: data.phone,
      message: amount
    };

    emailjs.send("service_hug72vi", "template_eyannfg", templateParams, "n_9Xt9Jo_VxtR2LPR")
      .then(() => console.log("✅ Email sent"))
      .catch(err => console.error("❌ Email error", err));
  };

  const placeOrder = async (e) => {
    e.preventDefault();

    const items = food_list.filter(item => cartItems[item._id] > 0).map(item => ({
      ...item,
      quantity: cartItems[item._id]
    }));

    const userId = token ? JSON.parse(atob(token.split(".")[1])).id : "";
    const totalAmount = getTotalCartAmount() + DELIVERY_FEE;

    const order = {
      userId,
      items,
      amount: totalAmount,
      address: data,
      paymentMethod
    };

    if (paymentMethod === "UPI") {
      try {
        const res = await axios.post(`${url}/api/order/place`, order, { headers: { token } });
        if (res.data.success) {
          setUpiData({ showQR: true, upiUrl: res.data.upiUrl, expired: false });
          setOrderPayload(order);
          sessionStorage.setItem("qrShown", "true");
          sessionStorage.setItem("latestOrderId", res.data.orderId);
          setTimeLeft(180);
        }
      } catch {
        alert("❌ Failed to create order.");
      }
    } else {
      try {
        const res = await axios.post(`${url}/api/order/verify`, { ...order, success: "true" }, { headers: { token } });
        if (res.data.success) navigate("/myorders");
      } catch {
        alert("❌ COD failed");
      }
    }
  };

  const confirmPayment = async () => {
    try {
      const res = await axios.post(`${url}/api/order/verify`, { ...orderPayload, success: "true" }, { headers: { token } });
      if (res.data.success) {
        const amount = orderPayload.amount.toFixed(2);
        setPaymentConfirmed(true);
        sendEmail(amount);
        alert(`✅ Payment of ₹${amount} has been successfully received.`);
        sessionStorage.removeItem("qrShown");
        sessionStorage.removeItem("latestOrderId");
        setTimeout(() => navigate("/myorders"), 2000);
      } else {
        alert("❌ Payment failed");
        sessionStorage.removeItem("qrShown");
        navigate("/");
      }
    } catch {
      alert("❌ Verification error");
      sessionStorage.removeItem("qrShown");
      navigate("/");
    }
  };

  useEffect(() => {
    const orderId = sessionStorage.getItem("latestOrderId");
    if (!orderId || paymentConfirmed) return;

    const interval = setInterval(async () => {
      try {
        const res = await axios.post(`${url}/api/order/check`, { orderId }, { headers: { token } });
        if (res.data.success && res.data.paid) {
          setPaymentConfirmed(true);
          sessionStorage.removeItem("qrShown");
          sessionStorage.removeItem("latestOrderId");
          alert("✅ Payment auto-confirmed via email.");
          navigate("/myorders");
        }
      } catch (err) {
        console.error("Payment check failed", err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [paymentConfirmed]);

  useEffect(() => {
    if (!token || getTotalCartAmount() === 0) {
      navigate("/cart");
    }

    if (sessionStorage.getItem("qrShown") === "true" && !paymentConfirmed) {
      alert("❌ Payment failed or page was reloaded.");
      sessionStorage.removeItem("qrShown");
      navigate("/");
    }
  }, [token]);

  useEffect(() => {
    if (upiData.showQR && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setUpiData(prev => ({ ...prev, expired: true }));
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [upiData.showQR, timeLeft]);

  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input required name="firstName" value={data.firstName} onChange={onChangeHandler} placeholder="First name" />
          <input required name="lastName" value={data.lastName} onChange={onChangeHandler} placeholder="Last name" />
        </div>
        <input required name="email" value={data.email} onChange={onChangeHandler} placeholder="Email address" />
        <input required name="street" value={data.street} onChange={onChangeHandler} placeholder="Street" />
        <div className="multi-fields">
          <input required name="city" value={data.city} onChange={onChangeHandler} placeholder="City" />
          <input required name="state" value={data.state} onChange={onChangeHandler} placeholder="State" />
        </div>
        <div className="multi-fields">
          <input required name="zipcode" value={data.zipcode} onChange={onChangeHandler} placeholder="Zip code" />
          <input required name="country" value={data.country} onChange={onChangeHandler} placeholder="Country" />
        </div>
        <input required name="phone" value={data.phone} onChange={onChangeHandler} placeholder="Phone" />

        <p className="title">Select Payment Method</p>
        <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
          <option value="UPI">UPI QR Payment</option>
          <option value="COD">Cash on Delivery</option>
        </select>
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div className="cart-total-details">
            <p>Subtotal</p>
            <p>₹{getTotalCartAmount().toFixed(2)}</p>
          </div>
          <div className="cart-total-details">
            <p>Delivery Fee</p>
            <p>₹{DELIVERY_FEE}</p>
          </div>
          <div className="cart-total-details">
            <b>Total</b>
            <b>₹{(getTotalCartAmount() + DELIVERY_FEE).toFixed(2)}</b>
          </div>
          <button type="submit">PROCEED TO PAYMENT</button>

          {upiData.showQR && !upiData.expired && (
            <div className="upi-box">
              <p>Scan this QR using any UPI app</p>
              <QRCode value={upiData.upiUrl} size={180} />
              <p style={{ marginTop: "10px" }}>
                ⏳ Time left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </p>
              <button type="button" onClick={confirmPayment} className="confirm-btn">Confirm Payment</button>
            </div>
          )}

          {upiData.expired && (
            <p style={{ color: "red", marginTop: "10px" }}>⏰ QR expired. Please try again.</p>
          )}

          {paymentConfirmed && (
            <p style={{ color: "green", marginTop: "10px" }}>✅ Payment Confirmed. Redirecting...</p>
          )}
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;