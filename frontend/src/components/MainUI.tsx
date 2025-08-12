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
              marginTop: "30px",
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
          <img className="icon-img" src="/images/icon.png" />
        </div>
        <div className="cart">
          <img className="cart-img" src="/images/cart.png" />
        </div>
        <div className="details">
          <div style={{ paddingTop: "10px" }}>
            <p className="info">Contact us now</p>
          </div>
          <div>
            <p className="info">🎧 +880-1739933678</p>
          </div>
          <div style={{ paddingBottom: "10px" }}>
            <p
              style={{ cursor: "pointer" }}
              className="info"
              onClick={() =>
                window.open("https://github.com/RabibHassan", "_blank")
              }
            >
              🔗 github profile
            </p>
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
    </div>
  );
}

export default MainPage;
