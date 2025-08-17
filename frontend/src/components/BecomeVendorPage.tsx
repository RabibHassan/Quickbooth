import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout, getProfile, vendorForm } from "../api";
import "./Main.css";

function BecomeVendorPage() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
    const [, setError] = useState<string>("");
    const navigate = useNavigate();
    const [profile, setProfile] = useState<{ id: string } | null>(null);

    useEffect(() => {
        //Check if access tokens exists in localStorage
        if (!localStorage.getItem("access_token")) {
            setIsAuthenticated(false);
            navigate("/login");
        }
        else {
            getProfile().then(res => { setProfile(res.data); })
        }
    }, [navigate]);

    const [store_name, setStore_name] = useState<string>("");
    const [stype, setStype] = useState<string>("");


    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const handleVendorform = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (!profile) return;
            const response = await vendorForm(store_name);
            if (response) {
                window.location.reload();
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err: unknown) {
            setError("Registration Failed. Please try again");
        }
    }

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
                    <img onClick={() => { navigate("/profile"); window.location.reload(); }} className="icon-img" src="/images/icon.png" />
                </div>
                <div className="cart">
                    <img className="cart-img" src="/images/cart.png" />
                </div>
                <div className="details">
                    <div style={{ paddingTop: "10px", paddingLeft: "5px" }}>
                        <p className="info">Contact us now</p>
                    </div>
                    <div>
                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                            <img style={{
                                width: "30px",
                                height: "30px"
                            }} src="/images/call.png" />
                            <div>
                                <p className="info">+880-1739933678</p>
                            </div>
                        </div>
                    </div>
                    <div style={{ paddingBottom: "10px", paddingRight: "25px" }}>
                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                            <img style={{
                                paddingRight: "5px",
                                width: "15px",
                                height: "15px"
                            }} src="/images/link.png" />
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
                    <p className="h2n" onClick={() => {
                        navigate("/main");
                        window.location.reload();
                    }}>≡Home</p>
                </div>
                <div className="header2names">
                    <p className="h2n">View shops</p>
                </div>
                <div className="header2names">
                    <p onClick={() => navigate("/becomeVendor")} className="h2n">Become a vendor</p>
                </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <h2 style={{ color: "white", paddingBottom: "20px" }}>Become a Vendor Now!</h2>
            </div>
            <div className="vendor-container">
                <form onSubmit={handleVendorform}>
                    <div>
                        <div style={{ display: "flex", flexDirection: "row" }}>
                            <div>
                                <p style={{ fontWeight: "bold", color: "#cc85bc", paddingBottom: "10px", fontSize: "20px", paddingLeft: "20px", paddingTop: "20px" }}>Enter Store Name: </p>
                                <input style={{ marginLeft: "20px", paddingLeft: "10px", border: "none", marginRight: "20px", width: "470px" }}
                                    type="text"
                                    placeholder="Store Name"
                                    value={store_name}
                                    onChange={(e) => setStore_name(e.target.value)}
                                    required
                                    className="box" />
                            </div>
                            <div>
                                <p style={{ fontWeight: "bold", color: "#cc85bc", paddingBottom: "10px", fontSize: "20px", paddingTop: "20px" }}>Enter Store Type: </p>
                                <input style={{ marginRight: "20px", paddingLeft: "10px", border: "none", width: "470px" }}
                                    type="text"
                                    placeholder="Store Type"
                                    value={stype}
                                    onChange={(e) => setStype(e.target.value)}
                                    required
                                    className="box" />
                            </div>
                        </div>
                        <button style={{ width: "60px", height: "40px", marginLeft: "470px" }} className="logout-b" type="submit">
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default BecomeVendorPage;
