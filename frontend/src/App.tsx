import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginRegPage from "./components/LoginRegPage"; // Import the new combined AuthPage
import MainUI from "./components/MainUI";
import ProfilePage from "./components/ProfilePage";
import BecomeVendorPage from "./components/BecomeVendorPage";
import VendorDashboardPage from "./components/VendorDashboardPage";
import ProductsPage from "./components/ProductsPage";
import CheckoutPage from "./components/CheckoutPage";
import CartPage from "./components/CartPage";
import PaymentSuccess from "./components/PaymentSuccess";
import PaymentFailed from "./components/PaymentFailed";
import Payment from "./components/Payment";
import SearchResults from "./components/SearchResults";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/becomeVendor"
          element={
            <ProtectedRoute>
              <BecomeVendorPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vendorDashboard"
          element={
            <ProtectedRoute>
              <VendorDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<LoginRegPage />} />
        <Route path="/login" element={<LoginRegPage />} />

        <Route path="/main" element={<MainUI />} />

        <Route path="/profile" element={<ProfilePage />} />
        {/* <Route path="/becomeVendor" element={<BecomeVendorPage />} />
        <Route path="/vendorDashboard" element={<VendorDashboardPage />} /> */}
        <Route path="/seeProducts" element={<ProductsPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/cartDashboard" element={<CartPage />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-failed" element={<PaymentFailed />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/search" element={<SearchResults />} />
      </Routes>
    </Router>
  );
}

export default App;
