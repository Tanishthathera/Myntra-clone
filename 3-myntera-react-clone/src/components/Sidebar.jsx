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
        <Link to="/category/Men" onClick={toggleSidebar}>Men</Link>
        <Link to="/category/Women" onClick={toggleSidebar}>Women</Link>
        <Link to="/category/Kids" onClick={toggleSidebar}>Kids</Link>
        <Link to="/category/Home & Living" onClick={toggleSidebar}>Home & Living</Link>
        <Link to="/category/Beauty" onClick={toggleSidebar}>Beauty</Link>
        <Link to="#" onClick={toggleSidebar}>
          Studio <sup>New</sup>
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
