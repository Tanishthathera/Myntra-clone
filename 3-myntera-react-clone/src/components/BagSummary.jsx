import { useSelector, useDispatch } from "react-redux";
//import { useState } from "react";
import { bagActions } from "../store/bagSlice";
import toast from 'react-hot-toast'; 

const BagSummary = () => {
  const dispatch = useDispatch();
  const bagItems = useSelector((state) => state.bag);
  const items = useSelector((state) => state.items);

  // Myntra Theme Styles for Toast
  const toastStyle = {
    style: {
      border: '1px solid #ff3f6c',
      padding: '16px',
      color: '#ff3f6c',
      fontWeight: 'bold',
      borderRadius: '8px',
      background: '#fff',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    },
    iconTheme: {
      primary: '#ff3f6c',
      secondary: '#fff',
    },
  };

  const finalItems = items
    .filter((item) => bagItems.some(bagItem => bagItem.id === item._id))
    .map(item => {
        const bagItem = bagItems.find(b => b.id === item._id);
        return { ...item, quantity: bagItem.quantity };
    });

  const CONVENIENCE_FEES = 99;
  let totalMRP = 0, totalDiscount = 0;

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
      toast.error("Cart is Empty!", toastStyle); 
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
        toast.error(stockData.message, toastStyle); 
        return;
      }
    } catch (err) {
      toast.error("Stock check failed. Try again.", toastStyle);
      return;
    }

    const res = await loadRazorpayScript();
    if (!res) {
      toast.error("Razorpay SDK failed to load.", toastStyle);
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
            const itemsToVerify = finalItems.map(item => ({
              id: item._id, 
              item_name: item.item_name,
              quantity: item.quantity 
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
              toast.success("Order Placed Successfully!", {
                duration: 3000,
                style: { background: '#4BB543', color: '#fff' }
              }); 
              dispatch(bagActions.clearBag());
              setTimeout(() => { window.location.reload(); }, 2000);
            } else {
              toast.error(verifyData.message || "Verification Failed", toastStyle);
            }
          } catch (err) {
            toast.error("Payment Verification Error!", toastStyle);
          }
        },
        theme: { color: "#ff3f6c" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error("Something went wrong!", toastStyle);
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
    </div>
  );
};

export default BagSummary;