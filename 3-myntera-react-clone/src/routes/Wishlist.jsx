import HomeItem from "../components/HomeItem";
import { useSelector } from "react-redux";

const Wishlist = () => {
  const wishlistIds = useSelector((store) => store.wishlist);
  const allItems = useSelector((store) => store.items);
  const wishlistItems = allItems.filter(item => wishlistIds.includes(item._id));

  return (
    <main className="items-container">
      {wishlistItems.map(item => <HomeItem key={item._id} item={item} />)}
    </main>
  );
};
export default Wishlist;