import { useDispatch, useSelector } from "react-redux";
import { bagActions } from "../store/bagSlice";
import { MdAddCircleOutline } from "react-icons/md";
import { AiFillDelete } from "react-icons/ai";

const HomeItem = ({ item }) => {
  const dispatch = useDispatch();
  const bagItems = useSelector((store) => store.bag);

  // Check if any object in the bag has this item's ID
  const isItemInBag = bagItems.some((bagItem) => bagItem.id === item._id);

  const handleAddToBag = () => {
    dispatch(bagActions.addToBag(item._id));
  };

  const handleRemove = () => {
    dispatch(bagActions.removeFromBag(item._id));
  };

  return (
    <div className="item-container">
      <img className="item-image" src={item.image} alt="item" />
      <div className="rating">
        {item.rating.stars} ⭐ | {item.rating.count}
      </div>
      <div className="company-name">{item.company}</div>
      <div className="item-name">{item.item_name}</div>
      
      <div className="stock-info">
        {item.currentStock > 0 ? (
          item.currentStock <= 10 ? (
            <span className="stock-low">Only {item.currentStock} left! Hurry!</span>
          ) : (
            <span className="stock-available">In Stock: {item.currentStock}</span>
          )
        ) : (
          <span className="stock-out">Sold Out</span>
        )}
      </div>

      <div className="price">
        <span className="current-price">Rs {item.current_price}</span>
        <span className="original-price">Rs {item.original_price}</span>
        <span className="discount">({item.discount_percentage}% OFF)</span>
      </div>

      {isItemInBag ? (
        <button className="btn-add-bag btn-remove-bag" onClick={handleRemove}>
          <AiFillDelete /> Remove
        </button>
      ) : (
        <button 
          className="btn-add-bag" 
          onClick={handleAddToBag}
          disabled={item.currentStock <= 0} // Sold out ho toh button band
        >
          <MdAddCircleOutline /> {item.currentStock <= 0 ? "Sold Out" : "Add to Bag"}
        </button>
      )}
    </div>
  );
};

export default HomeItem;