import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  get_user_role,
  getProfile,
  initiatePay,
  saveTransaction,
} from "../api";
import Header from "./Header";
import Footer from "./Footer";
import "./Payment.css";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [profile, setProfile] = useState<any>(null);
  const { product, shippingInfo } = location.state;

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

  const fetchUserRole = () => {
    get_user_role().then((res) => {
      setUserRole(res.data.role);
    });
  };

  if (profile) {
  }

  const handlePayment = async () => {
    try {
      const paymentData = {
        amount: product.price * product.quantity,
        product_name: product.product_name,
      };

      const response = await initiatePay(paymentData);
      if (response.data.transaction_id) {
        await saveTransaction({
          transaction_id: response.data.transaction_id,
          amount: response.data.amount,
        });

        navigate("/payment-success", {
          state: {
            cred: {
              product_id: product.product_id,
              transaction_id: response.data.transaction_id,
              amount: response.data.amount,
              phone: shippingInfo.phone,
              address: shippingInfo.address,
              city: shippingInfo.city,
              postalCode: shippingInfo.postalCode,
            },
          },
        });
      }
    } catch (error) {
      console.error("Payment initiation failed:", error);
      navigate("/payment-failed");
    }
  };
  return (
    <div className="payment-page">
      <Header isAuthenticated={isAuthenticated} userRole={userRole} />

      <div className="payment-container">
        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="product-details">
            <img src={`images/${product.image}`} alt={product.product_name} />
            <div className="details">
              <h3>{product.product_name}</h3>
              <p>Quantity: {product.quantity}</p>
              <p>Price: BDT {product.price}</p>
              <p>Total: BDT {product.price * product.quantity}</p>
            </div>
          </div>

          <div className="shipping-info">
            <h3>Shipping Information</h3>
            <p>{shippingInfo.fullName}</p>
            <p>{shippingInfo.email}</p>
            <p>{shippingInfo.phone}</p>
            <p>{shippingInfo.address}</p>
            <p>
              {shippingInfo.city}, {shippingInfo.postalCode}
            </p>
          </div>

          <button className="confirm-payment-btn" onClick={handlePayment}>
            Confirm Payment
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Payment;
