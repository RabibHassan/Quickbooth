import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  addToCart,
  get_user_role,
  getProfile,
  addProduct,
  getVproducts,
} from "../api";
import Header from "./Header";
import Footer from "./Footer";
import "./Main.css";
import "./Card.css";

function VendorDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userShop_type, setUserShop_type] = useState<string | null>(null);
  const [, setError] = useState<string>("");
  const navigate = useNavigate();
  const [profile, setProfile] = useState<{
    username: string;
    email: string;
    password: string;
    date_joined: string;
    id: number;
  } | null>(null);

  // Add pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5; // Show 5 products per page

  const [vproducts, setVproducts] = useState<
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

  // Calculate current products for pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = vproducts
    ? vproducts.slice(indexOfFirstProduct, indexOfLastProduct)
    : [];

  const [product_name, setProduct_name] = useState<string>("");
  const [product_type, setProduct_type] = useState<string>("");
  const [brand, setBrand] = useState<string>("");
  const [price, setPrice] = useState<number>(1);
  const [quantity, setQuantity] = useState<number>(1);
  const [image, setImage] = useState<string>("");

  useEffect(() => {
    if (!localStorage.getItem("access_token")) {
      setIsAuthenticated(false);
      navigate("/login");
    } else {
      getProfile().then((res) => {
        setProfile(res.data);
      });
      getVproducts().then((res) => {
        setVproducts(res.data.data);
      });
      fetchUserRole();
    }
  }, [navigate]);

  const fetchUserRole = () => {
    get_user_role().then((res) => {
      setUserRole(res.data.role);
      setUserShop_type(res.data.shop_type);
    });
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!profile) return;

      const response = await addProduct(
        profile.id,
        product_name,
        product_type,
        price,
        quantity,
        image,
        brand
      );
      if (response) {
        window.location.reload();
      }
    } catch (err: unknown) {
      setError("Product addition failed. Please try again");
    }
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
                Your
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
              {vproducts && vproducts.length > 0 ? (
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
                </>
              ) : (
                <div>
                  <h3>No Products Found</h3>
                </div>
              )}
            </div>

            {/* Add pagination controls */}
            {vproducts && vproducts.length > productsPerPage && (
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
                  {Math.ceil(vproducts.length / productsPerPage)}
                </span>
                <button
                  className="page-btn"
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(
                        prev + 1,
                        Math.ceil(vproducts.length / productsPerPage)
                      )
                    )
                  }
                  disabled={
                    currentPage ===
                    Math.ceil(vproducts.length / productsPerPage)
                  }
                >
                  →
                </button>
              </div>
            )}
          </div>

          {/* what is it header */}
          <div style={{ marginTop: "10px" }} className="h2deets">
            <h2
              style={{
                fontFamily: '"Questrial"',
                fontWeight: "400",
                color: "#c07cd4",
                marginRight: "10px",
              }}
              className="section-heading"
            >
              Add
            </h2>
            <h2
              style={{
                fontFamily: '"Questrial"',
                fontWeight: "400",
                color: "#ffffffff",
              }}
              className="section-heading"
            >
              More Products
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

          {/* add product form */}
          {userShop_type === "Electronics" ? (
            <div className="profile-page-container">
              <div
                style={{
                  width: "750px",
                  minHeight: "400px",
                  height: "auto",
                }}
                className="profile-container"
              >
                <div className="profile-update">
                  <h1 className="form-title">Add Product to Your Store</h1>
                  <form onSubmit={handleAddProduct} className="form">
                    <label className="form-label">Product Type:</label>
                    <select
                      value={product_type}
                      onChange={(e) => {
                        setProduct_type(e.target.value);
                        setBrand(""); // Reset brand
                        setProduct_name(""); // Reset product name
                        setImage(""); // Reset image
                      }}
                      className="form-input"
                      required
                    >
                      <option value="">Select The Product Type</option>
                      <option value="Mobile">Mobile Phones</option>
                      <option value="Television">Television</option>
                      <option value="AC">AC</option>
                      <option value="WashingMachine">Washing Machine</option>
                    </select>

                    {/* Brand Selection */}
                    {product_type === "Mobile" ? (
                      <>
                        <label className="form-label">Brand</label>
                        <select
                          value={brand}
                          onChange={(e) => {
                            setBrand(e.target.value);
                            setProduct_name(""); // Reset product name
                            setImage(""); // Reset image
                          }}
                          className="form-input"
                          required
                        >
                          <option value="">Select The Brand</option>
                          <option value="Apple">Apple</option>
                          <option value="Samsung">Samsung</option>
                        </select>
                      </>
                    ) : product_type === "Television" ? (
                      <>
                        <label className="form-label">Brand</label>
                        <select
                          value={brand}
                          onChange={(e) => {
                            setBrand(e.target.value);
                            setProduct_name("");
                            setImage("");
                          }}
                          className="form-input"
                          required
                        >
                          <option value="">Select The Brand</option>
                          <option value="Sony">Sony</option>
                          <option value="LG">LG</option>
                        </select>
                      </>
                    ) : product_type === "AC" ? (
                      <>
                        <label className="form-label">Brand</label>
                        <select
                          value={brand}
                          onChange={(e) => {
                            setBrand(e.target.value);
                            setProduct_name("");
                            setImage("");
                          }}
                          className="form-input"
                          required
                        >
                          <option value="">Select The Brand</option>
                          <option value="General">General</option>
                          <option value="Singer">Singer</option>
                        </select>
                      </>
                    ) : product_type === "WashingMachine" ? (
                      <>
                        <label className="form-label">Brand</label>
                        <select
                          value={brand}
                          onChange={(e) => {
                            setBrand(e.target.value);
                            setProduct_name("");
                            setImage("");
                          }}
                          className="form-input"
                          required
                        >
                          <option value="">Select The Brand</option>
                          <option value="Panasonic">Panasonic</option>
                          <option value="Walton">Walton</option>
                        </select>
                      </>
                    ) : null}

                    {/* Product Name Selection - Auto-generates image */}
                    {product_type === "Mobile" && brand === "Apple" ? (
                      <>
                        <label className="form-label">Product Name:</label>
                        <select
                          value={product_name}
                          onChange={(e) => {
                            setProduct_name(e.target.value);
                            setImage(e.target.value + ".png"); // ✅ Auto-generate image name
                          }}
                          className="form-input"
                          required
                        >
                          <option value="">Select iPhone Model</option>
                          <option value="iPhone 15 Pro Max">
                            iPhone 15 Pro Max
                          </option>
                          <option value="iPhone 15 Pro">iPhone 15 Pro</option>
                          <option value="iPhone 15">iPhone 15</option>
                          <option value="iPhone 14">iPhone 14</option>
                          <option value="iPhone SE">iPhone SE</option>
                        </select>
                      </>
                    ) : product_type === "Mobile" && brand === "Samsung" ? (
                      <>
                        <label className="form-label">Product Name:</label>
                        <select
                          value={product_name}
                          onChange={(e) => {
                            setProduct_name(e.target.value);
                            setImage(e.target.value + ".png"); // ✅ Auto-generate image name
                          }}
                          className="form-input"
                          required
                        >
                          <option value="">Select Samsung Model</option>
                          <option value="Galaxy S24 Ultra">
                            Galaxy S24 Ultra
                          </option>
                          <option value="Galaxy S24">Galaxy S24</option>
                          <option value="Galaxy A54">Galaxy A54</option>
                          <option value="Galaxy Z Fold_5">
                            Galaxy Z Fold 5
                          </option>
                          <option value="Galaxy Note 20">Galaxy Note 20</option>
                        </select>
                      </>
                    ) : product_type === "Television" && brand === "LG" ? (
                      <>
                        <label className="form-label">Product Name:</label>
                        <select
                          value={product_name}
                          onChange={(e) => {
                            setProduct_name(e.target.value);
                            setImage(e.target.value + ".png");
                          }}
                          className="form-input"
                          required
                        >
                          <option value="">Select LG TV Model</option>
                          <option value="LG 55 OLED C3">LG 55" OLED C3</option>
                          <option value="LG 65 NanoCell">
                            LG 65" NanoCell
                          </option>
                          <option value="LG 43 UltraHD">LG 43" UltraHD</option>
                          <option value="LG 77 OLED G3">LG 77" OLED G3</option>
                        </select>
                      </>
                    ) : product_type === "Television" && brand === "Sony" ? (
                      <>
                        <label className="form-label">Product Name:</label>
                        <select
                          value={product_name}
                          onChange={(e) => {
                            setProduct_name(e.target.value);
                            setImage(e.target.value + ".png");
                          }}
                          className="form-input"
                          required
                        >
                          <option value="">Select Sony TV Model</option>
                          <option value="Sony Bravia XR A90J OLED">
                            Sony Bravia XR A90J OLED
                          </option>
                          <option value="Sony X90K 4K LED">
                            Sony X90K 4K LED
                          </option>
                          <option value="Sony Bravia XR X95J">
                            Sony Bravia XR X95J
                          </option>
                          <option value="Sony A80J OLED">Sony A80J OLED</option>
                        </select>
                      </>
                    ) : product_type === "AC" && brand === "General" ? (
                      <>
                        <label className="form-label">Product Name:</label>
                        <select
                          value={product_name}
                          onChange={(e) => {
                            setProduct_name(e.target.value);
                            setImage(e.target.value + ".png");
                          }}
                          className="form-input"
                          required
                        >
                          <option value="">Select General AC model</option>
                          <option value="General 2.0 Ton 3 STAR">
                            General 2.0 Ton 3 STAR
                          </option>
                        </select>
                      </>
                    ) : product_type === "AC" && brand === "Singer" ? (
                      <>
                        <label className="form-label">Product Name:</label>
                        <select
                          value={product_name}
                          onChange={(e) => {
                            setProduct_name(e.target.value);
                            setImage(e.target.value + ".png");
                          }}
                          className="form-input"
                          required
                        >
                          <option value="">Select Singer AC model</option>
                          <option value="Singer 2 Ton 5 STAR">
                            Singer 2 Ton 5 STAR
                          </option>
                          <option value="Singer Split AC 1.5 Ton">
                            Singer Split AC 1.5 Ton
                          </option>
                        </select>
                      </>
                    ) : product_type === "WashingMachine" &&
                      brand === "Panasonic" ? (
                      <>
                        <label className="form-label">Product Name:</label>
                        <select
                          value={product_name}
                          onChange={(e) => {
                            setProduct_name(e.target.value);
                            setImage(e.target.value + ".png");
                          }}
                          className="form-input"
                          required
                        >
                          <option value="">
                            Select Panasonic Washing Machine model
                          </option>
                          <option value="Panasonic NA-F80A7HRB">
                            Panasonic NA-F80A7HRB
                          </option>
                          <option value="Panasonic NA-F60A7HRB">
                            Panasonic NA-F60A7HRB
                          </option>
                        </select>
                      </>
                    ) : product_type === "WashingMachine" &&
                      brand === "Walton" ? (
                      <>
                        <label className="form-label">Product Name:</label>
                        <select
                          value={product_name}
                          onChange={(e) => {
                            setProduct_name(e.target.value);
                            setImage(e.target.value + ".png");
                          }}
                          className="form-input"
                          required
                        >
                          <option value="">
                            Select Walton Washing Machine model
                          </option>
                          <option value="Walton WM 80S">Walton WM 80S</option>
                          <option value="Walton WM 100S">Walton WM 100S</option>
                        </select>
                      </>
                    ) : null}

                    {/* Other form fields */}
                    <label className="form-label">Price:</label>
                    <input
                      type="number"
                      placeholder="Enter Price"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="form-input"
                      required
                    />

                    <label className="form-label">Quantity:</label>
                    <input
                      type="number"
                      placeholder="Enter Quantity"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
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
          ) : userShop_type ? (
            <div style={{ padding: "20px", textAlign: "center" }}>
              <h2>Store type "{userShop_type}" is not supported yet</h2>
              <p>Only Electronics stores are currently supported.</p>
            </div>
          ) : (
            <div style={{ padding: "20px", textAlign: "center" }}>
              <h2>Loading...</h2>
              <p>Fetching your store information...</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default VendorDashboardPage;
