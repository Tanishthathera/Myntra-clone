import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { bagActions } from "../store/bagSlice";

const BagSummary = () => {
  const dispatch = useDispatch();
  const bagItems = useSelector((state) => state.bag); // [{id, quantity}]
  const items = useSelector((state) => state.items);
  
  const [showPopup, setShowPopup] = useState(false);
  const [showEmptyCartPopup, setShowEmptyCartPopup] = useState(false);
  const [showPaymentErrorPopup, setShowPaymentErrorPopup] = useState(false);

  //Items ko unki quantity ke saath map karein
  const finalItems = items
    .filter((item) => bagItems.some(bagItem => bagItem.id === item._id))
    .map(item => {
        const bagItem = bagItems.find(b => b.id === item._id);
        return { ...item, quantity: bagItem.quantity };
    });

  const CONVENIENCE_FEES = 99;
  let totalMRP = 0, totalDiscount = 0;

  // Quantity se multiply karein
  finalItems.forEach((bagItem) => {
    totalMRP += (bagItem.original_price * bagItem.quantity);
    totalDiscount += (bagItem.original_price - bagItem.current_price) * bagItem.quantity;
  });

  let finalPayment = totalMRP - totalDiscount + CONVENIENCE_FEES;

  const API_BASE_URL = window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "https://myntra--backend.vercel.app/api";

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async () => {
    if (bagItems.length === 0) {
      setShowEmptyCartPopup(true);
      setTimeout(() => setShowEmptyCartPopup(false), 4500);
      return;
    }

    try {
    const checkStockRes = await fetch(`${API_BASE_URL}/orders/check-stock`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        cartItems: finalItems.map(item => ({ 
           id: item._id,
           quantity: item.quantity,
           item_name: item.item_name 
          })) 
      }),
    });
    
    const stockData = await checkStockRes.json();
    if (!stockData.success) {
      alert(stockData.message); // Yahan user ko pehle hi rok do
      return;
    }
  } catch (err) {
    alert("Stock check failed. Try again.");
    return;
  }

    const res = await loadRazorpayScript();
    if (!res) {
      alert("Razorpay SDK failed to load.");
      return;
    }

    try {
      const orderResponse = await fetch(`${API_BASE_URL}/orders/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: finalPayment,
          receipt: `rcpt_${Date.now()}`,
        }),
      });

      const orderData = await orderResponse.json();
      if (!orderResponse.ok) throw new Error(orderData.error || "Order creation failed");

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Myntra Clone",
        description: "Purchase Payment",
        order_id: orderData.id,
        handler: async function (response) {
          try {
            // Backend ko quantity bhi bhejein
            const itemsToVerify = finalItems.map(item => ({
              id: item._id, 
              item_name: item.item_name,
              quantity: item.quantity // Important for Redis decrBy
            }));

            const verifyRes = await fetch(`${API_BASE_URL}/orders/verify`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                cartItems: itemsToVerify
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.success) {
              setShowPopup(true);
              dispatch(bagActions.clearBag());
              setTimeout(() => {
              setShowPopup(false);
              window.location.reload(); 
            }, 2000);
            } else {
              alert(verifyData.message || "Verification Failed");
            }
          } catch (err) {
            console.error("Verification Error:", err);
            setShowPaymentErrorPopup(true);
          }
        },
        theme: { color: "#e57a62" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment Process Error:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="bag-summary">
      <div className="bag-details-container">
        <div className="price-header">PRICE DETAILS ({finalItems.reduce((acc, item) => acc + item.quantity, 0)} Items)</div>
        <div className="price-item">
          <span>Total MRP</span>
          <span>₹{totalMRP}</span>
        </div>
        <div className="price-item">
          <span>Discount on MRP</span>
          <span className="priceDetail-base-discount">-₹{totalDiscount}</span>
        </div>
        <div className="price-item">
          <span>Convenience Fee</span>
          <span>₹99</span>
        </div>
        <hr />
        <div className="price-footer">
          <span>Total Amount</span>
          <span>₹{finalPayment}</span>
        </div>
      </div>
      <button className="btn-place-order" onClick={handlePlaceOrder}>
        PLACE ORDER
      </button>

      {showPopup && <div className="popup success"><p>Order Placed!</p></div>}
      {showEmptyCartPopup && <div className="popup error"><p>Cart is Empty!</p></div>}
      {showPaymentErrorPopup && <div className="popup error"><p>Payment Failed!</p></div>}
    </div>
  );
};

export default BagSummary;