import { IoMdPerson } from "react-icons/io";
import Sidebar from "./Sidebar";
import { useState, useEffect } from "react";
import { FaGrinHearts, FaShoppingBag } from "react-icons/fa";
import { FaBars } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Header = () => {
  const bag = useSelector((store) => store.bag);
  const wishlist = useSelector((store) => store.wishlist);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1002);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const executeSearch = () => {
    if (searchTerm.trim() !== "") {
      navigate(`/category/search?q=${searchTerm}`);
      setSearchTerm("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") executeSearch();
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1002);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  return (
    <header>
      {/* 1. Sidebar ko bahar rakha hai taaki display:none na ho */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="logo_container">
        {/* 2. Toggle Button Logo ke saath left mein */}
        {isMobile && (
          <button className="toggle-sidebar" onClick={toggleSidebar}>
            <FaBars />
          </button>
        )}
        <Link to="/">
          <img className="myntra_home" src="images/myntra_logo.webp" alt="Myntra Home" />
        </Link>
      </div>

      {/* 3. Desktop Navigation */}
      {!isMobile && (
        <nav className="nav_bar">
          <Link className="nav_link" to="/category/Men">Men</Link>
          <Link className="nav_link" to="/category/Women">Women</Link>
          <Link className="nav_link" to="/category/Kids">Kids</Link>
          <Link className="nav_link" to="/category/Home">Home & Living</Link>
          <Link className="nav_link" to="/category/Beauty">Beauty</Link>
          <Link className="nav_link" to="#">Studio <sup>New</sup></Link>
        </nav>
      )}

      <div className="search_bar">
        <span className="material-symbols-outlined search_icon" onClick={executeSearch} style={{ cursor: "pointer" }}>
          search
        </span>
        <input
          className="search_input"
          placeholder="Search for products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      <div className="action_bar">
        <div className="action_container profile_container">
          <IoMdPerson />
          <span className="action_name">Profile</span>
          <div className="profile_dropdown">
  {user ? (
    <>
      {/* User Name aur Email Section */}
      <div style={{ padding: '10px 5px' }}>
        <p style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#282c3f' }}>
          Hello <span style={{ color: '#ff3f6c', textTransform: 'capitalize' }}>{user.name}</span>
        </p>
        <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#686b78' }}>{user.email || 'Welcome to Myntra'}</p>
      </div>

      <hr style={{ border: '0', borderTop: '1px solid #f5f5f6', margin: '10px 0' }} />

      {/* Links Section - Yahan vertical spacing add ki hai */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <Link 
          to="/page/orders" 
          style={{ textDecoration: 'none', color: '#3e4152', fontSize: '14px', fontWeight: '400' }}
          onMouseOver={(e) => e.target.style.fontWeight = '700'}
          onMouseOut={(e) => e.target.style.fontWeight = '400'}
        >
          Orders
        </Link>
        
        <span 
          onClick={handleLogout} 
          style={{ 
            color: '#ff3f6c', 
            fontSize: '14px', 
            fontWeight: '700', 
            cursor: 'pointer',
            marginTop: '5px' 
          }}
        >
          Logout
        </span>
      </div>
    </>
  ) : (
    <>
      <p style={{ fontWeight: '700', fontSize: '14px' }}>Welcome</p>
      <p style={{ fontSize: '12px', color: '#686b78' }}>To access account and manage orders</p>
      <Link to="/login" className="btn_login" style={{ 
        display: 'inline-block', 
        marginTop: '10px', 
        padding: '10px', 
        border: '1px solid #eaeaec', 
        color: '#ff3f6c', 
        fontWeight: '700', 
        textDecoration: 'none',
        textAlign: 'center'
      }}>
        LOGIN / SIGNUP
      </Link>
    </>
  )}
</div>
        </div>

        <Link className="action_container" to="/wishlist">
          <FaGrinHearts />
          <span className="action_name">Wishlist</span>
          {wishlist.length > 0 && <span className="bag-item-count">{wishlist.length}</span>}
        </Link>

        <Link className="action_container" to="/bag">
          <FaShoppingBag />
          <span className="action_name">Bag</span>
          <span className="bag-item-count">
            {bag.reduce((total, item) => total + item.quantity, 0)}
          </span>
        </Link>
      </div>
    </header>
  );
};

export default Header;