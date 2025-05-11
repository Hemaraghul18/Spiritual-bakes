import React, { useContext, useState } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cartItems, food_list, removeFromCart, getTotalCartAmount, url } = useContext(StoreContext);
  const navigate = useNavigate();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const DELIVERY_FEE = 0; // ✅ Set delivery fee to ₹0

  const handleCheckout = () => {
    if (getTotalCartAmount() === 0) {
      alert("🛒 Your cart is empty!");
      return;
    }

    if (!isPlacingOrder) {
      setIsPlacingOrder(true);
      localStorage.removeItem("orderAddress");
      navigate('/order');
    }
  };

  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {food_list.map((item) => {
          if (cartItems[item._id] > 0) {
            return (
              <div key={item._id}>
                <div className="cart-items-title cart-items-item">
                  <img src={url + "/images/" + item.image} alt="" />
                  <p>{item.name}</p>
                  <p>₹{item.price.toFixed(2)}</p>
                  <p>{cartItems[item._id]}</p>
                  <p>₹{(item.price * cartItems[item._id]).toFixed(2)}</p>
                  <p onClick={() => removeFromCart(item._id)} className='cross'>x</p>
                </div>
                <hr />
              </div>
            );
          }
          return null;
        })}
      </div>

      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₹{getTotalCartAmount().toFixed(2)}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>₹{DELIVERY_FEE}</p> {/* ✅ Always 0 */}
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>₹{(getTotalCartAmount() + DELIVERY_FEE).toFixed(2)}</b>
            </div>
          </div>
          <button 
            onClick={handleCheckout}
            disabled={isPlacingOrder}
            style={isPlacingOrder ? { opacity: 0.6, cursor: "not-allowed" } : {}}
          >
            {isPlacingOrder ? "Processing..." : "PROCEED TO PAYMENT"}
          </button>
        </div>

        <div className="cart-promocode">
          <div>
            <p>If you have a promo code, enter it here</p>
            <div className='cart-promocode-input'>
              <input type="text" placeholder='promo code' />
              <button>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;