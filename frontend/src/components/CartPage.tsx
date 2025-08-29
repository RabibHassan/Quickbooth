import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getCurrentOrders,
  get_user_role,
  getProfile,
  getCartDetails,
  removeItems,
} from "../api";
import Header from "./Header";
import Footer from "./Footer";
import "./Cart.css";

interface CartItem {
  product_id: number;
  product_name: string;
  price: number;
  image: string;
  store_name: string;
  quantity: number;
}

function CartPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [profile, setProfile] = useState<{
    username: string;
    email: string;
    password: string;
    date_joined: string;
    id: number;
  } | null>(null);

  if (profile && location) {
  }

  useEffect(() => {
    if (!localStorage.getItem("access_token")) {
      setIsAuthenticated(false);
      navigate("/login");
    } else {
      getProfile().then((res) => {
        setProfile(res.data);
      });
      getCartDetails().then((res) => {
        setCartItems(res.data.data);
      });
      getCurrentOrders().then((res) => {
        setOrderItems(res.data.data);
      });
      fetchUserRole();
    }
  }, [navigate]);

  const fetchUserRole = () => {
    get_user_role().then((res) => {
      console.log("Fetched user role: ", res.data);
      setUserRole(res.data.role);
    });
  };

  const updateQuantity = (productId: string, newQuantity: string) => {
    setCartItems(
      cartItems.map((item) =>
        item.product_id === productId
          ? { ...item, quantity: parseInt(newQuantity) }
          : item
      )
    );
  };

  const handleConfirmOrder = (item: CartItem) => {
    navigate("/checkout", {
      state: {
        product: {
          product_id: item.product_id,
          product_name: item.product_name,
          price: item.price,
          image: item.image,
          store_name: item.store_name,
          quantity: item.quantity,
        },
      },
    });
  };

  const removeFromCart = async (productId: number) => {
    const response = await removeItems(productId);
    if (response.status === 200) {
      window.location.reload();
    }
  };

  console.log("items", orderItems);

  return (
    <div className="cart-page">
      <Header isAuthenticated={isAuthenticated} userRole={userRole} />
      <div className="containers-wrapper">
        {" "}
        {/* Add this wrapper */}
        {/* Shopping Cart Container */}
        <div className="cart-container">
          <div style={{ paddingBottom: "20px" }} className="products-section">
            <div className="h2deets">
              <h2
                style={{
                  fontFamily: '"Questrial"',
                  fontWeight: "400",
                  color: "#c07cd4",
                  marginRight: "10px",
                  paddingLeft: "20px",
                }}
                className="section-heading"
              >
                Shopping
              </h2>
              <h2
                style={{
                  fontFamily: '"Questrial"',
                  fontWeight: "400",
                  color: "#ffffffff",
                }}
                className="section-heading"
              >
                Cart
              </h2>
            </div>
            <div
              style={{
                width: "50%",
                height: "2px",
                backgroundColor: "#c07cd4",
                marginTop: "10px",
                borderRadius: "1px",
                marginLeft: "20px",
              }}
            ></div>
          </div>

          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <p>Your cart is empty</p>
            </div>
          ) : (
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item.product_id} className="cart-item">
                  <div className="item-image">
                    <img src={`images/${item.image}`} alt={item.product_name} />
                  </div>

                  <div className="item-details">
                    <h3>{item.product_name}</h3>
                    <p className="store-name">{item.store_name}</p>
                    <p className="quantity">Quantity: {item.quantity}</p>
                  </div>

                  <div className="quant-select">
                    <div className="form">
                      <label style={{ marginBottom: "50p" }} htmlFor="quantity">
                        Select Quantity:
                      </label>
                      <select
                        style={{ marginBottom: "50p" }}
                        className="form-input"
                        id="quantity"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item.product_id, e.target.value)
                        }
                      >
                        {[...Array(10).keys()].map((num) => (
                          <option key={num + 1} value={num + 1}>
                            {num + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div
                    style={{
                      width: "180px",
                      alignItems: "center",
                    }}
                    className="item-price"
                  >
                    <p
                      style={{
                        width: "180px",
                        paddingTop: "80px",
                        paddingRight: "20px",
                      }}
                      className="price"
                    >
                      BDT {item.price}
                    </p>
                  </div>
                  <div className="item-actions">
                    <button
                      className="confirm-order-btn"
                      onClick={() => handleConfirmOrder(item)}
                    >
                      Confirm Order
                    </button>
                    <button
                      className="remove-btn"
                      onClick={() => removeFromCart(item.product_id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Current Orders Container */}
        <div className="cart-container">
          <div style={{ paddingBottom: "20px" }} className="products-section">
            <div className="h2deets">
              <h2
                style={{
                  fontFamily: '"Questrial"',
                  fontWeight: "400",
                  color: "#c07cd4",
                  marginRight: "10px",
                  paddingLeft: "20px",
                }}
                className="section-heading"
              >
                Track
              </h2>
              <h2
                style={{
                  fontFamily: '"Questrial"',
                  fontWeight: "400",
                  color: "#ffffffff",
                }}
                className="section-heading"
              >
                Orders
              </h2>
            </div>
            <div
              style={{
                width: "50%",
                height: "2px",
                backgroundColor: "#c07cd4",
                marginTop: "10px",
                borderRadius: "1px",
                marginLeft: "20px",
              }}
            ></div>
          </div>

          {/* Hardcoded orders for now */}
          {orderItems.length === 0 ? (
            <div className="empty-cart">
              <p>You have no current orders</p>
            </div>
          ) : (
            <div className="cart-items">
              {orderItems.map((items) => (
                <div key={items.product_id} className="cart-item">
                  <div className="item-image">
                    <img
                      src={`images/${items.image}`}
                      alt={items.product_name}
                    />
                  </div>
                  <div className="item-details">
                    <h3>{items.product_name}</h3>
                    <p>Order ID: #QB00{items.order_id}</p>
                    <p>Transaction ID: {items.transaction_id}</p>
                    <p
                      className="status"
                      style={{
                        color:
                          items.status === "Delivered" ? "#4CAF50" : "#FFA500",
                      }}
                    >
                      Status: {items.status}
                    </p>
                    <small>Address: {items.address}</small>
                  </div>
                  <div className="item-price">
                    <p className="price">BDT {items.amount}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>{" "}
      {/* Close the wrapper */}
      <Footer />
    </div>
  );
}

export default CartPage;
