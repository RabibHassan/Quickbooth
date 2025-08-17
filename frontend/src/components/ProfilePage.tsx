import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout, getProfile, updateProfile } from "../api";
import "./Main.css";

function ProfilePage() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
    const [, setError] = useState<string>("");
    const [profile, setProfile] = useState<{ username: string, email: string, password: string, date_joined: string, id: string } | null>(null);
    const navigate = useNavigate();

    //for update
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

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

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!profile) return;
            const response = await updateProfile(profile.id, username, email, password);
            if (response) {
                window.location.reload();
            }
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        catch (err: unknown) {
            setError("Registration Failed. Please try again");
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
                    <input
                        className="searchbar"
                        type="text"
                        placeholder="Search for products"
                    ></input>
                </div>
                <div className="icon">
                    <img onClick={() => navigate("/profile")} className="icon-img" src="/images/icon.png" />
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

            {/* //Profile view starts here */}
            <div>
                <div className="pcontainers">
                    <div className="pcn1">
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", borderBottom: "1px solid #555" }}>
                            <h2 style={{ color: "aliceblue", paddingTop: "15px", paddingBottom: "40px" }}>Profile Details</h2>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", flexDirection: "column", }} className="pcn1-sector">
                            <div style={{ display: "flex", justifyContent: "left", flexDirection: "row", borderBottom: "1px solid #555", paddingTop: "20px" }}>
                                <p style={{ fontWeight: "bold", color: "#cc85bc", paddingBottom: "50px", paddingLeft: "20px", fontSize: "25px" }}>Username: </p>
                                <p style={{ fontWeight: "bold", fontSize: "20px", color: "aliceblue", paddingLeft: "15px" }}>{profile?.username}</p>
                            </div>
                            <div style={{ display: "flex", justifyContent: "left", flexDirection: "row", borderBottom: "1px solid #555", paddingTop: "20px" }}>
                                <p style={{ fontWeight: "bold", color: "#cc85bc", paddingBottom: "50px", paddingLeft: "20px", fontSize: "25px" }}>Email: </p>
                                <p style={{ fontWeight: "bold", fontSize: "20px", color: "aliceblue", paddingLeft: "15px" }}>{profile?.email}</p>
                            </div>
                            <div style={{ display: "flex", justifyContent: "left", flexDirection: "row", borderBottom: "1px solid #555", paddingTop: "20px" }}>
                                <p style={{ fontWeight: "bold", color: "#cc85bc", paddingBottom: "50px", paddingLeft: "20px", fontSize: "25px" }}>Password: </p>
                                <p style={{ fontWeight: "bold", fontSize: "20px", color: "aliceblue", paddingLeft: "15px" }}>#######</p>
                            </div>
                            <div style={{ display: "flex", justifyContent: "left", flexDirection: "row", borderBottom: "1px solid #555", paddingTop: "20px" }}>
                                <p style={{ fontWeight: "bold", color: "#cc85bc", paddingBottom: "50px", paddingLeft: "20px", fontSize: "25px" }}>Date joined: </p>
                                <p style={{ fontWeight: "bold", fontSize: "20px", color: "aliceblue", paddingLeft: "15px" }}>{profile?.date_joined}</p>
                            </div>
                        </div>
                    </div>
                    <div className="pcn2">
                        <form onSubmit={handleUpdate}>
                            <h1 style={{ color: "white", paddingLeft: "20px", paddingTop: "20px", paddingBottom: "20px" }}>Update Your Profile</h1>
                            <div className="form">
                                <p style={{ fontWeight: "bold", color: "#cc85bc", paddingBottom: "10px", fontSize: "20px" }}>Username: </p>
                                <input
                                    style={{ paddingLeft: "10px", border: "none" }}
                                    type="text"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    className="box"
                                />
                                <p style={{ fontWeight: "bold", color: "#cc85bc", paddingBottom: "10px", fontSize: "20px" }}>Email: </p>
                                <input
                                    style={{ paddingLeft: "10px" }}
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="box"
                                />
                                <p style={{ fontWeight: "bold", color: "#cc85bc", paddingBottom: "10px", fontSize: "20px" }}>Password: </p>
                                <input
                                    style={{ paddingLeft: "10px" }}
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="box"
                                />
                                <button style={{ width: "60px", height: "40px" }} className="logout-b" type="submit">
                                    Update
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
