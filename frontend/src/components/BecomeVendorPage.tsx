import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { get_user_role, getProfile, vendorForm } from "../api";
import Header from "./Header";
import Footer from "./Footer";
import "./Main.css";

function BecomeVendorPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [, setError] = useState<string>("");
  const navigate = useNavigate();
  const [profile, setProfile] = useState<{ id: number } | null>(null);
  const [store_name, setStore_name] = useState<string>("");
  const [store_type, setStore_type] = useState<string>("");
  const [vendor_name, setVendor_name] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState<string>("");

  useEffect(() => {
    // Check if access tokens exist in localStorage
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

  const handleVendorform = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!profile) return;
      const response = await vendorForm(profile.id, store_name, store_type);
      if (response) {
        window.location.reload();
      }
    } catch (err: unknown) {
      setError("Registration Failed. Please try again");
    }
  };

  return (
    <div>
      <Header isAuthenticated={isAuthenticated} userRole={userRole} />

      <main className="main-content">
        <div className="profile-page-container">
          <div
            style={{
              width: "750px",
              minHeight: "400px",
              height: "auto",
              maxWidth: "90%",
            }}
            className="profile-container"
          >
            <div className="profile-update">
              <h1 className="form-title">Become a Vendor</h1>
              <form onSubmit={handleVendorform} className="form">
                <label className="form-label">Store Name:</label>
                <input
                  type="text"
                  placeholder="Enter Store Name"
                  value={store_name}
                  onChange={(e) => setStore_name(e.target.value)}
                  className="form-input"
                  required
                />

                <label className="form-label">Store Type:</label>
                <select
                  value={store_type}
                  onChange={(e) => setStore_type(e.target.value)}
                  className="form-input"
                  required
                >
                  <option value="">Select Store Type</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Footwear">Footwear</option>
                </select>

                <label className="form-label">Vendor Name:</label>
                <input
                  type="text"
                  placeholder="Enter Vendor Name"
                  value={vendor_name}
                  onChange={(e) => setVendor_name(e.target.value)}
                  className="form-input"
                  required
                />

                <label className="form-label">Phone Number:</label>
                <input
                  type="text"
                  placeholder="+880-"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="form-input"
                  required
                />

                <label className="form-label">Store Address:</label>
                <input
                  type="text"
                  placeholder="Enter Physical Store Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="form-input"
                  required
                />

                <button type="submit" className="form-button">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default BecomeVendorPage;
