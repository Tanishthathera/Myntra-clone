import BagItem from "../components/BagItem";
import BagSummary from "../components/BagSummary";
import { useSelector } from "react-redux";

const Bag = () => {
  const bagItems = useSelector((state) => state.bag);
  const items = useSelector((state) => state.items);

  // ✅ Ensure correct `_id` matching
  const finalItems = items.filter((item) => bagItems.includes(item._id));

  return (
    <main>
      <div className="bag-page">
        <div className="bag-items-container">
          {finalItems.length > 0 ? (
            finalItems.map((item) => <BagItem key={item._id} item={item} />)
          ) : (
            <p>No items in your bag.</p>
          )}
        </div>
        <BagSummary />
      </div>
    </main>
  );
};

export default Bag;
