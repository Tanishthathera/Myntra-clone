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

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      if (res.ok) alert("Product added to " + product.category);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-container">
      <h2>Add New Product</h2>
      <form onSubmit={handleAddProduct}>
        <input type="text" placeholder="Item Name" required onChange={(e) => setProduct({...product, item_name: e.target.value})} />
        
        {/* Category Dropdown sabse important hai */}
        <select value={product.category} onChange={(e) => setProduct({...product, category: e.target.value})}>
          <option value="Men">Men</option>
          <option value="Women">Women</option>
          <option value="Kids">Kids</option>
          <option value="Home & Living">Home & Living</option>
          <option value="Beauty">Beauty</option>
        </select>
        
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default AdminAddProduct;