import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer>
      <div className="footer_container">
        <div className="footer_column">
          <h3>ONLINE SHOPPING</h3>
          {/* href="#" ko hatakar Link to="..." lagaya hai */}
          <Link to="/category/Men">Men</Link>
          <Link to="/category/Women">Women</Link>
          <Link to="/category/Kids">Kids</Link>
          <Link to="/category/Home & Living">Home & Living</Link>
          <Link to="/category/Beauty">Beauty</Link>
          <Link to="/gift-cards">Gift Card</Link>
          <Link to="/insider">Myntra Insider</Link>
        </div>

        <div className="footer_column">
          <h3>CUSTOMER POLICIES</h3>
          <Link to="/page/contact-us">Contact Us</Link>
          <Link to="/page/faq">FAQ</Link>
          <Link to="/page/t-and-c">T&C</Link>
          <Link to="/page/terms-of-use">Terms Of Use</Link>
          <Link to="/page/track-orders">Track Orders</Link>
          <Link to="/page/shipping">Shipping</Link>
          <Link to="/page/cancellation">Cancellation</Link>
        </div>

        <div className="footer_column">
          <h3>EXPERIENCE MYNTRA APP ON MOBILE</h3>
          <div className="keep_in_touch">
            <a href="https://facebook.com" target="_blank">Facebook</a>
            <a href="https://twitter.com" target="_blank">Twitter</a>
            <a href="https://youtube.com" target="_blank">YouTube</a>
            <a href="https://instagram.com" target="_blank">Instagram</a>
          </div>
        </div>
      </div>
      <hr />

      <div className="footer_bottom_admin" style={{ textAlign: 'center', padding: '10px' }}>
        <p className="copyright">
          © 2026 www.myntra.com. All rights reserved.
        </p>
        <Link to="/admin-add" style={{ 
            color: '#94969f', 
            fontSize: '11px', 
            textDecoration: 'none',
            opacity: '0.6' 
        }}>
          Admin Login
        </Link>
      </div>
    </footer>
  );
};

export default Footer;