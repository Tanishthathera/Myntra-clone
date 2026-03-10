import { useState } from "react";

const AdminAddProduct = () => {
  const [product, setProduct] = useState({
    item_name: "",
    company: "",
    original_price: "",
    current_price: "",
    category: "Men", // Default Category
    image: "",
    stock: 50 // Default Stock
  });

  // --- Dynamic API URL Logic ---
  const API_BASE_URL = window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "https://myntra--backend.vercel.app/api";

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      // Localhost ko hata kar API_BASE_URL ka use kiya
      const res = await fetch(`${API_BASE_URL}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      
      if (res.ok) {
        alert("Product added to " + product.category + " successfully!");
        // Form clear karne ke liye (Optional)
        setProduct({ item_name: "", company: "", original_price: "", current_price: "", category: "Men", image: "", stock: 50 });
      } else {
        alert("Failed to add product. Please check backend.");
      }
    } catch (err) {
      console.error("Add Product Error:", err);
      alert("Connection error! Make sure your backend is live.");
    }
  };

  return (
    <div className="admin-container">
      <h2>Add New Product</h2>
      <form onSubmit={handleAddProduct}>
        <input 
          type="text" 
          placeholder="Item Name" 
          required 
          value={product.item_name}
          onChange={(e) => setProduct({...product, item_name: e.target.value})} 
        />
        
        <input 
          type="text" 
          placeholder="Company Name" 
          required 
          value={product.company}
          onChange={(e) => setProduct({...product, company: e.target.value})} 
        />

        <input 
          type="text" 
          placeholder="Image URL" 
          required 
          value={product.image}
          onChange={(e) => setProduct({...product, image: e.target.value})} 
        />
        
        <div style={{display: 'flex', gap: '10px'}}>
          <input 
            type="number" 
            placeholder="Original Price" 
            required 
            value={product.original_price}
            onChange={(e) => setProduct({...product, original_price: e.target.value})} 
          />
          <input 
            type="number" 
            placeholder="Current Price" 
            required 
            value={product.current_price}
            onChange={(e) => setProduct({...product, current_price: e.target.value})} 
          />
        </div>

        {/* Category Dropdown */}
        <select value={product.category} onChange={(e) => setProduct({...product, category: e.target.value})}>
          <option value="Men">Men</option>
          <option value="Women">Women</option>
          <option value="Kids">Kids</option>
          <option value="Home & Living">Home & Living</option>
          <option value="Beauty">Beauty</option>
        </select>
        
        <button type="submit" className="btn-add">Add Product</button>
      </form>
    </div>
  );
};

export default AdminAddProduct;