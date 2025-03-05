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
        <Link to="#" onClick={toggleSidebar}>Men</Link>
        <Link to="#" onClick={toggleSidebar}>Women</Link>
        <Link to="#" onClick={toggleSidebar}>Kids</Link>
        <Link to="#" onClick={toggleSidebar}>Home & Living</Link>
        <Link to="#" onClick={toggleSidebar}>Beauty</Link>
        <Link to="#" onClick={toggleSidebar}>
          Studio <sup>New</sup>
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
