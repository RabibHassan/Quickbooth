import React from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { get_user_role, getProfile } from "../api";
import Header from "./Header";
import Footer from "./Footer";
import "./Checkout.css";

interface ProductInfo {
  product_id: number;
  product_name: string;
  price: number;
  image: string;
  store_name: string;
  quantity: number;
}

const Checkout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product as ProductInfo;
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [profile, setProfile] = useState<{
    username: string;
    email: string;
    password: string;
    date_joined: string;
    id: number;
  } | null>(null);

  if (profile) {
    null;
  }

  const fetchUserRole = () => {
    get_user_role().then((res) => {
      console.log("Fetched user role: ", res.data);
      setUserRole(res.data.role);
    });
  };

  useEffect(() => {
    if (!localStorage.getItem("access_token")) {
      setIsAuthenticated(false);
      navigate("/login");
    } else {
      getProfile().then((res) => {
        setProfile(res.data);
      });
      fetchUserRole();
    }
  }, [navigate]);
  if (!product) {
    return <div>No product information available</div>;
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    navigate("/payment", {
      state: {
        product: product,
        shippingInfo: {
          fullName: formData.get("fullName"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          address: formData.get("address"),
          city: formData.get("city"),
          postalCode: formData.get("postalCode"),
        },
      },
    });
  };

  return (
    <div className="checkout-container">
      <Header isAuthenticated={isAuthenticated} userRole={userRole} />
      <div className="checkout-content">
        <div className="product-summary">
          <h2>Order Summary</h2>
          <div className="product-details">
            <img src={`images/${product.image}`} alt={product.product_name} />
            <div className="product-info">
              <div>
                <h3>{product.product_name}</h3>
              </div>
              <div>
                <p>Store: {product.store_name}</p>
              </div>
              <div>
                <p style={{ paddingRight: "50px" }} className="price">
                  BDT {product.price}
                </p>
              </div>
              <div>
                <p>Quantity: {product.quantity}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="checkout-form">
          <h2 style={{ marginBottom: "15px" }}>Shipping Information</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                required
              />
            </div>
            <div className="form-group">
              <input type="email" name="email" placeholder="Email" required />
            </div>
            <div className="form-group">
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                required
              />
            </div>
            <div className="form-group">
              <textarea
                name="address"
                placeholder="Shipping Address"
                required
              ></textarea>
            </div>
            <div className="form-group">
              <input type="text" name="city" placeholder="City" required />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="postalCode"
                placeholder="Postal Code"
                required
              />
            </div>

            <div className="payment-section">
              <h2>Payment Method</h2>
              <div className="payment-options">
                <label>
                  <input type="radio" name="payment" value="card" required />
                  Credit/Debit Card
                </label>
                <label>
                  <input type="radio" name="payment" value="bkash" />
                  bKash
                </label>
                <label>
                  <input type="radio" name="payment" value="cod" />
                  Cash on Delivery
                </label>
              </div>
            </div>

            <div className="order-summary">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>BDT {product.price * product.quantity}</span>
              </div>
              <div className="summary-row">
                <span>Shipping:</span>
                <span>BDT 60</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>BDT {product.price * product.quantity + 60}</span>
              </div>
            </div>

            <button type="submit" className="place-order-btn">
              Place Order
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;
