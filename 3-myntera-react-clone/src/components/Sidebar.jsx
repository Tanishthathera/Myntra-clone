import React from "react";
import { Link } from "react-router-dom";
import { MdClose } from "react-icons/md";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <button onClick={toggleSidebar} className="close-btn">
        <MdClose />
      </button>
      <nav className="side-nav">
        <Link to="/category/men" onClick={toggleSidebar}>Men</Link>
        <Link to="/category/women" onClick={toggleSidebar}>Women</Link>
        <Link to="/category/kids" onClick={toggleSidebar}>Kids</Link>
        <Link to="/category/home-living" onClick={toggleSidebar}>Home & Living</Link>
        <Link to="/category/beauty" onClick={toggleSidebar}>Beauty</Link>
        <Link to="/category/studio" onClick={toggleSidebar}>
          Studio <sup>New</sup>
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
