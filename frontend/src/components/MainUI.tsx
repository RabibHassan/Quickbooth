import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  get_user_role,
  getNewArrivals,
  getItems,
  getLimited,
  getProfile,
  addToCart,
} from "../api";
import Header from "./Header";
import Footer from "./Footer";
import Glider from "glider-js";
import "glider-js/glider.min.css";
import "./Main.css";

function MainPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [newArrivals, setNewArrivals] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [limited, setLimited] = useState<any[]>([]);
  const [profile, setProfile] = useState<{
    username: string;
    email: string;
    password: string;
    date_joined: string;
    id: number;
  } | null>(null);

  const navigate = useNavigate();

  const glider1Ref = useRef<HTMLDivElement>(null);
  const glider2Ref = useRef<HTMLDivElement>(null);
  const glider3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!localStorage.getItem("access_token")) {
      setIsAuthenticated(false);
      navigate("/login");
    } else {
      getProfile().then((res) => {
        setProfile(res.data);
      });
      getNewArrivals().then((res) => {
        setNewArrivals(res.data.data);
      });
      getItems().then((res) => {
        setItems(res.data.data);
      });
      getLimited().then((res) => {
        setLimited(res.data.data);
      });
      fetchUserRole();
    }
  }, [navigate]);

  // Initialize gliders after data loads
  useEffect(() => {
    if (newArrivals.length > 0 && glider1Ref.current) {
      new Glider(glider1Ref.current, {
        slidesToShow: 5,
        slidesToScroll: 1,
        dots: "#dots1",
        draggable: true,
        arrows: {
          prev: ".glider1-prev",
          next: ".glider1-next",
        },
        responsive: [
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1,
            },
          },
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 5,
              slidesToScroll: 1,
            },
          },
        ],
      });
    }
  }, [newArrivals]);

  useEffect(() => {
    if (items.length > 0 && glider2Ref.current) {
      new Glider(glider2Ref.current, {
        slidesToShow: 5,
        slidesToScroll: 1,
        dots: "#dots2",
        draggable: true,
        arrows: {
          prev: ".glider2-prev",
          next: ".glider2-next",
        },
        responsive: [
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1,
            },
          },
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 5,
              slidesToScroll: 1,
            },
          },
        ],
      });
    }
  }, [items]);
  useEffect(() => {
    if (items.length > 0 && glider3Ref.current) {
      new Glider(glider3Ref.current, {
        slidesToShow: 5,
        slidesToScroll: 1,
        dots: "#dots3",
        draggable: true,
        arrows: {
          prev: ".glider3-prev",
          next: ".glider3-next",
        },
        responsive: [
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1,
            },
          },
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 5,
              slidesToScroll: 1,
            },
          },
        ],
      });
    }
  }, [items]);

  const fetchUserRole = () => {
    get_user_role().then((res) => {
      console.log("Fetched user role: ", res.data);
      setUserRole(res.data.role);
    });
  };

  // buy_now
  const handleBuyNow = (product: any) => {
    const productWithQuantity = {
      ...product,
      quantity: 1, // Add quantity property
    };
    navigate("/checkout", { state: { product: productWithQuantity } });
  };

  //add to cart
  const handleAddToCart = async (product: any) => {
    try {
      if (!profile) return;

      const response = await addToCart(
        profile.id,
        product.product_id,
        product.product_name,
        product.price,
        product.image,
        product.store_name,
        1
      );
      if (response) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  console.log("limited", limited);

  return (
    <div>
      <img style={{ top: "120px", width: "1900px" }} src="images/banner.png" />
      <Header isAuthenticated={isAuthenticated} userRole={userRole} />

      <main
        style={{
          paddingTop: "60px",
          color: "#2b2b2b",
          backgroundColor: "#2b2b2b",
        }}
        className="main-content"
      >
        <div className="vendor-dashboard-wrapper">
          {/* First Section - New Arrivals */}
          <div className="products-section">
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
                New
              </h2>
              <h2
                style={{
                  fontFamily: '"Questrial"',
                  fontWeight: "400",
                  color: "#ffffffff",
                }}
                className="section-heading"
              >
                Arrivals
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

          {/* New Arrivals Glider */}
          <div className="glider-container">
            <div className="glider1" ref={glider1Ref}>
              {newArrivals.map((product) => (
                <div key={product.product_id} className="slide">
                  <div className="card">
                    <div className="product-img">
                      <img
                        className="img"
                        src={`images/${product.image}`}
                        alt={product.product_name}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                      }}
                      className="add-to-cart"
                    >
                      <button
                        onClick={() => handleAddToCart(product)}
                        style={{ marginBottom: "5px" }}
                        className="add-to-cart-btn"
                      >
                        Add to Cart
                      </button>
                      <button
                        onClick={() => handleBuyNow(product)}
                        style={{ marginTop: "5px" }}
                        className="add-to-cart-btn"
                      >
                        Buy Now
                      </button>
                    </div>
                    <div className="card-footer">
                      <div
                        style={{
                          width: "340px",
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <div className="title">
                          <h3>
                            {product.product_name.length > 17
                              ? product.product_name.substring(0, 14) + ".."
                              : product.product_name}
                          </h3>
                          <span>{product.product_type}</span>
                        </div>
                        <div className="price">
                          <small style={{ color: "rgb(204, 18, 37);" }}>
                            BDT
                          </small>
                          <span style={{ color: "rgb(204, 18, 37);" }}>
                            {product.price}
                          </span>
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          width: "100%",
                        }}
                      >
                        <h4
                          style={{
                            color: "GrayText",
                            fontFamily: "Questrial",
                          }}
                        >
                          {product.store_name.length > 17
                            ? product.store_name.substring(0, 14) + ".."
                            : product.store_name}
                        </h4>
                        <h4
                          style={{
                            color: " rgba(51, 155, 42, 1)",
                            fontFamily: "Questrial",
                          }}
                        >
                          in-stock: {product.quantity}
                        </h4>
                      </div>
                      <div className="product-options">
                        <div className="colors">
                          <span className="black"></span>
                          <span className="pink"></span>
                          <span className="white"></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="glider-prev glider1-prev">«</button>
            <button className="glider-next glider1-next">»</button>
            <div id="dots1"></div>
          </div>

          {/*2nd Section -Hot items  */}
          <div className="products-section" style={{ marginTop: "60px" }}>
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
                Hot
              </h2>
              <h2
                style={{
                  fontFamily: '"Questrial"',
                  fontWeight: "400",
                  color: "#ffffffff",
                }}
                className="section-heading"
              >
                Items
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

          {/* Hot items Glider */}
          <div className="glider-container">
            <div className="glider2" ref={glider2Ref}>
              {items.map((product) => (
                <div key={product.product_id} className="slide">
                  <div className="card">
                    <div className="product-img">
                      <img
                        className="img"
                        src={`images/${product.image}`}
                        alt={product.product_name}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                      }}
                      className="add-to-cart"
                    >
                      <button
                        onClick={() => handleAddToCart(product)}
                        style={{ marginBottom: "5px" }}
                        className="add-to-cart-btn"
                      >
                        Add to Cart
                      </button>
                      <button
                        onClick={() => handleBuyNow(product)}
                        style={{ marginTop: "5px" }}
                        className="add-to-cart-btn"
                      >
                        Buy Now
                      </button>
                    </div>
                    <div className="card-footer">
                      <div
                        style={{
                          width: "340px",
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <div className="title">
                          <h3>
                            {product.product_name.length > 17
                              ? product.product_name.substring(0, 14) + ".."
                              : product.product_name}
                          </h3>
                          <span>{product.product_type}</span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyItems: "center",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <div className="price">
                            <small>BDT</small>
                            <span>{product.price}</span>
                          </div>
                          <div
                            style={{
                              color: "#c4af37ff",
                              fontSize: "18px",
                              marginTop: "5px",
                            }}
                            className="stars"
                          >
                            <span className="star">★</span>
                            <span className="star">★</span>
                            <span className="star">★</span>
                            <span className="star">★</span>
                            <span className="star">★</span>
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          width: "100%",
                        }}
                      >
                        <h4
                          style={{
                            color: "GrayText",
                            fontFamily: "Questrial",
                          }}
                        >
                          {product.store_name.length > 17
                            ? product.store_name.substring(0, 14) + ".."
                            : product.store_name}
                        </h4>
                        <h4
                          style={{
                            color: " rgba(51, 155, 42, 1)",
                            fontFamily: "Questrial",
                          }}
                        >
                          in-stock: {product.quantity}
                        </h4>
                      </div>
                      <div className="product-options">
                        <div className="colors">
                          <span className="black"></span>
                          <span className="pink"></span>
                          <span className="white"></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="glider-prev glider2-prev">«</button>
            <button className="glider-next glider2-next">»</button>
            <div id="dots2"></div>
          </div>

          {/* 3rd section */}
          <div className="products-section" style={{ marginTop: "60px" }}>
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
                Limited
              </h2>
              <h2
                style={{
                  fontFamily: '"Questrial"',
                  fontWeight: "400",
                  color: "#ffffffff",
                }}
                className="section-heading"
              >
                Discount
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

          {/* Limited items Glider */}
          <div className="glider-container">
            <div className="glider3" ref={glider3Ref}>
              {limited.map((product) => (
                <div key={product.product_id} className="slide">
                  <div className="card">
                    <div className="product-img">
                      <img
                        className="img"
                        src={`images/${product.image}`}
                        alt={product.product_name}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                      }}
                      className="add-to-cart"
                    >
                      <button
                        onClick={() => handleAddToCart(product)}
                        style={{ marginBottom: "5px" }}
                        className="add-to-cart-btn"
                      >
                        Add to Cart
                      </button>
                      <button
                        onClick={() => handleBuyNow(product)}
                        style={{ marginTop: "5px" }}
                        className="add-to-cart-btn"
                      >
                        Buy Now
                      </button>
                    </div>
                    <div className="card-footer">
                      <div
                        style={{
                          width: "340px",
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <div className="title">
                          <h3>
                            {product.product_name.length > 17
                              ? product.product_name.substring(0, 14) + ".."
                              : product.product_name}
                          </h3>
                          <span>{product.product_type}</span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyItems: "center",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "15px",
                              position: "relative",
                              textDecoration: "line-through",
                              textDecorationThickness: "2px",
                            }}
                            className="price"
                          >
                            <small style={{ fontSize: "15px" }}>BDT</small>
                            <span
                              style={{
                                fontSize: "15px",
                                position: "relative",
                                textDecoration: "line-through",
                                textDecorationThickness: "2px",
                              }}
                            >
                              {product.original_price}
                            </span>
                          </div>
                          <div className="price">
                            <small style={{ color: "#1fbe1fff" }}>BDT</small>
                            <span style={{ color: "#1fbe1fff" }}>
                              {product.price}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          width: "100%",
                        }}
                      >
                        <h4
                          style={{
                            color: "GrayText",
                            fontFamily: "Questrial",
                          }}
                        >
                          {product.store_name.length > 17
                            ? product.store_name.substring(0, 14) + ".."
                            : product.store_name}
                        </h4>
                        <h4
                          style={{
                            color: " rgba(51, 155, 42, 1)",
                            fontFamily: "Questrial",
                          }}
                        >
                          in-stock: {product.quantity}
                        </h4>
                      </div>
                      <div className="product-options">
                        <div className="colors">
                          <span className="black"></span>
                          <span className="pink"></span>
                          <span className="white"></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="glider-prev glider3-prev">«</button>
            <button className="glider-next glider3-next">»</button>
            <div id="dots3"></div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default MainPage;
