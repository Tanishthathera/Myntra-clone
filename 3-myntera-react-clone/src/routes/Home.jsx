import HomeItem from "../components/HomeItem";
import { useSelector } from "react-redux";

const Home = () => {
  const items = useSelector((store) => store.items);

  console.log("Redux Store Items:", items);

  return (
    <main>
      <div className="items-container">
        {items.length > 0 ? (
          items.map((item) => <HomeItem key={item._id} item={item} />)
        ) : (
          <p>Loading items...</p>
        )}
      </div>
    </main>
  );
};

export default Home;
