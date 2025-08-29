import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addToCart, getProfile, get_user_role, getProducts } from "../api";
import Header from "./Header";
import Footer from "./Footer";
import "./Main.css";

function MainPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const navigate = useNavigate();
  const [profile, setProfile] = useState<{
    username: string;
    email: string;
    password: string;
    date_joined: string;
    id: number;
  } | null>(null);
  const [products, setProducts] = useState<
    | {
        store_name: string;
        product_id: number;
        product_name: string;
        product_type: string;
        price: number;
        quantity: number;
        image: string;
        brand: string;
      }[]
    | null
  >(null);

  //propagation func
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products
    ? products.slice(indexOfFirstProduct, indexOfLastProduct)
    : [];

  useEffect(() => {
    if (!localStorage.getItem("access_token")) {
      setIsAuthenticated(false);
      navigate("/login");
    } else {
      getProducts().then((res) => {
        setProducts(res.data.data);
      });
      getProfile().then((res) => {
        setProfile(res.data);
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

  const handleBuyNow = (product: any) => {
    const productWithQuantity = {
      ...product,
      quantity: 1,
    };
    navigate("/checkout", { state: { product: productWithQuantity } });
  };

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

  return (
    <div>
      <Header isAuthenticated={isAuthenticated} userRole={userRole} />

      <main className="main-content">
        <div className="vendor-dashboard-wrapper">
          <div className="products-section">
            <div className="h2deets">
              <h2
                style={{
                  fontFamily: '"Questrial"',
                  fontWeight: "400",
                  color: "#c07cd4",
                  marginRight: "10px",
                }}
                className="section-heading"
              >
                Available
              </h2>
              <h2
                style={{
                  fontFamily: '"Questrial"',
                  fontWeight: "400",
                  color: "#ffffffff",
                }}
                className="section-heading"
              >
                Products
              </h2>
            </div>
            <div
              style={{
                width: "50%",
                height: "2px",
                backgroundColor: "#c07cd4",
                marginTop: "10px",
                borderRadius: "1px",
              }}
            ></div>

            <div className="body">
              {products && products.length > 0 ? (
                <>
                  {currentProducts.map((product) => (
                    <div
                      key={product.product_id}
                      className="card"
                      onMouseLeave={(e) => {
                        const sel = e.currentTarget.querySelector(
                          ".add-to-cart-select"
                        ) as HTMLSelectElement | null;
                        sel?.blur();
                      }}
                    >
                      {/* Your existing product card code */}
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
                        {/* Your existing card footer code */}
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
                            <small>BDT</small>
                            <span>{product.price}</span>
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
                  ))}

                  {/* Add pagination controls */}
                  {products.length > productsPerPage && (
                    <div className="pagination-controls">
                      <button
                        className="page-btn"
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                      >
                        ←
                      </button>
                      <span className="page-number">
                        Page {currentPage} of{" "}
                        {Math.ceil(products.length / productsPerPage)}
                      </span>
                      <button
                        className="page-btn"
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(
                              prev + 1,
                              Math.ceil(products.length / productsPerPage)
                            )
                          )
                        }
                        disabled={
                          currentPage ===
                          Math.ceil(products.length / productsPerPage)
                        }
                      >
                        →
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div>
                  <h3>No Products Found</h3>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default MainPage;
