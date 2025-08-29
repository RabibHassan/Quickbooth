import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import "./PaymentResult.css";

const PaymentFailed = () => {
  const navigate = useNavigate();

  return (
    <div className="payment-result">
      <Header isAuthenticated={true} userRole={null} />
      <div className="failed-content">
        <h2>Payment Failed</h2>
        <p>Something went wrong with your payment. Please try again.</p>
        <button onClick={() => navigate("/checkout")}>Try Again</button>
      </div>
      <Footer />
    </div>
  );
};

export default PaymentFailed;
