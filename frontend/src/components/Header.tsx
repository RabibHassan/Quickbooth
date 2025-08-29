// Header.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { logout } from "../api";

interface HeaderProps {
  isAuthenticated: boolean;
  userRole: string | null;
}

const Header: React.FC<HeaderProps> = ({ isAuthenticated, userRole }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleVendorNavigation = () => {
    if (userRole === "vendor") {
      navigate("/vendorDashboard");
    } else {
      navigate("/becomeVendor");
    }
  };

  const handleProductNavigation = () => {
    navigate("/seeProducts");
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchQuery && searchQuery.trim() !== "") {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div>
      <div className="header1">
        <div className="name">
          <h2
            style={{
              color: "aliceblue",
              marginLeft: "20px",
              marginRight: "100px",
            }}
          >
            QuickBooth
          </h2>
        </div>
        <div className="search">
          <form onSubmit={handleSearch}>
            <input
              className="searchbar"
              type="text"
              placeholder="Search for products"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>
        <div className="icon">
          <img
            onClick={() => navigate("/profile")}
            className="icon-img"
            src="/images/icon.png"
          />
        </div>
        <div className="cart">
          <img
            onClick={() => navigate("/cartDashboard")}
            className="cart-img"
            src="/images/cart 1.png"
          />
        </div>
        <div className="details">
          <div
            style={{
              paddingTop: "10px",
              paddingLeft: "5px",
              paddingBottom: "10px",
            }}
          >
            <p className="info">Contact us now</p>
          </div>
          <div style={{ paddingBottom: "10px", paddingRight: "25px" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                style={{ paddingRight: "5px", width: "15px", height: "15px" }}
                src="/images/link.png"
              />
              <p
                style={{ cursor: "pointer" }}
                className="info"
                onClick={() =>
                  window.open("https://github.com/RabibHassan", "_blank")
                }
              >
                github profile
              </p>
            </div>
          </div>
        </div>
        {isAuthenticated && (
          <div className="logout">
            <button className="logout-b" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>

      <div className="header2">
        <div className="header2names">
          <p
            className="h2n"
            onClick={() => {
              navigate("/main");
              window.location.reload();
            }}
          >
            ≡Home
          </p>
        </div>
        <div className="header2names">
          <p onClick={handleProductNavigation} className="h2n">
            Products
          </p>
        </div>
        <div className="header2names">
          <p onClick={handleVendorNavigation} className="h2n">
            {userRole === "vendor" ? "My Store" : "Become a vendor"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Header;
