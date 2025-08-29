import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { searchProducts, addToCart, getProfile } from "../api";
import Header from "./Header";
import Footer from "./Footer";
import "./Main.css";

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search).get("query") || "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [searchResponse, profileResponse] = await Promise.all([
          searchProducts(query),
          getProfile(),
        ]);
        setResults(searchResponse.data.data);
        setProfile(profileResponse.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchData();
    }
  }, [query]);

  // buy_now
  const handleBuyNow = (product: any) => {
    const productWithQuantity = {
      ...product,
      quantity: 1,
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

  return (
    <div>
      <Header isAuthenticated={true} userRole={null} />
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
              >
                Search Results for
              </h2>
              <h2
                style={{
                  fontFamily: '"Questrial"',
                  fontWeight: "400",
                  color: "#ffffffff",
                }}
              >
                "{query}"
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
              {loading ? (
                <p>Loading...</p>
              ) : results.length === 0 ? (
                <h3>No Products Found</h3>
              ) : (
                results.map((product: any) => (
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
                          style={{ color: "GrayText", fontFamily: "Questrial" }}
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
                ))
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SearchResults;
