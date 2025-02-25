import { useDispatch, useSelector } from "react-redux";
import { bagActions } from "../store/bagSlice";
import { MdAddCircleOutline } from "react-icons/md";
import { AiFillDelete } from "react-icons/ai";

const HomeItem = ({ item }) => {
  const dispatch = useDispatch();
  const bagItems = useSelector((store) => store.bag);

  // ✅ Fix: Correct check for item existence in Redux
  const elementFound = bagItems.some((bagItem) => bagItem === item.id);

  console.log(item.id, elementFound);

  const handleAddToBag = () => {
    dispatch(bagActions.aadToBag(item.id));
    console.log("After Add:", bagItems);
  };

  const handleRemove = () => {
    dispatch(bagActions.removeFromBag(item.id));
    console.log("After Remove:", bagItems);
  };

  return (
    <div className="item-container">
      <img className="item-image" src={item.image} alt="item image" />
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

      {elementFound ? (
        <button
          type="button"
          className="btn btn-add-bag btn-danger"
          onClick={handleRemove}
        >
          <AiFillDelete /> Remove
        </button>
      ) : (
        <button
          type="button"
          className="btn btn-add-bag btn-success"
          onClick={handleAddToBag}
        >
          <MdAddCircleOutline /> Add to Bag
        </button>
      )}
    </div>
  );
};

export default HomeItem;
