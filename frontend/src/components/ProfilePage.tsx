import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { get_user_role, getProfile, updateProfile } from "../api";
import Header from "./Header";
import Footer from "./Footer";
import "./Main.css";

function ProfilePage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [, setError] = useState<string>("");
  const [userRole, setUserRole] = useState<string | null>(null);
  const [profile, setProfile] = useState<{
    username: string;
    email: string;
    password: string;
    date_joined: string;
    id: number;
  } | null>(null);
  const navigate = useNavigate();

  // For update
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  useEffect(() => {
    // Check if access tokens exists in localStorage
    if (!localStorage.getItem("access_token")) {
      setIsAuthenticated(false);
      navigate("/login");
    } else {
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

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!profile) return;
      const response = await updateProfile(
        profile.id,
        username,
        email,
        password
      );
      if (response) {
        window.location.reload();
      }
    } catch (err: unknown) {
      setError("Update Failed. Please try again");
    }
  };

  return (
    <>
      <Header isAuthenticated={isAuthenticated} userRole={userRole} />

      <main className="main-content">
        <div className="profile-page-container">
          <div className="profile-container">
            {/* Profile View */}
            <div className="profile-details">
              <h2 className="section-title">Profile Details</h2>
              <div className="profile-info">
                <div className="profile-item">
                  <p className="profile-label">Username:</p>
                  <p className="profile-value">{profile?.username}</p>
                </div>
                <div className="profile-item">
                  <p className="profile-label">Email:</p>
                  <p className="profile-value">{profile?.email}</p>
                </div>
                <div className="profile-item">
                  <p className="profile-label">Password:</p>
                  <p className="profile-value">******</p>
                </div>
                <div className="profile-item">
                  <p className="profile-label">Date Joined:</p>
                  <p className="profile-value">{profile?.date_joined}</p>
                </div>
              </div>
            </div>

            {/* Profile Update Form */}
            <div className="profile-update">
              <h1 className="form-title">Update Your Profile</h1>
              <form onSubmit={handleUpdate} className="form">
                <label className="form-label">Username:</label>
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="form-input"
                  required
                />
                <label className="form-label">Email:</label>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  required
                />
                <label className="form-label">Password:</label>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  required
                />
                <button type="submit" className="form-button">
                  Update
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default ProfilePage;
