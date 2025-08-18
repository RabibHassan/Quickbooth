import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../api";
import "./Main.css";

function MainPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    //Check if access tokens exists in localStorage
    if (!localStorage.getItem("access_token")) {
      setIsAuthenticated(false);
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
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
          <input
            className="searchbar"
            type="text"
            placeholder="Search for products"
          ></input>
        </div>
        <div className="icon">
          <img
            onClick={() => navigate("/profile")}
            className="icon-img"
            src="/images/icon.png"
          />
        </div>
        <div className="cart">
          <img className="cart-img" src="/images/cart.png" />
        </div>
        <div className="details">
          <div style={{ paddingTop: "10px", paddingLeft: "5px" }}>
            <p className="info">Contact us now</p>
          </div>
          <div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                style={{
                  width: "30px",
                  height: "30px",
                }}
                src="/images/call.png"
              />
              <div>
                <p className="info">+880-1739933678</p>
              </div>
            </div>
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
                style={{
                  paddingRight: "5px",
                  width: "15px",
                  height: "15px",
                }}
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
          <p className="h2n">View shops</p>
        </div>
        <div className="header2names">
          <p onClick={() => navigate("/becomeVendor")} className="h2n">
            Become a vendor
          </p>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
