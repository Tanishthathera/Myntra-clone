import { useDispatch } from "react-redux";
import { bagActions } from "../store/bagSlice";
import { RiDeleteBin5Line } from "react-icons/ri";

const BagItem = ({ item }) => {
  const dispatch = useDispatch();

  const handleRemoveItem = () => {
    dispatch(bagActions.removeFromBag(item._id));
  };

  const handleIncrease = () => {
    dispatch(bagActions.addToBag(item._id));
  };

  const handleDecrease = () => {
    dispatch(bagActions.decreaseQuantity(item._id));
  };

  // --- Live Dynamic Date Logic ---
  // Ye function hamesha Order/View ke waqt ki fresh date calculate karega
  const getDeliveryDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 7); // Aaj ki date + 7 din
    return today.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="bag-item-container">
      <div className="item-left-part">
        <img className="bag-item-img" src={item.image} alt={item.item_name} />
      </div>
      <div className="item-right-part">
        <div className="company">{item.company}</div>
        <div className="item-name">{item.item_name}</div>
        <div className="price-container">
          <span className="current-price">Rs {item.current_price}</span>
          <span className="original-price">Rs {item.original_price}</span>
          <span className="discount-percentage">
            ({item.discount_percentage}% OFF)
          </span>
        </div>
        
        <div className="quantity-control" style={{ margin: '10px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button className="qty-btn" onClick={handleDecrease} style={{ padding: '2px 8px', cursor: 'pointer' }}>-</button>
          <span className="qty-amount" style={{ fontWeight: 'bold' }}>{item.quantity || 1}</span>
          <button className="qty-btn" onClick={handleIncrease} style={{ padding: '2px 8px', cursor: 'pointer' }}>+</button>
        </div>

        <div className="return-period">
          {/* Constant 14 days kyunki policy hamesha same rehti hai */}
          <span className="return-period-days">14 days</span> return available
        </div>
        
        <div className="delivery-details">
          Delivery by
          {/* Database ki purani date ko bypass karke hamesha dynamic date dikhana */}
          <span className="delivery-details-days"> {getDeliveryDate()}</span>
        </div>
      </div>

      <div className="remove-from-cart" onClick={handleRemoveItem} style={{ cursor: 'pointer' }}>
        <RiDeleteBin5Line />
      </div>
    </div>
  );
};

export default BagItem;