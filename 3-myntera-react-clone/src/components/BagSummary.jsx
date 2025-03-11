import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { bagActions } from "../store/bagSlice";

const BagSummary = () => {
  const dispatch = useDispatch();
  const bagItemIds = useSelector((state) => state.bag);
  const items = useSelector((state) => state.items);
  const [showPopup, setShowPopup] = useState(false);
  const [showEmptyCartPopup, setShowEmptyCartPopup] = useState(false); // 🚀 Empty cart popup state

  const finalItems = items.filter((item) => bagItemIds.includes(item._id));

  const CONVENIENCE_FEES = 99;
  let totalMRP = 0,
    totalDiscount = 0;

  finalItems.forEach((bagItem) => {
    totalMRP += bagItem.original_price;
    totalDiscount += bagItem.original_price - bagItem.current_price;
  });

  let finalPayment = totalMRP - totalDiscount + CONVENIENCE_FEES;

  // Place Order Function with Cart Check
  const handlePlaceOrder = () => {
    if (bagItemIds.length === 0) {
      setShowEmptyCartPopup(true); //  Show Empty Cart Popup
      setTimeout(() => {
        setShowEmptyCartPopup(false); // Hide after 2.5 sec
      }, 2500);
      return;
    }

    setShowPopup(true);
    dispatch(bagActions.clearBag());

    setTimeout(() => {
      setShowPopup(false);
    }, 3000);
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

      {/*  Order Placed Popup */}
      {showPopup && (
        <div className="popup success">
          <div className="popup-content">
            <span className="checkmark">✔</span>
            <p>Your order has been placed successfully!</p>
          </div>
        </div>
      )}

      {/* Empty Cart Popup */}
      {showEmptyCartPopup && (
        <div className="popup error">
          <div className="popup-content">
            <span className="crossmark">✖</span>
            <p>Your cart is empty! Please add items before placing an order.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BagSummary;
