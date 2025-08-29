import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { get_user_role, getProfile, addOrders } from "../api";
import Footer from "./Footer";
import "./Main.css";
import "./PaymentResult.css";

interface credentials {
  product_id: number;
  transaction_id: string;
  amount: number;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const cred = location.state?.cred as credentials;
  const [userRole, setUserRole] = useState<string | null>(null);
  const [profile, setProfile] = useState<{
    username: string;
    email: string;
    password: string;
    date_joined: string;
    id: number;
  } | null>(null);

  if (profile && userRole) {
  }

  const fetchUserRole = () => {
    get_user_role().then((res) => {
      setUserRole(res.data.role);
    });
  };

  useEffect(() => {
    if (!localStorage.getItem("access_token")) {
      navigate("/login");
      return;
    }
    getProfile()
      .then((res) => {
        setProfile(res.data);
        const pay_status = "Successful";
        const product_id = cred.product_id;
        const transaction_id = cred.transaction_id;
        const amount = cred.amount;
        const phone = cred.phone;
        const address = cred.address;
        const city = cred.city;
        const postalCode = cred.postalCode;

        if (pay_status === "Successful" && transaction_id) {
          addOrders(
            res.data.id,
            product_id,
            transaction_id,
            amount,
            phone,
            address,
            city,
            postalCode
          )
            .then(() => {
              console.log("Order created successfully");
            })
            .catch((error) => {
              console.error("Error creating order:", error);
            });
        }
      })
      .catch((error) => {
        console.error("Error fetching profile:", error);
        navigate("/login");
      });

    fetchUserRole();
  }, [cred, navigate]);

  return (
    <div className="payment-result">
      <div
        style={{ marginTop: "100px", marginBottom: "100px" }}
        className="success-content"
      >
        <h2>Payment Successful!</h2>
        <p>
          Your order has been placed successfully and your invoice has been
          mailed.
        </p>
        <p>
          You might need to check your spam folder if you are ordering from here
          for the first time. Thank you!
        </p>
        <button onClick={() => navigate("/main")}>Back to Home</button>
      </div>
      <Footer />
    </div>
  );
};

export default PaymentSuccess;
