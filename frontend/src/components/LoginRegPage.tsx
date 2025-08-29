import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, register } from "../api";
import "./Login.css";

function LoginRegPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [active, setActive] = useState(false);
  const navigate = useNavigate();
  const [alert, setAlert] = useState<{
    show: boolean;
    message: string;
    type: "error" | "warning";
  } | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login(email, password);
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);
      navigate("/main");
    } catch (err: any) {
      setError("Invalid Credentials");
      setAlert({
        show: true,
        message: "Invalid email or password",
        type: "error",
      });
      setTimeout(() => setAlert(null), 3000); // Hide after 3 seconds
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
      setError("Registration Failed");
      if (err.response?.data?.error === "Invalid Credentials") {
        setAlert({
          show: true,
          message: "Username already exists",
          type: "warning",
        });
      } else if (err.response?.data?.error === "Email already taken") {
        setAlert({
          show: true,
          message: "Email already registered",
          type: "warning",
        });
      } else {
        setAlert({
          show: true,
          message: "Registration failed",
          type: "error",
        });
      }
      setTimeout(() => setAlert(null), 3000); // Hide after 3 seconds
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#222222",
        zIndex: 9999,
      }}
    >
      {/* Add alert display */}
      {alert && (
        <div className={`alert alert-${alert.type}`}>
          {alert.type === "error" ? "❌" : "⚠️"} {alert.message}
        </div>
      )}
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
          <form
            style={{ backgroundColor: "#272727" }}
            onSubmit={handleRegister}
          >
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

        {error && (
          <p
            style={{
              color: "red",
              position: "absolute",
              bottom: "-40px",
              left: "50%",
              transform: "translateX(-50%)",
              textAlign: "center",
            }}
          >
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

export default LoginRegPage;
