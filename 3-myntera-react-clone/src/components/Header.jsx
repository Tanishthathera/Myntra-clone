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
                <p>Welcome, <strong>{user.name}</strong></p>
                <hr />
                <Link to="/page/orders">Orders</Link>
                <span onClick={handleLogout} style={{ color: '#ff3f6c', cursor: 'pointer' }}>Logout</span>
              </>
            ) : (
              <>
                <p>Welcome</p>
                <Link to="/login" className="btn_login">LOGIN / SIGNUP</Link>
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