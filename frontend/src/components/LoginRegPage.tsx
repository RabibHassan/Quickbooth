import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, register } from "../api"; // Import login and register functions
import "./Login.css";

function LoginRegPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>(""); // For registration
  const [error, setError] = useState<string>("");
  const [active, setActive] = useState(false); // State to toggle between login and register
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login(email, password);
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);
      navigate("/main");
    } catch (err: any) {
      setError("Invalid Credentials");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await register(username, email, password);
      if (response) {
        window.location.reload();
      }
    } catch (err: any) {
      setError("Registration Failed. Please try again");
    }
  };

  return (
    <div className={`container ${active ? "active" : ""}`}>
      {/* Sign In Form */}
      <div className="form-container sign-in">
        <form style={{ backgroundColor: "#272727" }} onSubmit={handleLogin}>
          <h1 style={{ color: "#EEEEEE" }}>Sign In</h1>
          <div className="social-icons"></div>
          <span style={{ paddingBottom: "10px", color: "#EEEEEE" }}>
            Use your email password to login
          </span>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <a style={{ color: "#EEEEEE" }} href="#">
            Forget Your Password?
          </a>
          <button style={{ border: "None" }} type="submit">
            Sign In
          </button>
        </form>
      </div>

      {/* Sign Up Form */}
      <div className="form-container sign-up">
        <form style={{ backgroundColor: "#272727" }} onSubmit={handleRegister}>
          <h1 style={{ color: "#EEEEEE" }}>Create Account</h1>
          <div className="social-icons"></div>
          <span style={{ color: "#EEEEEE", paddingBottom: "10px" }}>
            Your credentials are protected
          </span>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button style={{ border: "None" }} type="submit">
            Sign Up
          </button>
        </form>
      </div>

      {/* Toggle Panel */}
      <div className="toggle-container">
        <div className="toggle">
          {/* Left Panel */}
          <div className="toggle-panel toggle-left">
            <h1>Welcome Back!</h1>
            <p>Enter your personal details to use all of site features</p>
            <button className="hidden" onClick={() => setActive(false)}>
              Sign In
            </button>
          </div>

          {/* Right Panel */}
          <div className="toggle-panel toggle-right">
            <h1>Hello, Friend!</h1>
            <p>Register with your personal details to use all our features</p>
            <button className="hidden" onClick={() => setActive(true)}>
              Sign Up
            </button>
          </div>
        </div>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default LoginRegPage;
