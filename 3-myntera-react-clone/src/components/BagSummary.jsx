import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { bagActions } from "../store/bagSlice";

const BagSummary = () => {
  const dispatch = useDispatch();
  const bagItemIds = useSelector((state) => state.bag);
  const items = useSelector((state) => state.items);
  const [showPopup, setShowPopup] = useState(false);
  const [showEmptyCartPopup, setShowEmptyCartPopup] = useState(false);
  const [showPaymentErrorPopup, setShowPaymentErrorPopup] = useState(false);

  const finalItems = items.filter((item) => bagItemIds.includes(item._id));

  const CONVENIENCE_FEES = 99;
  let totalMRP = 0,
    totalDiscount = 0;

  finalItems.forEach((bagItem) => {
    totalMRP += bagItem.original_price;
    totalDiscount += bagItem.original_price - bagItem.current_price;
  });

  let finalPayment = totalMRP - totalDiscount + CONVENIENCE_FEES;

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async () => {
    if (bagItemIds.length === 0) {
      setShowEmptyCartPopup(true);
      setTimeout(() => {
        setShowEmptyCartPopup(false);
      }, 4500);
      return;
    }

    const res = await loadRazorpayScript();

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";

      const orderResponse = await fetch(apiBaseUrl + "/orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: finalPayment,
          receipt: `receipt_order_${new Date().getTime()}`,
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        alert(orderData.error || "Failed to create order");
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "",
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Myntra Clone",
        description: "Test Transaction",
        order_id: orderData.id,
        handler: async function (response) {
          try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";

            const verifyResponse = await fetch(apiBaseUrl + "/orders/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(response),
            });

            const verifyData = await verifyResponse.json();

            if (verifyResponse.ok && verifyData.success) {
              setShowPopup(true);
              dispatch(bagActions.clearBag());
              setTimeout(() => {
                setShowPopup(false);
              }, 5000);
            } else {
              setShowPaymentErrorPopup(true);
              setTimeout(() => {
                setShowPaymentErrorPopup(false);
              }, 3000);
            }
          } catch (error) {
            alert("Payment verification failed. Please try again.");
            console.error("Payment verification error:", error);
            setShowPaymentErrorPopup(true);
            setTimeout(() => {
              setShowPaymentErrorPopup(false);
            }, 3000);
          }
        },
        prefill: {
          name: "",
          email: "",
          contact: "",
        },
        theme: {
          color: "#e57a62ff",
        },
      };

      if (!options.key) {
        alert("Razorpay key is missing. Please check your environment variables.");
        return;
      }

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      alert("Payment failed. Please try again.");
      if (error instanceof Response) {
        const errorData = await error.json();
        console.error("Payment error response:", errorData);
      } else {
        console.error("Payment error:", error);
      }
    }
  };

  return (
    <div className="bag-summary">
      <div className="bag-details-container">
        <div className="price-header">
          PRICE DETAILS ({bagItemIds.length} Items)
        </div>
        <div className="price-item">
          <span className="price-item-tag">Total MRP</span>
          <span className="price-item-value">₹{totalMRP}</span>
        </div>
        <div className="price-item">
          <span className="price-item-tag">Discount on MRP</span>
          <span className="price-item-value priceDetail-base-discount">
            -₹{totalDiscount}
          </span>
        </div>
        <div className="price-item">
          <span className="price-item-tag">Convenience Fee</span>
          <span className="price-item-value">₹99</span>
        </div>
        <hr />
        <div className="price-footer">
          <span className="price-item-tag">Total Amount</span>
          <span className="price-item-value">₹{finalPayment}</span>
        </div>
      </div>
      <button className="btn-place-order" onClick={handlePlaceOrder}>
        <div className="css-xjhrni">PLACE ORDER</div>
      </button>

      {showPopup && (
        <div className="popup success">
          <div className="popup-content">
            <span className="checkmark">✔</span>
            <p>Your order has been placed successfully!</p>
          </div>
        </div>
      )}

      {showEmptyCartPopup && (
        <div className="popup error">
          <div className="popup-content">
            <span className="crossmark">✖</span>
            <p>Your cart is empty! Please add items before placing an order.</p>
          </div>
        </div>
      )}

      {showPaymentErrorPopup && (
        <div className="popup error">
          <div className="popup-content">
            <span className="crossmark">✖</span>
            <p>Payment verification failed. Please try again.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BagSummary;
