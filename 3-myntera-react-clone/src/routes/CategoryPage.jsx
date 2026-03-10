import { useParams, useLocation } from "react-router-dom"; 
import { useEffect, useState } from "react";
import HomeItem from "../components/HomeItem"; 
import LoadingSpinner from "../components/LoadingSpinner";

const CategoryPage = () => {
  const { categoryName } = useParams(); 
  const location = useLocation(); 
  const [categoryItems, setCategoryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    
    let fetchUrl = "";
    
    // Logic: Agar categoryName 'search' hai, toh Search API hit karo
    if (categoryName === "search") {
      const searchParams = new URLSearchParams(location.search);
      const query = searchParams.get("q"); // URL se 'q' ki value nikalega
      fetchUrl = `http://localhost:5000/api/items/search?q=${query}`;
    } else {
      // Normal Category fetch
      fetchUrl = `http://localhost:5000/api/items?category=${categoryName}`;
    }

    fetch(fetchUrl)
      .then((res) => res.json())
      .then((data) => {
        setCategoryItems(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, [categoryName, location.search]); 

  return (
    <main>
      <div className="category-header" style={{margin: '20px 5%'}}>
        <h2 style={{textTransform: 'uppercase'}}>
          {categoryName === "search" ? "Search Results" : `${categoryName} Collection`}
        </h2>
      </div>
      
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="items-container">
          {categoryItems.length > 0 ? (
            categoryItems.map((item) => (
              <HomeItem key={item._id} item={item} />
            ))
          ) : (
            <div style={{textAlign: 'center', width: '100%', padding: '50px'}}>
                <h3>Oops! No items found in {categoryName === "search" ? "search" : categoryName} section.</h3>
            </div>
          )}
        </div>
      )}
    </main>
  );
};

export default CategoryPage;