import { useState } from "react";

const AdminAddProduct = () => {
  const [product, setProduct] = useState({
    item_name: "",
    company: "",
    original_price: "",
    current_price: "",
    category: "Men", 
    image: "",
    stock: 50 
  });

  const API_BASE_URL = window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "https://myntra--backend.vercel.app/api";

  const handleAddProduct = async (e) => {
    e.preventDefault();

    // --- DYNAMIC DATA CALCULATION ---
    // Aaj se 7 din baad ki date nikalne ke liye logic
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    
    const deliveryDateString = futureDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

    // Discount percentage khud calculate ho jaye
    const discount = product.original_price > 0 
      ? Math.round(((product.original_price - product.current_price) / product.original_price) * 100)
      : 0;

    // Final Data object jo backend jayega
    const finalProductData = {
      ...product,
      discount_percentage: discount,
      delivery_date: deliveryDateString, // Ab ye dynamic hai (e.g. 19 Mar 2026)
      return_period: 14,                // Har naye product ke liye default 14 days
      rating: { stars: 4.5, count: 0 }  // Default rating
    };

    try {
      const res = await fetch(`${API_BASE_URL}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalProductData),
      });
      
      if (res.ok) {
        alert(`Success! Product added with Delivery Date: ${deliveryDateString}`);
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
      <h2 style={{textAlign: 'center', marginBottom: '20px'}}>Add New Product (with Auto-Date)</h2>
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
            onChange={(e) => setProduct({...product, original_price: Number(e.target.value)})} 
          />
          <input 
            type="number" 
            placeholder="Current Price" 
            required 
            value={product.current_price}
            onChange={(e) => setProduct({...product, current_price: Number(e.target.value)})} 
          />
        </div>

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