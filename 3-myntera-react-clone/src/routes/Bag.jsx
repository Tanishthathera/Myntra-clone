import BagItem from "../components/BagItem";
import BagSummary from "../components/BagSummary";
import { useSelector } from "react-redux";

const Bag = () => {
  const bagItems = useSelector((state) => state.bag);
  const items = useSelector((state) => state.items);
  const finalItems = items
    .filter((item) => bagItems.some((bagItem) => bagItem.id === item._id))
    .map((item) => {
      const bagQtyObj = bagItems.find((b) => b.id === item._id);
      return { ...item, quantity: bagQtyObj ? bagQtyObj.quantity : 1 };
    });

  return (
    <main>
      <div className="bag-page">
        <div className="bag-items-container">
          {finalItems.length > 0 ? (
            finalItems.map((item) => (
              <BagItem key={item._id} item={item} />
            ))
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