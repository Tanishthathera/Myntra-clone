import { useState, useEffect } from "react";

const AdminAddProduct = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [pin, setPin] = useState("");

  const [product, setProduct] = useState({ 
    item_name: "", 
    company: "", 
    original_price: "", 
    current_price: "", 
    category: "Men", 
    image: "" 
  });
  const [allItems, setAllItems] = useState([]);

  const ADMIN_PIN = "12344";

  const fetchItems = async () => {
    const res = await fetch("http://localhost:5000/api/items");
    const data = await res.json();
    setAllItems(data);
  };

  useEffect(() => { 
    if (isAdmin) fetchItems(); 
  }, [isAdmin]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
      setIsAdmin(true);
    } else {
      alert("Invalid PIN! Access Denied.");
      setPin("");
    }
  };

  // --- YE RHA LOGOUT LOGIC JO SAB EMPTY KAR DEGA ---
  const handleLogout = () => {
    setIsAdmin(false); 
    setPin("");        
    setProduct({       
      item_name: "", 
      company: "", 
      original_price: "", 
      current_price: "", 
      category: "Men", 
      image: "" 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const discount = Math.round(((product.original_price - product.current_price) / product.original_price) * 100);

    const res = await fetch("http://localhost:5000/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        ...product, 
        discount_percentage: discount,
        rating: { stars: 4.5, count: 0 },
        delivery_date: "10 Oct",
        return_period: 14 
      }),
    });
    
    if (res.ok) { 
      alert("Product Added Successfully!"); 
      fetchItems(); 
      setProduct({ item_name: "", company: "", original_price: "", current_price: "", category: "Men", image: "" });
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this item?")) {
      await fetch(`http://localhost:5000/api/items/${id}`, { method: "DELETE" });
      fetchItems();
    }
  };

  // --- LOGIN VIEW ---
  if (!isAdmin) {
    return (
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
        <div className="card shadow p-4 border-danger" style={{ maxWidth: "400px", width: "100%" }}>
          <h3 className="text-center mb-4"> Admin Login</h3>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label">Enter Secret PIN</label>
              <input 
                type="password" 
                className="form-control form-control-lg text-center" 
                placeholder="****" 
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                required 
              />
            </div>
            <button className="btn btn-danger w-100 py-2">Unlock Dashboard</button>
          </form>
        </div>
      </div>
    );
  }

  // --- DASHBOARD VIEW ---
  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Admin Dashboard (Myntra Clone)</h2>
        {/* LOGOUT BUTTON ME NAYA FUNCTION CALL KIYA HAI */}
        <button className="btn btn-outline-dark" onClick={handleLogout}>Logout</button>
      </div>
      
      {/* Form Section */}
      <form onSubmit={handleSubmit} className="row g-3 shadow p-4 mb-5 bg-white rounded border border-danger">
        <div className="col-md-6">
          <label className="form-label">Item Name</label>
          <input type="text" className="form-control" placeholder="e.g. Cotton T-shirt" value={product.item_name} onChange={e => setProduct({...product, item_name: e.target.value})} required />
        </div>
        <div className="col-md-6">
          <label className="form-label">Company / Brand</label>
          <input type="text" className="form-control" placeholder="e.g. Adidas" value={product.company} onChange={e => setProduct({...product, company: e.target.value})} required />
        </div>
        <div className="col-md-12">
          <label className="form-label">Image Path/URL</label>
          <input type="text" className="form-control" placeholder="images/1.jpg or http://..." value={product.image} onChange={e => setProduct({...product, image: e.target.value})} required />
        </div>
        <div className="col-md-3">
          <label className="form-label">Category</label>
          <select className="form-select" value={product.category} onChange={e => setProduct({...product, category: e.target.value})}>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
            <option value="Home & Living">Home & Living</option>
            <option value="Beauty">Beauty</option>
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label">Original Price (MRP)</label>
          <input type="number" className="form-control" placeholder="₹ 1999" value={product.original_price} onChange={e => setProduct({...product, original_price: e.target.value})} required />
        </div>
        <div className="col-md-3">
          <label className="form-label">Current Price (Offer)</label>
          <input type="number" className="form-control" placeholder="₹ 999" value={product.current_price} onChange={e => setProduct({...product, current_price: e.target.value})} required />
        </div>
        <div className="col-md-3 d-flex align-items-end">
          <button className="btn btn-danger w-100 py-2">Save Product</button>
        </div>
      </form>

      {/* Table Section */}
      <h4>Existing Products In Database</h4>
      <div className="table-responsive shadow-sm">
        <table className="table table-hover align-middle bg-white">
          <thead className="table-dark">
            <tr>
              <th>Image</th>
              <th>Details</th>
              <th>Category</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {allItems.map(item => (
              <tr key={item._id}>
                <td><img src={item.image.startsWith('http') ? item.image : `/${item.image}`} width="50" height="60" style={{objectFit: 'cover'}} alt="" /></td>
                <td>
                  <strong>{item.company}</strong><br/>
                  <small>{item.item_name}</small>
                </td>
                <td><span className="badge bg-secondary">{item.category}</span></td>
                <td>
                  <span className="text-decoration-line-through text-muted small">₹{item.original_price}</span><br/>
                  <strong>₹{item.current_price}</strong>
                </td>
                <td>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(item._id)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAddProduct;