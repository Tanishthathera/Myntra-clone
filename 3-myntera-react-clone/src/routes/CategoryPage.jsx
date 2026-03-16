import { useParams, useLocation } from "react-router-dom"; 
import { useEffect, useState } from "react";
import HomeItem from "../components/HomeItem"; 
import LoadingSpinner from "../components/LoadingSpinner";

const CategoryPage = () => {
  const { categoryName } = useParams(); 
  const location = useLocation(); 
  const [categoryItems, setCategoryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Dynamic API URL Logic ---
  const API_BASE_URL = window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "https://myntra--backend.vercel.app/api";

  useEffect(() => {
    setLoading(true);
    
    // --- CATEGORY MAPPING LOGIC ---
    // Ye mapping URL ke naam ko Database wale exact naam se jorti hai
    const categoryMapping = {
      "home-living": "Home & Living",
      "home": "Home & Living",
      "men": "Men",
      "women": "Women",
      "kids": "Kids",
      "beauty": "Beauty",
      "studio": "Studio"
    };

    // Agar mapping milti hai toh wo use karo, nahi toh jo URL mein hai wahi rehne do
    const finalCategory = categoryMapping[categoryName?.toLowerCase()] || categoryName;

    let fetchUrl = "";
    
    if (categoryName === "search") {
      const searchParams = new URLSearchParams(location.search);
      const query = searchParams.get("q"); 
      fetchUrl = `${API_BASE_URL}/items/search?q=${query}`;
    } else {
      // Yahan hum 'finalCategory' bhej rahe hain (e.g. "Home & Living")
      fetchUrl = `${API_BASE_URL}/items?category=${encodeURIComponent(finalCategory)}`;
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
  }, [categoryName, location.search, API_BASE_URL]);

  return (
    <main>
      <div className="category-header" style={{margin: '20px 5%'}}>
        <h2 style={{textTransform: 'uppercase'}}>
          {categoryName === "search" ? "Search Results" : `${categoryName.replace('-', ' & ')} Collection`}
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
                <p style={{color: '#7e818c'}}>Try checking your database category tags or the mapping logic.</p>
            </div>
          )}
        </div>
      )}
    </main>
  );
};

export default CategoryPage;