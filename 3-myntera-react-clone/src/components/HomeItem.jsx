import { useDispatch, useSelector } from "react-redux";
import { bagActions } from "../store/bagSlice";
import { wishlistActions } from "../store/wishlistSlice"; 
import { MdAddCircleOutline } from "react-icons/md";
import { AiFillDelete } from "react-icons/ai";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const HomeItem = ({ item }) => {
  const dispatch = useDispatch();
  const bagItems = useSelector((store) => store.bag);
  const wishlist = useSelector((store) => store.wishlist); 

  // 1. AAPKA ORIGINAL BAG LOGIC (Jaisa tha waisa hi hai)
  const isItemInBag = bagItems.some((bagItem) => bagItem.id === item._id);

  // 2. WISHLIST CHECK (ID ke base par)
  const isWishlisted = wishlist.includes(item._id);

  const handleAddToBag = () => {
    // Yahan aapka original logic jo bag me item bhejta hai
    dispatch(bagActions.addToBag(item._id)); 
  };

  const handleRemove = () => {
    dispatch(bagActions.removeFromBag(item._id));
  };

  // 3. WISHLIST TOGGLE FUNCTION
  const handleWishlist = (e) => {
    e.preventDefault(); 
    e.stopPropagation(); 
    console.log("Adding to wishlist:", item._id);

    if (isWishlisted) {
      dispatch(wishlistActions.removeFromWishlist(item._id));
    } else {
      dispatch(wishlistActions.addToWishlist(item._id));
    }
  };

  return (
    <div className="item-container" style={{ position: "relative" }}>
      
      {/* --- WISHLIST HEART ICON (NEW ADDITION) --- */}
      <div 
        className="wishlist-heart" 
        onClick={handleWishlist}
        style={{
          position: "absolute",
          top: "12px",
          right: "12px",
          zIndex: "999",
          cursor: "pointer",
          fontSize: "22px",
          background: "rgba(255,255,255,0.8)",
          borderRadius: "50%",
          padding: "6px",
          display: "flex",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          transition: "transform 0.2s ease"
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.1)"}
        onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
      >
        {isWishlisted ? (
          <FaHeart style={{ color: "#ff3f6c" }} />
        ) : (
          <FaRegHeart style={{ color: "#282c3f" }} />
        )}
      </div>

      <img className="item-image" src={`/${item.image}`} alt="item" />
      
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

      {/* --- AAPKE ORIGINAL BUTTONS (NO CHANGE) --- */}
      {isItemInBag ? (
        <button className="btn-add-bag btn-remove-bag" onClick={handleRemove}>
          <AiFillDelete /> Remove
        </button>
      ) : (
        <button 
          className="btn-add-bag" 
          onClick={handleAddToBag}
          disabled={item.currentStock <= 0}
        >
          <MdAddCircleOutline /> {item.currentStock <= 0 ? "Sold Out" : "Add to Bag"}
        </button>
      )}
    </div>
  );
};

export default HomeItem;