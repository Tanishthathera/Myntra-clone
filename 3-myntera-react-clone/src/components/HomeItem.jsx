import { useDispatch, useSelector } from "react-redux";
import { bagActions } from "../store/bagSlice";
import { MdAddCircleOutline } from "react-icons/md";
import { AiFillDelete } from "react-icons/ai";

const HomeItem = ({ item }) => {
  const dispatch = useDispatch();
  const bagItems = useSelector((store) => store.bag);

  const isItemInBag = bagItems.includes(item._id); // ✅ Ensure `_id` usage

  const handleAddToBag = () => {
    dispatch(bagActions.addToBag(item._id)); // ✅ Use `_id`
  };

  const handleRemove = () => {
    dispatch(bagActions.removeFromBag(item._id)); // ✅ Use `_id`
  };

  return (
    <div className="item-container">
      <img className="item-image" src={item.image} alt="item" />
      <div className="rating">
        {item.rating.stars} ⭐ | {item.rating.count}
      </div>
      <div className="company-name">{item.company}</div>
      <div className="item-name">{item.item_name}</div>
      <div className="price">
        <span className="current-price">Rs {item.current_price}</span>
        <span className="original-price">Rs {item.original_price}</span>
        <span className="discount">({item.discount_percentage}% OFF)</span>
      </div>

      {isItemInBag ? (
        <button className="btn btn-danger" onClick={handleRemove}>
          <AiFillDelete /> Remove
        </button>
      ) : (
        <button className="btn btn-success" onClick={handleAddToBag}>
          <MdAddCircleOutline /> Add to Bag
        </button>
      )}
    </div>
  );
};

export default HomeItem;
