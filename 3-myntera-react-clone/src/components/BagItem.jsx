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

  return (
    <div className="bag-item-container">
      <div className="item-left-part">
        <img className="bag-item-img" src={item.image} />
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
        
        {/* Quantity Controls */}
        <div className="quantity-control">
          <button className="qty-btn" onClick={handleDecrease}>-</button>
          <span className="qty-amount">{item.quantity}</span>
          <button className="qty-btn" onClick={handleIncrease}>+</button>
        </div>

        <div className="return-period">
          <span className="return-period-days">{item.return_period} days</span> return available
        </div>
        <div className="delivery-details">
          Delivery by
          <span className="delivery-details-days"> {item.delivery_date}</span>
        </div>
      </div>

      <div className="remove-from-cart" onClick={handleRemoveItem}>
        <RiDeleteBin5Line />
      </div>
    </div>
  );
};

export default BagItem;