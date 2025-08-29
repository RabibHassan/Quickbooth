import "./Footer.css"; // Optional: You can still use your custom styles if needed.
function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-top">
        <div className="footer-left">
          <p className="footer-logo">QUICKBooth store</p>
          <p className="footer-contact">Got questions? Call us 24/7!</p>
          <p className="footer-phone">03 111 666 144 | 0317 7777015</p>
        </div>
        <div className="footer-center">
          <h4 className="footer-title">Trending</h4>
          <ul className="footer-links">
            <li>Instalments</li>
            <li>Electronics</li>
            <li>Grocery</li>
            <li>Health & Beauty</li>
            <li>Home Appliances</li>
            <li>Mobile Accessories</li>
          </ul>
        </div>
        <div className="footer-center">
          <h4 className="footer-title">Information</h4>
          <ul className="footer-links">
            <li>About Us</li>
            <li>Contact Us</li>
            <li>FAQs</li>
            <li>Shipping & Return</li>
            <li>Privacy Policy</li>
            <li>Terms & Conditions</li>
          </ul>
        </div>
        <div className="footer-right">
          <h4 className="footer-title">Customer Care</h4>
          <ul className="footer-links">
            <li>My Account</li>
            <li>Track Your Order</li>
            <li>Recently Viewed</li>
            <li>Wishlist</li>
            <li>Compare</li>
            <li>Become a Vendor</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="footer-text">
          © 2025 QUICKBooth Store. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
